"use client";

/**
 * RecordGallery3D — 3D 透视卡片堆叠组件
 *
 * 架构说明：
 * - Option C 一体化：卡片本身就是展开/收纳元素，无 overlay、无 DOM 交换
 * - 方案B 动画层：关闭时在 preserve-3d 外部渲染动画卡片，overflow:hidden 有效
 *   解决了 CSS 3D 上下文中白色区域穿模的问题
 * - 弹簧动画（stiffness:68, damping:19, mass:0.98）用于展开/收纳
 * - Tween 动画用于滚轮切换卡片
 *
 * 文件结构：
 * - types.ts      → 所有类型定义
 * - constants.ts  → 布局/动画常量（调参改这里）
 * - data.ts       → 卡片数据（后期替换为 API）
 * - layout.ts     → 布局计算 + 响应式工具函数
 * - api.ts        → 数据加载 + fallback 生成
 * - CardFace.tsx  → 卡片正面 UI
 * - DetailContent.tsx → 展开详情页
 */

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, startTransition, memo, type MouseEvent as ReactMouseEvent, type TouchEvent as ReactTouchEvent, type WheelEvent as ReactWheelEvent } from "react";
import type { RecordCard, CompanyDetailPayload, CardLayoutItem, RecordGallery3DProps } from "./types";
import { CARDS } from "./data";
import {
  VISIBLE_COUNT, BASE_Y, ROW_STEP, BASE_WIDTH, WIDTH_STEP,
  HIT_Y_OFFSET_BY_SLOT, HIT_HEIGHT_BY_SLOT,
  SCROLL_TRANSITION_MS, ACTIVE_TRANSITION_MS,
  WHEEL_STEP_SIZE, TOUCH_STEP_SIZE, MAX_WHEEL_STEP, MAX_TOUCH_STEP,
  EDGE_FADE_WIDTH, MIN_CLICKABLE_OPACITY, FRONT_ACTIVE_START,
  CLICK_AFTER_SCROLL_DELAY_MS, CONFIRM_CLICK_DELAY_MS, SWITCH_REOPEN_DELAY_MS,
  DETAIL_HEAVY_CONTENT_DELAY_MS, SPRING_CONFIG,
} from "./constants";
import { getCardVisualState, getCardFaceRenderState, getDetailTargetRect, getStackWidth, getPerspective } from "./layout";
import { fallbackDetail, normalizeCompanyDetail, loadCompanyDetail } from "./api";
import { CardFace } from "./CardFace";
import { InlineDetailContent } from "./DetailContent";

