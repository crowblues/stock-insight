"use client";

/**
 * RecordGallery3D — MyChill 方案复刻
 *
 * 核心逻辑：
 * - 伪 3D（scaleX/scaleY + brightness 模拟深度）
 * - 直接 wheel + RAF 平滑插值（不依赖 Lenis）
 * - idle → peek → full 两次点击流程
 * - 展开时其他卡片推开，详情页自然滚动
 */

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useCallback, startTransition } from "react";
import type { RecordCard, CompanyDetailPayload, ActiveMode, RecordGallery3DProps } from "./types";
import { CARDS } from "./data";
import {
  CARD_W, FULL_CARD_W, CARD_H, FULL_CARD_H, GAP, STEP,
  TILT, STAGE_H, SLOTS, SHIFT_AMOUNT_PEEK, SHIFT_AMOUNT_FULL,
  TRANSITION_CONFIG, SCROLL_LERP, WHEEL_SENSITIVITY, TOUCH_SENSITIVITY,
  DETAIL_HEAVY_CONTENT_DELAY_MS,
} from "./constants";
import { fallbackDetail, normalizeCompanyDetail, loadCompanyDetail } from "./api";
import { InlineDetailContent } from "./DetailContent";

const N = CARDS.length;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function RecordGallery3D({ onBackToStart }: RecordGallery3DProps) {
  const [scrollOff, setScrollOff] = useState(0);
  const scrollRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [activeMode, setActiveMode] = useState<ActiveMode>("idle");

  const [detailCache, setDetailCache] = useState<Record<string, CompanyDetailPayload>>({});
  const [detailHeavyReadySymbol, setDetailHeavyReadySymbol] = useState<string | null>(null);
  const detailCacheRef = useRef(new Map<string, CompanyDetailPayload>());

  const touchYRef = useRef(0);

  /* ─── 数据预加载 ─── */
  const warmCompanyDetail = useCallback((card: RecordCard) => {
    if (detailCacheRef.current.has(card.symbol)) {
      startTransition(() => {
        setDetailCache((prev) => ({ ...prev, [card.symbol]: detailCacheRef.current.get(card.symbol)! }));
      });
      return;
    }
    const fb = fallbackDetail(card);
    detailCacheRef.current.set(card.symbol, fb);
    startTransition(() => { setDetailCache((prev) => ({ ...prev, [card.symbol]: fb })); });
    loadCompanyDetail(card.symbol).then((detail) => {
      if (!detail) return;
      const normalized = normalizeCompanyDetail(card, detail);
      detailCacheRef.current.set(card.symbol, normalized);
      startTransition(() => { setDetailCache((prev) => ({ ...prev, [card.symbol]: normalized })); });
    });
  }, []);

  /* ─── 交互：两次点击流程 ─── */
  const handleActivate = useCallback((slotIdx: number) => {
    if (activeCardId === slotIdx && activeMode === "peek") {
      setActiveMode("full");
    } else {
      setActiveCardId(slotIdx);
      setActiveMode("peek");
      // 预加载数据
      const albumIdx = mod(Math.floor(scrollOff / STEP) + slotIdx, N);
      warmCompanyDetail(CARDS[albumIdx]);
    }
  }, [activeCardId, activeMode, scrollOff, warmCompanyDetail]);

  const handleCollapse = useCallback(() => {
    setActiveCardId(null);
    setActiveMode("idle");
    setDetailHeavyReadySymbol(null);
  }, []);

  /* ─── 平滑滚动循环 ─── */
  const smoothLoop = useCallback(() => {
    const diff = targetRef.current - scrollRef.current;
    let d = mod(diff, N * STEP);
    if (d > (N * STEP) / 2) d -= N * STEP;
    scrollRef.current += d * SCROLL_LERP;
    scrollRef.current = mod(scrollRef.current, N * STEP);
    setScrollOff(scrollRef.current);
    if (Math.abs(d) > 0.4) {
      rafRef.current = requestAnimationFrame(smoothLoop);
    } else {
      scrollRef.current = mod(targetRef.current, N * STEP);
      setScrollOff(scrollRef.current);
      rafRef.current = null;
    }
  }, []);

  /* ─── wheel + touch 事件（与 MyChill 一致，无 snap） ─── */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // 展开时不拦截 wheel → 详情页自然滚动
      if (activeMode === "full") return;
      e.preventDefault();
      targetRef.current = mod(targetRef.current + e.deltaY * WHEEL_SENSITIVITY, N * STEP);
      if (!rafRef.current) rafRef.current = requestAnimationFrame(smoothLoop);
    };
    let ty0 = 0;
    const handleTouchStart = (e: TouchEvent) => { ty0 = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      if (activeMode === "full") return;
      e.preventDefault();
      const dy = ty0 - e.touches[0].clientY;
      ty0 = e.touches[0].clientY;
      targetRef.current = mod(targetRef.current + dy * TOUCH_SENSITIVITY, N * STEP);
      if (!rafRef.current) rafRef.current = requestAnimationFrame(smoothLoop);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, [activeMode, smoothLoop]);

  /* ─── 点击空白收起 ─── */
  useEffect(() => {
    const handleOutside = () => {
      if (activeMode !== "idle") handleCollapse();
    };
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, [activeMode, handleCollapse]);

  /* ─── 详情 heavy content 延迟加载 ─── */
  useEffect(() => {
    if (activeMode !== "full") { setDetailHeavyReadySymbol(null); return; }
    const albumIdx = mod(Math.floor(scrollOff / STEP) + (activeCardId ?? 0), N);
    const symbol = CARDS[albumIdx].symbol;
    const timer = window.setTimeout(() => setDetailHeavyReadySymbol(symbol), DETAIL_HEAVY_CONTENT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [activeMode, activeCardId, scrollOff]);

  /* ─── 锁定页面滚动（组件挂载时） ─── */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = { ho: html.style.overflow, bo: body.style.overflow };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => { html.style.overflow = prev.ho; body.style.overflow = prev.bo; };
  }, []);

  /* ─── 渲染 ─── */
  const baseIdx = Math.floor(scrollOff / STEP);
  const slots = Array.from({ length: SLOTS }, (_, s) => s);

  return (
    <section
      id="companies"
      className="relative flex h-[100svh] items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fdf6ec 0%, #f5ede0 100%)" }}
    >
      {/* 唱片店招牌（顶部） */}
      <div className="pointer-events-none absolute left-1/2 top-6 z-40 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-cp-ink-soft">
        ◈ THE COLLECTION · SIDE A ◈
      </div>

      {onBackToStart && (
        <button
          type="button"
          onClick={onBackToStart}
          className="absolute left-5 top-5 z-50 rounded-full border border-cp-line bg-white/70 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-cp-ink-soft backdrop-blur-sm transition hover:border-cp-pink hover:text-cp-pink"
        >
          ← Back
        </button>
      )}


      <div className="relative" style={{ width: CARD_W, height: STAGE_H }}>
        {slots.map((s) => {
          const albumIndex = mod(baseIdx + s, N);
          const card = CARDS[albumIndex];
          const isActive = activeCardId === s;
          const isPeek = isActive && activeMode === "peek";
          const isFull = isActive && activeMode === "full";

          // 位置计算
          const frac = mod(scrollOff, STEP);
          const y = s * STEP - frac;

          let finalY = y;
          if (activeCardId !== null && !isActive) {
            const shift = activeMode === "peek" ? SHIFT_AMOUNT_PEEK : SHIFT_AMOUNT_FULL;
            if (s < activeCardId) finalY -= shift;
            else finalY += shift;
          }

          // 伪 3D 深度
          const normY = Math.max(0, Math.min(1, y / STAGE_H));
          const scaleX = 0.52 + normY * 0.48;
          const scaleY = 0.70 + normY * 0.30;
          const bright = Math.max(0.32, 0.4 + normY * 0.6);
          const vis = y > -CARD_H - 10 && y < STAGE_H + 10;

          // 详情数据
          const cardDetail = detailCache[card.symbol] ?? fallbackDetail(card);
          const cardProfile = cardDetail.profile ?? fallbackDetail(card).profile;
          const heavyReady = detailHeavyReadySymbol === card.symbol;

          return (
            <motion.div
              key={s}
              className="absolute left-0 select-none overflow-hidden rounded-xl"
              initial={false}
              animate={{
                top: isFull ? (STAGE_H - FULL_CARD_H) / 2 : (isPeek ? finalY - 30 : finalY),
                left: isFull ? (CARD_W - FULL_CARD_W) / 2 : 0,
                width: isFull ? FULL_CARD_W : CARD_W,
                height: isFull ? FULL_CARD_H : CARD_H,
                rotateX: isFull ? 0 : (isPeek ? -25 : TILT),
                rotateZ: isFull ? 0 : (isPeek ? -6 : 0),
                scaleX: isFull ? 1 : (isPeek ? 1.04 : scaleX),
                scaleY: isFull ? 1 : (isPeek ? 1.04 : scaleY),
                filter: isFull ? "brightness(1.08)" : (isPeek ? "brightness(1.08)" : `brightness(${bright})`),
                opacity: vis ? 1 : 0,
                zIndex: isFull ? 1000 : (isPeek ? 999 : s),
                x: isFull ? 0 : (isPeek ? 12 : 0),
              }}
              transition={TRANSITION_CONFIG}
              onClick={(e) => {
                e.stopPropagation();
                if (activeCardId === null || (isActive && activeMode === "peek")) {
                  handleActivate(s);
                }
              }}
              style={{ pointerEvents: activeCardId !== null && !isActive ? "none" : "all" }}
            >
              {/* 卡片正面 —— City Pop 唱片封套 */}
              <div
                className="relative h-full w-full overflow-hidden rounded-xl"
                style={{
                  background: "#faf3e3",
                  border: `2px solid ${card.tint}`,
                }}
              >
                {/* 左侧色条（唱片脊背） */}
                <div className="absolute left-0 top-0 h-full w-1.5" style={{ background: card.tint }} />
                {/* 唱片编号（右上角） */}
                <div className="absolute right-3 top-2 font-mono text-[9px] uppercase tracking-[0.2em] text-cp-ink-soft">
                  No.{String(albumIndex + 1).padStart(2, "0")}
                </div>
                {/* 涨跌标签 */}
                <div
                  className="absolute right-3 bottom-2 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
                  style={{
                    backgroundColor: card.change.startsWith("-") ? "rgba(212,96,90,0.15)" : "rgba(91,160,122,0.15)",
                    color: card.change.startsWith("-") ? "#d4605a" : "#5ba07a",
                  }}
                >
                  {card.change}
                </div>
                <div className="relative flex h-full items-center gap-4 pl-6 pr-4">
                  <img src={card.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover shadow-md" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-cp-ink-soft">
                      {card.symbol} · {card.sub}
                    </div>
                    <h3 className="truncate text-base font-bold text-cp-ink">{card.name}</h3>
                    <p className="mt-1 truncate text-xs text-cp-ink-soft">{card.desc}</p>
                  </div>
                </div>
                {/* Peek 预览条 */}
                {isPeek && (
                  <div className="absolute bottom-0 left-0 right-0 border-t border-cp-line bg-cp-paper/90 px-6 py-2 backdrop-blur-sm">
                    <p className="truncate text-xs text-cp-ink-soft">再次点击展开 · {card.tags.join(" · ")}</p>
                  </div>
                )}
              </div>

              {/* Full 展开详情 */}
              <AnimatePresence>
                {isFull && (
                  <motion.div
                    className="absolute inset-0 z-10 flex flex-col overflow-hidden rounded-xl bg-[#f8f7f2]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                  >
                    <InlineDetailContent
                      card={card}
                      detail={cardDetail}
                      profile={cardProfile}
                      heavyReady={heavyReady}
                      headerHeight={132}
                      totalHeight={FULL_CARD_H}
                      onClose={() => { handleCollapse(); }}
                      onWheel={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
