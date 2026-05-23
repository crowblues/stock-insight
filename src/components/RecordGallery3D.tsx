"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type RecordCard = {
  symbol: string;
  name: string;
  sub: string;
  desc: string;
  tags: string[];
  image: string;
  tint: string;
  change: string;
};

const CARDS: RecordCard[] = [
  {
    symbol: "AAPL",
    name: "苹果",
    sub: "Apple Inc.",
    desc: "硬件生态、服务收入与端侧 AI 共同支撑现金流韧性。",
    tags: ["科技", "消费", "AI"],
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&q=80",
    tint: "#7dd3fc",
    change: "+1.8%",
  },
  {
    symbol: "MSFT",
    name: "微软",
    sub: "Microsoft",
    desc: "Azure 与 Copilot 商业化同步推进，云业务仍是估值锚点。",
    tags: ["云", "SaaS", "AI"],
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=900&q=80",
    tint: "#60a5fa",
    change: "+2.1%",
  },
  {
    symbol: "NVDA",
    name: "英伟达",
    sub: "NVIDIA",
    desc: "数据中心 GPU 需求延续，AI 资本开支周期仍在扩张。",
    tags: ["芯片", "AI"],
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=900&q=80",
    tint: "#4ade80",
    change: "+3.4%",
  },
  {
    symbol: "GOOGL",
    name: "谷歌",
    sub: "Alphabet",
    desc: "搜索广告稳健，Gemini 与云平台提供新的增长弹性。",
    tags: ["广告", "云", "AI"],
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=900&q=80",
    tint: "#facc15",
    change: "+0.9%",
  },
  {
    symbol: "AMZN",
    name: "亚马逊",
    sub: "Amazon",
    desc: "电商效率改善叠加 AWS 复苏，利润率中枢继续上移。",
    tags: ["电商", "云"],
    image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=900&q=80",
    tint: "#f59e0b",
    change: "+1.2%",
  },
  {
    symbol: "TSLA",
    name: "特斯拉",
    sub: "Tesla",
    desc: "电动车、能源储能与自动驾驶叙事共同影响估值波动。",
    tags: ["汽车", "能源", "AI"],
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80",
    tint: "#fb7185",
    change: "-0.6%",
  },
  {
    symbol: "META",
    name: "Meta",
    sub: "Meta Platforms",
    desc: "广告业务现金流强劲，AI 推荐系统继续提升平台效率。",
    tags: ["广告", "社交", "AI"],
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=80",
    tint: "#a78bfa",
    change: "+2.6%",
  },
  {
    symbol: "JPM",
    name: "摩根大通",
    sub: "JPMorgan Chase",
    desc: "资产负债表质量与存款规模优势，使其保持银行业领先地位。",
    tags: ["金融", "银行"],
    image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=900&q=80",
    tint: "#38bdf8",
    change: "+0.4%",
  },
  {
    symbol: "V",
    name: "维萨",
    sub: "Visa Inc.",
    desc: "全球支付网络规模效应强，跨境交易恢复带来收入弹性。",
    tags: ["支付", "消费"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
    tint: "#818cf8",
    change: "+0.7%",
  },
  {
    symbol: "AVGO",
    name: "博通",
    sub: "Broadcom",
    desc: "定制 AI 芯片需求增长，VMware 整合提升软件收入占比。",
    tags: ["芯片", "软件"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
    tint: "#f472b6",
    change: "+1.9%",
  },
  {
    symbol: "UNH",
    name: "联合健康",
    sub: "UnitedHealth",
    desc: "医保、药房福利与医疗服务纵向整合，提供稳定防御属性。",
    tags: ["医疗", "保险"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80",
    tint: "#2dd4bf",
    change: "-0.3%",
  },
  {
    symbol: "BRK.B",
    name: "伯克希尔",
    sub: "Berkshire Hathaway",
    desc: "保险浮存金、能源铁路与权益投资组合构成长期价值底盘。",
    tags: ["价值", "保险"],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80",
    tint: "#fbbf24",
    change: "+0.5%",
  },
];

const VISIBLE_COUNT = 10;
const BASE_Y = -305;
const ROW_STEP = 49;
const BASE_WIDTH = 370;
const WIDTH_STEP = 7;
const HIT_Y_OFFSET_BY_SLOT = [56, 35, 17, 1, -9, -15, -16, -9, 5, 0];
const HIT_HEIGHT_BY_SLOT = [25, 29, 33, 37, 42, 47, 54, 62, 72, 82];

export default function RecordGallery3D() {
  const router = useRouter();
  const [windowStart, setWindowStart] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(0);
  const routeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const layout = useMemo(
    () => {
      const visibleCards = Array.from({ length: VISIBLE_COUNT }, (_, slot) => {
        const index = (windowStart + slot) % CARDS.length;
        return { card: CARDS[index], index, slot };
      });

      return visibleCards.map(({ card, index, slot }) => {
        const isActive = index === activeIndex;
        const activeSlot = visibleCards.find((item) => item.index === activeIndex)?.slot ?? null;
        const beforeActive = activeSlot !== null && slot < activeSlot;
        const afterActive = activeSlot !== null && slot > activeSlot;
        const activeGap = beforeActive ? (isRouting ? -54 : -34) : afterActive ? (isRouting ? 62 : 38) : 0;
        const activeLift = isActive && isRouting ? 28 : 0;
        return {
          card,
          index,
          slot,
          y: BASE_Y + slot * ROW_STEP + activeGap + activeLift,
          z: -215 + slot * 22 + (isActive ? (isRouting ? 168 : 68) : 0),
          width: BASE_WIDTH + slot * WIDTH_STEP + (isActive ? (isRouting ? 96 : 22) : 0),
          height: isActive ? (isRouting ? 132 : 92) : Math.min(70 + slot * 1.6, 84),
          tilt: isActive ? -28 : -26,
          roll: isActive ? -1.3 : 0,
        };
      });
    },
    [activeIndex, isRouting, windowStart],
  );

  const handleCardClick = (index: number, symbol: string) => {
    if (routeTimerRef.current) return;

    if (activeIndex !== index) {
      setActiveIndex(index);
      setIsRouting(false);
      return;
    }

    setActiveIndex(index);
    setIsRouting(true);
    routeTimerRef.current = setTimeout(() => {
      router.push(`/company/${symbol}`);
    }, 720);
  };

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const handleWheel = (event: WheelEvent) => {
      const direction = Math.sign(event.deltaY);
      if (direction === 0) return;

      event.preventDefault();
      event.stopPropagation();

      if (isRouting) return;

      const now = performance.now();
      if (now - wheelLockRef.current < 150) return;
      wheelLockRef.current = now;

      setWindowStart((current) => (current + (direction > 0 ? 1 : -1) + CARDS.length) % CARDS.length);
      setActiveIndex(null);
    };

    deck.addEventListener("wheel", handleWheel, { passive: false });
    return () => deck.removeEventListener("wheel", handleWheel);
  }, [isRouting]);

  useEffect(() => {
    return () => {
      if (routeTimerRef.current) clearTimeout(routeTimerRef.current);
    };
  }, []);

  return (
    <section
      id="companies"
      className="relative flex min-h-screen items-center justify-center px-4 py-14 text-[#111]"
      style={{
        background:
          "linear-gradient(90deg, #c9dcb2 0%, #eef1dc 16%, #f5f3ed 50%, #e8f0cf 84%, #b7d392 100%)",
      }}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[18vw] min-w-40 bg-[linear-gradient(135deg,rgba(211,235,137,0.55),rgba(225,76,91,0.22)_48%,rgba(55,99,79,0.28))]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[18vw] min-w-40 bg-[linear-gradient(225deg,rgba(54,114,59,0.55),rgba(176,211,120,0.36)_50%,rgba(239,161,173,0.24))]" />

      <div className="relative min-h-[760px] w-full max-w-[1320px] bg-[#f3f1ea] shadow-[0_24px_80px_rgba(42,56,31,0.18)]">
        <Link
          href="#hero"
          className="absolute left-5 top-5 z-20 rounded-[5px] bg-[#57584f] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_18px_rgba(0,0,0,0.22)] transition hover:bg-[#34362f]"
        >
          Back to start
        </Link>

        <div className="absolute left-1/2 top-[49%] z-10 w-full max-w-[940px] -translate-x-1/2 -translate-y-1/2">
          <div
            ref={deckRef}
            data-lenis-prevent
            className="relative mx-auto h-[650px] w-full touch-none"
            style={{
              perspective: "560px",
              perspectiveOrigin: "50% 35%",
            }}
          >
            <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              {layout.map(({ card, index, slot, y, z, width, height, tilt, roll }) => {
                const isActive = index === activeIndex;
                const transform = `translate(-50%, -50%) translate3d(0, ${y}px, ${z}px) rotateX(${tilt}deg) rotateZ(${roll}deg) scaleX(${width / 560})`;
                const cardStyle: CSSProperties = {
                  left: "50%",
                  top: "50%",
                  zIndex: slot + 1,
                  width: "min(560px, 72vw)",
                  minHeight: height,
                  transform,
                  transformStyle: "preserve-3d",
                  transformOrigin: "50% 50%",
                  transition:
                    "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), min-height 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms ease, border-color 420ms ease",
                  border: isActive ? "1.5px solid rgba(255,255,255,0.8)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 7,
                  backgroundImage: `linear-gradient(90deg, rgba(4,5,5,0.97) 0%, rgba(8,9,10,0.88) 46%, rgba(10,12,12,0.74) 100%), url(${card.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: isActive
                    ? "0 22px 56px rgba(0,0,0,0.42), 0 2px 0 rgba(255,255,255,0.2) inset"
                    : "0 12px 22px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.08) inset",
                  overflow: "hidden",
                };

                return (
                  <article
                    key={card.symbol}
                    data-card-symbol={card.symbol}
                    data-card-active={isActive ? "true" : "false"}
                    className="pointer-events-none absolute select-none text-white"
                    style={cardStyle}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%,rgba(0,0,0,0.2))]" />
                    <div
                      className="absolute right-3 top-2 rounded-[4px] px-2 py-0.5 font-mono text-[10px] font-bold text-[#101211]"
                      style={{ backgroundColor: card.tint }}
                    >
                      {card.change}
                    </div>

                    <div className="relative flex min-h-[42px] items-center gap-3 px-4 py-2.5">
                      <img
                        src={card.image}
                        alt=""
                        className={`shrink-0 rounded-[4px] object-cover transition-all duration-300 ${
                          isActive ? "h-12 w-12" : "h-7 w-7"
                        }`}
                      />

                      <div className="min-w-0 flex-1 pr-20">
                        <div className="mb-1 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                          <span>{card.symbol}</span>
                          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: card.tint }} />
                          <span>{card.sub}</span>
                        </div>

                        <h3
                          className={`truncate font-bold leading-tight tracking-normal text-white transition-all duration-300 ${
                            isActive ? "text-lg" : "text-sm"
                          }`}
                        >
                          {card.name}
                        </h3>

                        {isActive && (
                          <div className="mt-1.5">
                            <p className="max-w-[460px] truncate text-xs text-white/66">{card.desc}</p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-black">
                                查看报告
                              </span>
                              {card.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/12 bg-white/8 px-2.5 py-0.5 text-[10px] text-white/72"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div
              className="absolute inset-0 z-[100]"
              aria-hidden="true"
              onMouseMove={(event) => {
                if (event.target === event.currentTarget) setActiveIndex(null);
              }}
            >
              {layout.map(({ card, index, slot, y, width }) => {
                const isActive = index === activeIndex;
                const isFrontCard = slot === VISIBLE_COUNT - 1;
                const hitY = y + (isFrontCard ? (isActive ? 82 : 26) : 4 + HIT_Y_OFFSET_BY_SLOT[slot]);
                const hitWidth = Math.max(170, width + (isFrontCard ? (isActive ? 140 : 70) : -18));
                const hitHeight = isFrontCard ? (isActive ? 132 : 82) : HIT_HEIGHT_BY_SLOT[slot];

                return (
                  <button
                    key={card.symbol}
                    data-card-symbol={card.symbol}
                    type="button"
                    className="absolute cursor-pointer bg-transparent"
                    style={{
                      appearance: "none",
                      border: 0,
                      left: "50%",
                      top: `calc(50% + ${hitY}px)`,
                      width: `${hitWidth}px`,
                      height: hitHeight,
                      padding: 0,
                      transform: "translate(-50%, -50%)",
                      zIndex: slot + 1,
                    }}
                    onClick={() => handleCardClick(index, card.symbol)}
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