export default function RecordGallery3D({ onBackToStart }: RecordGallery3DProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [closingSymbol, setClosingSymbol] = useState<string | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, CompanyDetailPayload>>({});
  const [detailHeavyReadySymbol, setDetailHeavyReadySymbol] = useState<string | null>(null);
  const [detailMountedSymbol, setDetailMountedSymbol] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const detailCacheRef = useRef(new Map<string, CompanyDetailPayload>());
  const detailOpenRef = useRef(false);
  const scrollPositionRef = useRef(0);
  const scrollFrameRef = useRef<number | null>(null);
  const pendingScrollPositionRef = useRef(0);
  const touchYRef = useRef<number | null>(null);
  const activeSinceRef = useRef(0);
  const lastScrollAtRef = useRef(0);
  const pendingActiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ─── 布局计算 ─── */
  const layout = useMemo((): CardLayoutItem[] => {
    const basePosition = Math.floor(scrollPosition);
    const fractionalOffset = scrollPosition - basePosition;
    const displayCards = Array.from({ length: VISIBLE_COUNT + 2 }, (_, position) => {
      const slot = position - 1;
      const index = (basePosition + slot + CARDS.length * 2) % CARDS.length;
      const motionSlot = slot - fractionalOffset;
      return { card: CARDS[index], index, slot, motionSlot };
    });
    const activeMotionSlot = displayCards.find((item) => item.index === activeIndex)?.motionSlot ?? null;
    const frontActiveMotion = activeMotionSlot !== null && activeMotionSlot > FRONT_ACTIVE_START;

    return displayCards.map(({ card, index, slot, motionSlot }) => {
      const isActive = index === activeIndex;
      const isFrontActive = isActive && motionSlot > FRONT_ACTIVE_START;
      const beforeActive = activeMotionSlot !== null && motionSlot < activeMotionSlot;
      const afterActive = activeMotionSlot !== null && motionSlot > activeMotionSlot;
      const activeGap = beforeActive
        ? frontActiveMotion ? (isRouting ? -54 : -34) : (isRouting ? -56 : -36)
        : afterActive ? (isRouting ? 56 : 40) : 0;
      const activeLift = isActive ? (isRouting ? (isFrontActive ? -30 : 20) : isFrontActive ? -22 : -3) : 0;
      const activeZBoost = isActive ? (isRouting ? (isFrontActive ? 92 : 150) : isFrontActive ? 34 : 68) : 0;
      const activeWidthBoost = isActive ? (isRouting ? (isFrontActive ? 62 : 82) : isFrontActive ? 18 : 24) : 0;
      const topFade = motionSlot < 0 ? Math.max(0, 1 + motionSlot / EDGE_FADE_WIDTH) : 1;
      const bottomFade = motionSlot > VISIBLE_COUNT - 1 ? Math.max(0, (VISIBLE_COUNT - motionSlot) / EDGE_FADE_WIDTH) : 1;
      const opacity = Math.min(topFade, bottomFade);
      const isClickableSlot = opacity >= MIN_CLICKABLE_OPACITY && motionSlot >= 0 && motionSlot <= VISIBLE_COUNT - 1;

      return {
        card, index, slot, motionSlot, opacity, isClickableSlot,
        y: BASE_Y + motionSlot * ROW_STEP + activeGap + activeLift,
        z: -215 + motionSlot * 22 + activeZBoost,
        width: BASE_WIDTH + motionSlot * WIDTH_STEP + activeWidthBoost,
        height: isActive ? (isRouting ? (isFrontActive ? 128 : 132) : isFrontActive ? 104 : 96) : Math.min(70 + motionSlot * 1.6, 84),
        tilt: isActive ? (isFrontActive ? -16 : -26) : -26,
        roll: isActive ? (isFrontActive ? -0.18 : -1.1) : 0,
      };
    });
  }, [activeIndex, isRouting, scrollPosition]);

  /* ─── 方案B：关闭动画层数据 ─── */
  const closingLayoutItem = closingSymbol
    ? layout.find((item) => item.card.symbol === closingSymbol) ?? null
    : null;

  const clickableCards = layout.filter(({ isClickableSlot }) => isClickableSlot).sort((a, b) => a.y - b.y);

  /* ─── 卡片点击与展开（两次点击流程） ─── */
  const handleCardClick = (index: number, event: ReactMouseEvent<HTMLButtonElement>) => {
    const now = event.timeStamp;
    if (now - lastScrollAtRef.current < CLICK_AFTER_SCROLL_DELAY_MS) return;
    if (expandedSymbol) return;

    // 第一次点击：激活卡片（抬起）
    if (activeIndex !== index) {
      const card = CARDS[index];
      setIsRouting(false);
      if (pendingActiveTimerRef.current) {
        clearTimeout(pendingActiveTimerRef.current);
        pendingActiveTimerRef.current = null;
      }

      // 如果已有 active 卡片，先收回再切换（50ms 延迟）
      if (activeIndex !== null) {
        activeSinceRef.current = 0;
        setActiveIndex(null);
        pendingActiveTimerRef.current = setTimeout(() => {
          activeSinceRef.current = performance.now();
          pendingActiveTimerRef.current = null;
          setActiveIndex(index);
          warmCompanyDetail(card);
        }, SWITCH_REOPEN_DELAY_MS);
        return;
      }

      activeSinceRef.current = now;
      setActiveIndex(index);
      warmCompanyDetail(card);
      return;
    }

    // 第二次点击同一张卡片：展开详情（需超过确认延迟）
    if (now - activeSinceRef.current < CONFIRM_CLICK_DELAY_MS) return;

    const card = CARDS[index];
    const cardElement = cardRefs.current.get(card.symbol);
    if (!cardElement) return;

    performance.mark("expand-start");
    setIsRouting(true);
    warmCompanyDetail(card);
    setExpandedSymbol(card.symbol);
  };

  const closeDetailOverlay = () => {
    if (!expandedSymbol || closingSymbol) return;
    setClosingSymbol(expandedSymbol);
    setExpandedSymbol(null);
    setDetailHeavyReadySymbol(null);
    setIsRouting(false);
    setActiveIndex(null);
    setHoveredIndex(null);
  };

  const handleDetailWheel = (e: ReactWheelEvent<HTMLDivElement>) => { e.stopPropagation(); };
  const handleDetailTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => { e.stopPropagation(); };
  const handleDetailTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => { e.stopPropagation(); };

  /* ─── 数据预加载（startTransition 隔离 re-render，不打断动画） ─── */
  const warmCompanyDetail = (card: RecordCard) => {
    if (detailCacheRef.current.has(card.symbol)) {
      startTransition(() => {
        setDetailCache((prev) => ({ ...prev, [card.symbol]: detailCacheRef.current.get(card.symbol)! }));
      });
      return;
    }
    const fb = fallbackDetail(card);
    detailCacheRef.current.set(card.symbol, fb);
    startTransition(() => {
      setDetailCache((prev) => ({ ...prev, [card.symbol]: fb }));
    });
    loadCompanyDetail(card.symbol).then((detail) => {
      if (!detail) return;
      const normalized = normalizeCompanyDetail(card, detail);
      detailCacheRef.current.set(card.symbol, normalized);
      startTransition(() => {
        setDetailCache((prev) => ({ ...prev, [card.symbol]: normalized }));
      });
    });
  };

  const detailHeavyReady = detailHeavyReadySymbol === expandedSymbol;

  /* ─── 副作用：详情延迟挂载（startTransition 避免阻塞动画帧） ─── */
  useEffect(() => {
    if (!expandedSymbol) { setDetailMountedSymbol(null); return; }
    const raf = requestAnimationFrame(() => {
      startTransition(() => setDetailMountedSymbol(expandedSymbol));
    });
    return () => cancelAnimationFrame(raf);
  }, [expandedSymbol]);

  useEffect(() => {
    if (!expandedSymbol) return;
    const timer = window.setTimeout(() => {
      setDetailHeavyReadySymbol(expandedSymbol);
    }, DETAIL_HEAVY_CONTENT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [expandedSymbol]);

  useEffect(() => { detailOpenRef.current = !!expandedSymbol || !!closingSymbol; }, [expandedSymbol, closingSymbol]);
  useEffect(() => { scrollPositionRef.current = scrollPosition; }, [scrollPosition]);

  /* ─── 副作用：滚轮/触摸事件（Mac 触控板 + 手机适配） ─── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const commitScrollPosition = () => {
      scrollFrameRef.current = null;
      setScrollPosition(pendingScrollPositionRef.current);
    };

    const moveCardsBy = (stepDelta: number) => {
      const nextPosition = (scrollPositionRef.current + stepDelta + CARDS.length) % CARDS.length;
      scrollPositionRef.current = nextPosition;
      pendingScrollPositionRef.current = nextPosition;
      activeSinceRef.current = 0;
      lastScrollAtRef.current = performance.now();
      if (pendingActiveTimerRef.current) {
        clearTimeout(pendingActiveTimerRef.current);
        pendingActiveTimerRef.current = null;
      }
      if (detailOpenRef.current) return;
      setHoveredIndex(null);
      setActiveIndex(null);
      setIsRouting(false);
      if (scrollFrameRef.current === null) {
        scrollFrameRef.current = window.requestAnimationFrame(commitScrollPosition);
      }
    };

    /* Mac 触控板适配：deltaMode 0 = 像素级滚动（触控板），1 = 行级（鼠标） */
    const handleWheel = (event: WheelEvent) => {
      if (!section.contains(event.target as Node)) return;
      if ((event.target as Element | null)?.closest("[data-detail-scroll]")) return;
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();

      // Mac 触控板产生更细腻的 deltaY，用更大的除数平滑
      const isFineScroll = event.deltaMode === 0 && Math.abs(event.deltaY) < 40;
      const stepSize = isFineScroll ? WHEEL_STEP_SIZE * 1.6 : WHEEL_STEP_SIZE;
      const stepDelta = Math.max(-MAX_WHEEL_STEP, Math.min(MAX_WHEEL_STEP, event.deltaY / stepSize));
      if (Math.abs(stepDelta) < 0.02) return;
      if (isRouting) return;
      moveCardsBy(stepDelta);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if ((event.target as Element | null)?.closest("[data-detail-scroll]")) return;
      touchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if ((event.target as Element | null)?.closest("[data-detail-scroll]")) return;
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
      const nextY = event.touches[0]?.clientY;
      const lastY = touchYRef.current;
      if (nextY === undefined || lastY === null) return;
      const deltaY = lastY - nextY;
      touchYRef.current = nextY;
      const stepDelta = Math.max(-MAX_TOUCH_STEP, Math.min(MAX_TOUCH_STEP, deltaY / TOUCH_STEP_SIZE));
      if (Math.abs(stepDelta) < 0.018 || isRouting) return;
      moveCardsBy(stepDelta);
    };

    const handleTouchEnd = () => { touchYRef.current = null; };

    const wheelOptions: AddEventListenerOptions = { passive: false, capture: true };
    const touchMoveOptions: AddEventListenerOptions = { passive: false };
    window.addEventListener("wheel", handleWheel, wheelOptions);
    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, touchMoveOptions);
    section.addEventListener("touchend", handleTouchEnd);
    section.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
      window.removeEventListener("wheel", handleWheel, wheelOptions);
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove, touchMoveOptions);
      section.removeEventListener("touchend", handleTouchEnd);
      section.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isRouting]);

  /* ─── 副作用：锁定页面滚动 ─── */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = { ho: html.style.overflow, hob: html.style.overscrollBehavior, bo: body.style.overflow, bob: body.style.overscrollBehavior };
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    return () => { html.style.overflow = prev.ho; html.style.overscrollBehavior = prev.hob; body.style.overflow = prev.bo; body.style.overscrollBehavior = prev.bob; };
  }, []);

  useEffect(() => { return () => { if (pendingActiveTimerRef.current) clearTimeout(pendingActiveTimerRef.current); if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current); }; }, []);

  /* ─── 点击区域计算 ─── */
  const getHitMetrics = (item: (typeof clickableCards)[number]) => {
    const isActive = item.index === activeIndex;
    const hitSlot = Math.max(0, Math.min(VISIBLE_COUNT - 1, Math.round(item.motionSlot)));
    const isFrontCard = hitSlot === VISIBLE_COUNT - 1;
    const yOffset = isActive ? (isFrontCard ? 2 : 0) : isFrontCard ? 26 : 4 + HIT_Y_OFFSET_BY_SLOT[hitSlot];
    const centerY = item.y + yOffset;
    const width = isActive ? Math.min(540, Math.max(320, item.width + 100)) : Math.max(174, item.width + (isFrontCard ? 42 : -44));
    const height = isActive ? Math.max(90, item.height + 4) : isFrontCard ? 62 : HIT_HEIGHT_BY_SLOT[hitSlot];
    return { centerY, height, hitSlot, width, xOffset: 0 };
  };

  /* ═══════════════════════════════════════════════════════════════
     渲染
     ═══════════════════════════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      id="companies"
      data-lenis-prevent
      className="relative flex h-[100svh] touch-none items-center justify-center overflow-hidden overscroll-none px-4 py-8 text-[#111]"
      style={{ background: "linear-gradient(90deg, #c9dcb2 0%, #eef1dc 16%, #f5f3ed 50%, #e8f0cf 84%, #b7d392 100%)" }}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[18vw] min-w-40 bg-[linear-gradient(135deg,rgba(211,235,137,0.55),rgba(225,76,91,0.22)_48%,rgba(55,99,79,0.28))]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[18vw] min-w-40 bg-[linear-gradient(225deg,rgba(54,114,59,0.55),rgba(176,211,120,0.36)_50%,rgba(239,161,173,0.24))]" />

      <div className="relative h-[min(760px,calc(100svh-64px))] min-h-0 w-full max-w-[1320px] overflow-hidden overscroll-none bg-[#f3f1ea] shadow-[0_24px_80px_rgba(42,56,31,0.18)]">
        <button
          type="button"
          onClick={onBackToStart}
          className="absolute left-5 top-5 z-20 rounded-[5px] bg-[#57584f] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_18px_rgba(0,0,0,0.22)] transition hover:bg-[#34362f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f65370]"
        >
          Back to start
        </button>

        <div className="absolute left-1/2 top-[49%] z-10 w-full max-w-[940px] -translate-x-1/2 -translate-y-1/2">
          <div
            className="relative mx-auto h-full max-h-[650px] min-h-[520px] w-full touch-none overscroll-none"
            style={{ perspective: getPerspective(), perspectiveOrigin: "50% 35%" }}
          >
            {/* ─── preserve-3d 堆叠层 ─── */}
            <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              {/* 方案2：提取到 map 外部，避免 12 张卡片重复计算 */}
              {(() => {
                const expandTarget = getDetailTargetRect();
                const expandW = expandTarget.width;
                const expandH = expandTarget.height;
                const stackWidth = getStackWidth();

                return layout.map(({ card, index, motionSlot, opacity, y, z, width, height, tilt, roll }) => {
                const isActive = index === activeIndex;
                const isHovered = hoveredIndex === index && !isActive && activeIndex === null;
                const motionDuration = activeIndex !== null || isActive ? ACTIVE_TRANSITION_MS : SCROLL_TRANSITION_MS;
                const item = { card, index, slot: 0, motionSlot, opacity, isClickableSlot: true, y, z, width, height, tilt, roll };
                const visual = getCardVisualState(item, isActive ? "active" : "stack");
                const faceState = getCardFaceRenderState(visual);
                const isExpanded = expandedSymbol === card.symbol;
                const isClosing = closingSymbol === card.symbol;
                const isExpandedOrClosing = isExpanded || isClosing;

                const cardTransition = isExpandedOrClosing ? SPRING_CONFIG : {
                  type: "tween" as const,
                  duration: motionDuration / 1000,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  opacity: { duration: SCROLL_TRANSITION_MS / 1000, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
                };

                const shouldFadeOut = !!expandedSymbol && !isExpandedOrClosing;
                const cardAnimate = {
                  y: isExpanded ? 0 : visual.y,
                  z: isExpanded ? 0 : visual.z,
                  rotateX: isExpanded ? 0 : visual.tilt,
                  rotateZ: isExpanded ? 0 : visual.roll,
                  scaleX: isExpanded ? 1 : visual.scaleX,
                  width: isExpanded ? expandW : stackWidth,
                  height: isExpanded ? expandH : visual.height,
                  borderRadius: isExpanded ? 12 : 7,
                  opacity: isExpanded ? 1 : (shouldFadeOut ? 0 : visual.opacity),
                };

                const expandedFaceState = isExpanded ? {
                  height: Math.min(132, Math.max(108, expandH * 0.26)),
                  radius: 12, borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.08)",
                  boxShadow: "0 18px 46px rgba(0,0,0,0.36), 0 1px 0 rgba(255,255,255,0.14) inset",
                  imageScale: 1, compactTitleOpacity: 0, detailTitleOpacity: 1,
                  metaOpacity: 0.45, descriptionOpacity: 1, descriptionY: 0, hintOpacity: 0,
                } : faceState;
                const renderState = {
                  ...(isExpanded ? expandedFaceState : faceState),
                  borderColor: isHovered && !isExpandedOrClosing ? "rgba(255,255,255,0.34)" : (isExpanded ? expandedFaceState : faceState).borderColor,
                };

                const cardDetail = detailCache[card.symbol] ?? fallbackDetail(card);
                const cardProfile = cardDetail.profile ?? fallbackDetail(card).profile;

                return (
                  <motion.div
                    key={card.symbol}
                    ref={(el) => { if (el) cardRefs.current.set(card.symbol, el); else cardRefs.current.delete(card.symbol); }}
                    data-card-symbol={card.symbol}
                    data-card-active={isActive ? "true" : "false"}
                    className={`absolute select-none text-white${isExpanded ? " pointer-events-auto" : " pointer-events-none"}`}
                    initial={false}
                    animate={cardAnimate}
                    transition={cardTransition}
                    transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
                    style={{
                      left: "50%", top: "50%",
                      zIndex: isExpandedOrClosing ? 200 : visual.zIndex,
                      transformOrigin: "50% 50%",
                      willChange: "transform, width, height",
                      backfaceVisibility: "hidden",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column" as const,
                    }}
                    onAnimationComplete={() => {}}
                  >
                    <CardFace card={card} state={renderState} />
                    {detailMountedSymbol === card.symbol && (
                      <InlineDetailContent
                        card={card} detail={cardDetail} profile={cardProfile}
                        heavyReady={detailHeavyReady}
                        headerHeight={Math.min(132, Math.max(108, expandH * 0.26))}
                        totalHeight={expandH}
                        onClose={closeDetailOverlay}
                        onWheel={handleDetailWheel}
                        onTouchStart={handleDetailTouchStart}
                        onTouchMove={handleDetailTouchMove}
                      />
                    )}
                  </motion.div>
                );
              });
              })()}
            </div>
            {/* ─── 方案B：动画层（preserve-3d 外部，overflow:hidden 有效） ─── */}
            {closingSymbol && closingLayoutItem && (() => {
              const clCard = closingLayoutItem.card;
              const clVisual = getCardVisualState(closingLayoutItem, "stack");
              const clFaceState = getCardFaceRenderState(clVisual);
              const clExpandTarget = getDetailTargetRect();
              const clExpandW = clExpandTarget.width;
              const clExpandH = clExpandTarget.height;
              const clStackWidth = getStackWidth();
              const clDetail = detailCache[clCard.symbol] ?? fallbackDetail(clCard);
              const clProfile = clDetail.profile ?? fallbackDetail(clCard).profile;

              return (
                <motion.div
                  key={`closing-layer-${clCard.symbol}`}
                  className="absolute select-none text-white pointer-events-auto"
                  initial={{ y: 0, z: 0, rotateX: 0, rotateZ: 0, scaleX: 1, width: clExpandW, height: clExpandH, borderRadius: 12, opacity: 1 }}
                  animate={{ y: clVisual.y, z: clVisual.z, rotateX: clVisual.tilt, rotateZ: clVisual.roll, scaleX: clVisual.scaleX, width: clStackWidth, height: clVisual.height, borderRadius: 7, opacity: 0 }}
                  transition={{ ...SPRING_CONFIG, opacity: { type: "tween", duration: 0.28, delay: 0.38, ease: "easeIn" } }}
                  transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
                  style={{ left: "50%", top: "50%", zIndex: 200, transformOrigin: "50% 50%", willChange: "transform, width, height", overflow: "hidden", display: "flex", flexDirection: "column" as const }}
                  onAnimationComplete={() => { setClosingSymbol(null); activeSinceRef.current = performance.now(); }}
                >
                  <CardFace card={clCard} state={clFaceState} />
                  <InlineDetailContent
                    card={clCard} detail={clDetail} profile={clProfile}
                    heavyReady={false}
                    headerHeight={Math.min(132, Math.max(108, clExpandH * 0.26))}
                    totalHeight={clExpandH}
                    onClose={closeDetailOverlay}
                    onWheel={handleDetailWheel}
                    onTouchStart={handleDetailTouchStart}
                    onTouchMove={handleDetailTouchMove}
                  />
                </motion.div>
              );
            })()}

            {/* ─── 点击区域层 ─── */}
            <div className={`absolute inset-0 z-[100]${expandedSymbol || closingSymbol ? " pointer-events-none" : ""}`} aria-hidden="true">
              {clickableCards.map((item, order) => {
                const { card, index } = item;
                const isActive = index === activeIndex;
                const metrics = getHitMetrics(item);
                const prevM = clickableCards[order - 1] ? getHitMetrics(clickableCards[order - 1]) : null;
                const nextM = clickableCards[order + 1] ? getHitMetrics(clickableCards[order + 1]) : null;
                const bandTop = prevM ? (prevM.centerY + metrics.centerY) / 2 + 6 : metrics.centerY - metrics.height / 2;
                const bandBottom = nextM ? (metrics.centerY + nextM.centerY) / 2 - 6 : metrics.centerY + metrics.height / 2;
                const safeTop = Math.max(metrics.centerY - metrics.height / 2, bandTop);
                const safeBottom = Math.min(metrics.centerY + metrics.height / 2, bandBottom);
                const hitHeight = Math.max(18, safeBottom - safeTop);
                const hitY = (safeTop + safeBottom) / 2;

                return (
                  <button
                    key={card.symbol}
                    type="button"
                    tabIndex={-1}
                    className="absolute cursor-pointer bg-transparent"
                    style={{
                      appearance: "none", border: 0, outline: "none",
                      WebkitTapHighlightColor: "transparent",
                      left: "50%", top: `calc(50% + ${hitY}px)`,
                      width: `${metrics.width}px`, height: hitHeight, padding: 0,
                      transform: `translate(calc(-50% + ${metrics.xOffset}px), -50%)`,
                      zIndex: isActive ? 90 : metrics.hitSlot + 1,
                      clipPath: isActive ? "inset(0)" : "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
                    }}
                    onPointerEnter={() => setHoveredIndex(index)}
                    onPointerLeave={() => setHoveredIndex((c) => (c === index ? null : c))}
                    onClick={(event) => handleCardClick(index, event)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
