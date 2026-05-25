"use client";

import { motion, type MotionValue } from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type ComponentProps,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import EPSChart from "@/components/charts/EPSChart";
import MarginChart from "@/components/charts/MarginChart";
import RevenueChart from "@/components/charts/RevenueChart";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/format";

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

type CompanyDetailPayload = {
  profile: {
    symbol: string;
    companyName: string;
    image: string;
    industry: string;
    sector: string;
    exchange: string;
    marketCap: number;
    price: number;
    change: number;
    description: string;
  } | null;
  latestMetrics: {
    returnOnEquity: number;
    returnOnAssets: number;
    evToEBITDA: number;
  } | null;
  latestIncome: {
    fiscalYear?: string;
    revenue: number;
    netIncome: number;
  } | null;
  incomeData: {
    fiscalYear: string;
    revenue: number;
    grossProfit: number;
    netIncome: number;
    epsDiluted: number;
  }[];
  peRatio: number | null;
};

const CARDS: RecordCard[] = [
  {
    symbol: "AAPL",
    name: "Apple",
    sub: "Apple Inc.",
    desc: "Hardware ecosystem, services revenue, and on-device AI support resilient cash flow.",
    tags: ["Tech", "Consumer", "AI"],
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&q=80",
    tint: "#7dd3fc",
    change: "+1.8%",
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    sub: "Microsoft",
    desc: "Azure and Copilot commercialization continue to anchor cloud-driven valuation.",
    tags: ["Cloud", "SaaS", "AI"],
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=900&q=80",
    tint: "#60a5fa",
    change: "+2.1%",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    sub: "NVIDIA",
    desc: "Data-center GPU demand remains elevated as AI capital spending expands.",
    tags: ["Chips", "AI"],
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=900&q=80",
    tint: "#4ade80",
    change: "+3.4%",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet",
    sub: "Alphabet",
    desc: "Search ads stay durable while Gemini and cloud add new growth optionality.",
    tags: ["Ads", "Cloud", "AI"],
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=900&q=80",
    tint: "#facc15",
    change: "+0.9%",
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    sub: "Amazon",
    desc: "Retail efficiency and AWS recovery continue to lift margin expectations.",
    tags: ["Commerce", "Cloud"],
    image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=900&q=80",
    tint: "#f59e0b",
    change: "+1.2%",
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    sub: "Tesla",
    desc: "EV demand, energy storage, and autonomy narratives drive valuation swings.",
    tags: ["Auto", "Energy", "AI"],
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80",
    tint: "#fb7185",
    change: "-0.6%",
  },
  {
    symbol: "META",
    name: "Meta",
    sub: "Meta Platforms",
    desc: "Advertising cash flow remains strong as AI ranking improves platform efficiency.",
    tags: ["Ads", "Social", "AI"],
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=80",
    tint: "#a78bfa",
    change: "+2.6%",
  },
  {
    symbol: "JPM",
    name: "JPMorgan",
    sub: "JPMorgan Chase",
    desc: "Balance-sheet quality and deposit scale keep it ahead of banking peers.",
    tags: ["Finance", "Banking"],
    image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=900&q=80",
    tint: "#38bdf8",
    change: "+0.4%",
  },
  {
    symbol: "V",
    name: "Visa",
    sub: "Visa Inc.",
    desc: "Global payment network effects and cross-border recovery support revenue elasticity.",
    tags: ["Payments", "Consumer"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
    tint: "#818cf8",
    change: "+0.7%",
  },
  {
    symbol: "AVGO",
    name: "Broadcom",
    sub: "Broadcom",
    desc: "Custom AI silicon demand and VMware integration increase software mix.",
    tags: ["Chips", "Software"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
    tint: "#f472b6",
    change: "+1.9%",
  },
  {
    symbol: "UNH",
    name: "UnitedHealth",
    sub: "UnitedHealth",
    desc: "Insurance, pharmacy benefits, and care services provide defensive stability.",
    tags: ["Healthcare", "Insurance"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80",
    tint: "#2dd4bf",
    change: "-0.3%",
  },
  {
    symbol: "BRK.B",
    name: "Berkshire",
    sub: "Berkshire Hathaway",
    desc: "Insurance float, energy, rail, and equity holdings form a long-term value base.",
    tags: ["Value", "Insurance"],
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
const SCROLL_TRANSITION_MS = 220;
const WHEEL_STEP_SIZE = 115;
const TOUCH_STEP_SIZE = 86;
const MAX_WHEEL_STEP = 1;
const MAX_TOUCH_STEP = 0.62;
const EDGE_FADE_WIDTH = 0.86;
const MIN_CLICKABLE_OPACITY = 1.0;
const CLICK_AFTER_SCROLL_DELAY_MS = 140;
const CONFIRM_CLICK_DELAY_MS = 110;
const SWITCH_REOPEN_DELAY_MS = 50;
const FRONT_ACTIVE_START = VISIBLE_COUNT - 1.45;
const ACTIVE_TRANSITION_MS = 220;
const DETAIL_PANEL_MAX_WIDTH = 680;
const DETAIL_PANEL_MAX_HEIGHT = 500;
const DETAIL_PANEL_WIDTH_RATIO = 0.76;
const DETAIL_PANEL_HEIGHT_RATIO = 0.66;
const DETAIL_HEAVY_CONTENT_DELAY_MS = 180;

type RecordGallery3DProps = {
  onBackToStart?: () => void;
};

type OverlayRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CardLayoutItem = {
  card: RecordCard;
  index: number;
  slot: number;
  motionSlot: number;
  opacity: number;
  isClickableSlot: boolean;
  y: number;
  z: number;
  width: number;
  height: number;
  tilt: number;
  roll: number;
};

type CardFaceMode = "stack" | "active" | "detail";

type CardVisualState = {
  y: number;
  z: number;
  width: number;
  height: number;
  scaleX: number;
  tilt: number;
  roll: number;
  zIndex: number;
  opacity: number;
  radius: number;
  borderWidth: number;
  borderOpacity: number;
  shadowStrength: number;
  imageScale: number;
  compactTitleOpacity: number;
  detailTitleOpacity: number;
  metaOpacity: number;
  descriptionOpacity: number;
  hintOpacity: number;
};

type CardFaceNumberValue = number | MotionValue<number>;
type CardFaceStringValue = string | MotionValue<string>;

type CardFaceRenderState = {
  height: CardFaceNumberValue;
  radius: CardFaceNumberValue;
  borderWidth: CardFaceNumberValue;
  borderColor: CardFaceStringValue;
  boxShadow: CardFaceStringValue;
  imageScale: CardFaceNumberValue;
  compactTitleOpacity: CardFaceNumberValue;
  detailTitleOpacity: CardFaceNumberValue;
  metaOpacity: CardFaceNumberValue;
  descriptionOpacity: CardFaceNumberValue;
  descriptionY: CardFaceNumberValue;
  hintOpacity: CardFaceNumberValue;
};

type DetailOverlayState = {
  card: RecordCard;
  fromRect: OverlayRect;
  targetRect: OverlayRect;
};

const LAYOUT_OPEN_TRANSITION = {
  type: "spring" as const,
  stiffness: 68,
  damping: 19,
  mass: 0.98,
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

const smoothstep = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

const getCardVisualState = (item: CardLayoutItem, mode: CardFaceMode): CardVisualState => {
  const isActive = mode === "active";
  const isDetail = mode === "detail";

  return {
    y: item.y,
    z: item.z,
    width: item.width,
    height: isDetail ? 124 : item.height,
    scaleX: isDetail ? 1 : item.width / 560,
    tilt: isDetail ? 0 : item.tilt,
    roll: isDetail ? 0 : item.roll,
    zIndex: isDetail ? 300 : isActive ? 70 : Math.max(0, Math.round(item.motionSlot) + 1),
    opacity: item.opacity,
    radius: isDetail ? 12 : 7,
    borderWidth: isActive ? 1.5 : 1,
    borderOpacity: isActive ? 0.8 : 0.08,
    shadowStrength: isDetail ? 1.06 : 1,
    imageScale: isActive || isDetail ? 1 : 0.58,
    compactTitleOpacity: isDetail ? 0 : isActive ? 0.08 : 1,
    detailTitleOpacity: isDetail ? 1 : isActive ? 1 : 0,
    metaOpacity: isDetail ? 0.45 : isActive ? 0.45 : 0.45,
    descriptionOpacity: isActive || isDetail ? 1 : 0,
    hintOpacity: isActive ? 1 : isDetail ? 0 : 0,
  };
};

const getFallbackCardVisualState = (card: RecordCard, rect: OverlayRect): CardVisualState =>
  getCardVisualState(
    {
      card,
      index: 0,
      slot: 0,
      motionSlot: 0,
      opacity: 1,
      isClickableSlot: true,
      y: 0,
      z: -215,
      width: rect.width,
      height: rect.height,
      tilt: -26,
      roll: 0,
    },
    "stack",
  );

const getCardFaceRenderState = (visual: CardVisualState): CardFaceRenderState => ({
  height: visual.height,
  radius: visual.radius,
  borderWidth: visual.borderWidth,
  borderColor: `rgba(255,255,255,${visual.borderOpacity})`,
  boxShadow: `0 ${18 * visual.shadowStrength}px ${46 * visual.shadowStrength}px rgba(0,0,0,0.36), 0 1px 0 rgba(255,255,255,0.14) inset`,
  imageScale: visual.imageScale,
  compactTitleOpacity: visual.compactTitleOpacity,
  detailTitleOpacity: visual.detailTitleOpacity,
  metaOpacity: visual.metaOpacity,
  descriptionOpacity: visual.descriptionOpacity,
  descriptionY: visual.descriptionOpacity > 0 ? 0 : -4,
  hintOpacity: visual.hintOpacity,
});

function CardFace({
  card,
  state,
  className,
  style,
}: {
  card: RecordCard;
  state: CardFaceRenderState;
  className?: string;
  style?: ComponentProps<typeof motion.div>["style"];
}) {
  return (
    <motion.div
      className={`relative overflow-hidden text-white ${className ?? ""}`}
      style={{
        height: state.height,
        borderRadius: state.radius,
        borderWidth: state.borderWidth,
        borderStyle: "solid",
        borderColor: state.borderColor,
        backgroundImage: `linear-gradient(90deg, rgba(4,5,5,0.97) 0%, rgba(8,9,10,0.88) 46%, rgba(10,12,12,0.74) 100%), url(${card.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: state.boxShadow,
        flexShrink: 0, // Flex 布局中保持固定高度，不被压缩
        ...style,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%,rgba(0,0,0,0.2))]" />
      <div
        className="absolute right-3 top-2 rounded-[4px] px-2 py-0.5 font-mono text-[10px] font-bold text-[#101211]"
        style={{ backgroundColor: card.tint }}
      >
        {card.change}
      </div>

      <div className="relative flex min-h-[42px] items-center gap-3 px-4 py-2.5">
        <motion.img
          src={card.image}
          alt=""
          className="h-12 w-12 shrink-0 origin-left rounded-[4px] object-cover"
          style={{ scale: state.imageScale }}
        />

        <div className="min-w-0 flex-1 pr-20">
          <motion.div
            className="mb-1 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white"
            style={{ opacity: state.metaOpacity }}
          >
            <span>{card.symbol}</span>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: card.tint }} />
            <span>{card.sub}</span>
          </motion.div>

          <div className="relative leading-tight">
            <motion.h3
              className="truncate text-sm font-bold leading-tight tracking-normal text-white"
              style={{ opacity: state.compactTitleOpacity }}
            >
              {card.name}
            </motion.h3>
            <motion.h3
              aria-hidden="true"
              className="absolute inset-x-0 top-0 truncate text-lg font-bold leading-tight tracking-normal text-white"
              style={{ opacity: state.detailTitleOpacity }}
            >
              {card.name}
            </motion.h3>
          </div>

          <motion.div
            className="mt-1.5"
            style={{
              opacity: state.descriptionOpacity,
              y: state.descriptionY,
            }}
          >
            <p className="max-w-[460px] truncate text-xs text-white/66">{card.desc}</p>
            <motion.div
              className="mt-1.5 flex flex-wrap items-center gap-2"
              style={{ opacity: state.hintOpacity }}
            >
              <span className="rounded-full border border-white/25 bg-white/12 px-3.5 py-1 text-xs font-semibold text-white/78">
                Click to expand
              </span>
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/12 bg-white/8 px-2.5 py-0.5 text-[10px] text-white/72"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}


const toOverlayRect = (rect: DOMRect): OverlayRect => ({
  left: rect.left,
  top: rect.top,
  width: rect.width,
  height: rect.height,
});

const getDetailTargetRect = (): OverlayRect => {
  const width = Math.min(DETAIL_PANEL_MAX_WIDTH, window.innerWidth * DETAIL_PANEL_WIDTH_RATIO);
  const height = Math.min(DETAIL_PANEL_MAX_HEIGHT, window.innerHeight * DETAIL_PANEL_HEIGHT_RATIO);

  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  };
};

const buildFallbackIncomeData = (card: RecordCard): CompanyDetailPayload["incomeData"] => {
  const seed = Array.from(card.symbol).reduce((total, char) => total + char.charCodeAt(0), 0);
  const latestRevenue = (42 + (seed % 96)) * 1_000_000_000;
  const growth = 0.055 + (seed % 5) * 0.012;
  const grossMargin = 0.42 + (seed % 16) / 100;
  const netMargin = 0.16 + (seed % 12) / 100;
  const shares = 3_200_000_000 + (seed % 9) * 620_000_000;

  return Array.from({ length: 5 }, (_, index) => {
    const revenue = Math.round(latestRevenue / Math.pow(1 + growth, index));
    const netIncome = Math.round(revenue * (netMargin - index * 0.006));
    return {
      fiscalYear: `${2025 - index}`,
      revenue,
      grossProfit: Math.round(revenue * (grossMargin - index * 0.004)),
      netIncome,
      epsDiluted: Number((netIncome / shares).toFixed(2)),
    };
  });
};

const fallbackDetail = (card: RecordCard): CompanyDetailPayload => ({
  profile: {
    symbol: card.symbol,
    companyName: card.sub,
    image: card.image,
    industry: card.tags[0] ?? "Analysis",
    sector: "Company Research",
    exchange: "Stock Insight",
    marketCap: 0,
    price: 0,
    change: Number.parseFloat(card.change.replace("%", "")),
    description: card.desc,
  },
  latestMetrics: null,
  latestIncome: (() => {
    const latest = buildFallbackIncomeData(card)[0];
    return {
      fiscalYear: latest.fiscalYear,
      revenue: latest.revenue,
      netIncome: latest.netIncome,
    };
  })(),
  incomeData: buildFallbackIncomeData(card),
  peRatio: null,
});

const normalizeCompanyDetail = (card: RecordCard, detail: CompanyDetailPayload): CompanyDetailPayload => {
  const fallback = fallbackDetail(card);
  const incomeData = detail.incomeData?.length ? detail.incomeData : fallback.incomeData;
  const latestIncome = detail.latestIncome ?? {
    fiscalYear: incomeData[0]?.fiscalYear,
    revenue: incomeData[0]?.revenue ?? 0,
    netIncome: incomeData[0]?.netIncome ?? 0,
  };

  return {
    ...fallback,
    ...detail,
    profile: detail.profile ?? fallback.profile,
    latestMetrics: detail.latestMetrics ?? fallback.latestMetrics,
    latestIncome,
    incomeData,
    peRatio: detail.peRatio ?? fallback.peRatio,
  };
};

const loadCompanyDetail = async (symbol: string): Promise<CompanyDetailPayload | null> => {
  try {
    const response = await fetch(`/api/company/${encodeURIComponent(symbol)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

export default function RecordGallery3D({ onBackToStart }: RecordGallery3DProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [closingSymbol, setClosingSymbol] = useState<string | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, CompanyDetailPayload>>({});
  const [detailHeavyReadySymbol, setDetailHeavyReadySymbol] = useState<string | null>(null);
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
  const detailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const layout = useMemo(
    (): CardLayoutItem[] => {
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
          ? frontActiveMotion
            ? isRouting
              ? -54
              : -34
            : isRouting
              ? -56
              : -36
          : afterActive
            ? isRouting
              ? 56
              : 40
            : 0;
        const activeLift = isActive ? (isRouting ? (isFrontActive ? -30 : 20) : isFrontActive ? -22 : -3) : 0;
        const activeZBoost = isActive ? (isRouting ? (isFrontActive ? 92 : 150) : isFrontActive ? 34 : 68) : 0;
        const activeWidthBoost = isActive ? (isRouting ? (isFrontActive ? 62 : 82) : isFrontActive ? 18 : 24) : 0;
        const topFade = motionSlot < 0 ? Math.max(0, 1 + motionSlot / EDGE_FADE_WIDTH) : 1;
        const bottomFade = motionSlot > VISIBLE_COUNT - 1 ? Math.max(0, (VISIBLE_COUNT - motionSlot) / EDGE_FADE_WIDTH) : 1;
        const opacity = Math.min(topFade, bottomFade);
        const isClickableSlot = opacity >= MIN_CLICKABLE_OPACITY && motionSlot >= 0 && motionSlot <= VISIBLE_COUNT - 1;

        return {
          card,
          index,
          slot,
          motionSlot,
          opacity,
          isClickableSlot,
          y: BASE_Y + motionSlot * ROW_STEP + activeGap + activeLift,
          z: -215 + motionSlot * 22 + activeZBoost,
          width: BASE_WIDTH + motionSlot * WIDTH_STEP + activeWidthBoost,
          height: isActive ? (isRouting ? (isFrontActive ? 128 : 132) : isFrontActive ? 104 : 96) : Math.min(70 + motionSlot * 1.6, 84),
          tilt: isActive ? (isFrontActive ? -16 : -26) : -26,
          roll: isActive ? (isFrontActive ? -0.18 : -1.1) : 0,
        };
      });
    },
    [activeIndex, isRouting, scrollPosition],
  );

  const handleCardClick = (index: number, event: ReactMouseEvent<HTMLButtonElement>) => {
    const now = event.timeStamp;
    if (now - lastScrollAtRef.current < CLICK_AFTER_SCROLL_DELAY_MS) return;
    if (detailTimerRef.current || expandedSymbol) return;

    if (activeIndex !== index) {
      const card = CARDS[index];
      setIsRouting(false);
      if (pendingActiveTimerRef.current) {
        clearTimeout(pendingActiveTimerRef.current);
        pendingActiveTimerRef.current = null;
      }

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

    if (now - activeSinceRef.current < CONFIRM_CLICK_DELAY_MS) return;

    const card = CARDS[index];
    const cardElement = cardRefs.current.get(card.symbol);
    if (!cardElement) return;

    setIsRouting(true);
    warmCompanyDetail(card);
    // Option C: 直接展开卡片本身，不创建 overlay
    setExpandedSymbol(card.symbol);
  };

  const closeDetailOverlay = () => {
    if (!expandedSymbol || closingSymbol) return;
    const sym = expandedSymbol;
    setClosingSymbol(sym);
    setExpandedSymbol(null);
    setDetailHeavyReadySymbol(null);
    setIsRouting(false);
    setActiveIndex(null);
    setHoveredIndex(null);
    // closingSymbol 由 motion.div onAnimationComplete 清理
  };

  const handleCloseComplete = useCallback(() => {
    // 保留兼容性，但 Option C 不再需要
  }, []);

  const handleDetailWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleDetailTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleDetailTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (!expandedSymbol) return;

    const timer = window.setTimeout(() => {
      setDetailHeavyReadySymbol(expandedSymbol);
    }, DETAIL_HEAVY_CONTENT_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [expandedSymbol]);

  const detailHeavyReady = detailHeavyReadySymbol === expandedSymbol;

  useEffect(() => {
    detailOpenRef.current = expandedSymbol !== null || closingSymbol !== null;
  }, [expandedSymbol, closingSymbol]);

  const warmCompanyDetail = (card: RecordCard) => {
    if (!detailCacheRef.current.has(card.symbol)) {
      const fallback = fallbackDetail(card);
      detailCacheRef.current.set(card.symbol, fallback);
      setDetailCache((current) => ({ ...current, [card.symbol]: fallback }));
    }

    void loadCompanyDetail(card.symbol).then((detail) => {
      if (!detail) return;
      const normalizedDetail = normalizeCompanyDetail(card, detail);
      detailCacheRef.current.set(card.symbol, normalizedDetail);
      setDetailCache((current) => ({ ...current, [card.symbol]: normalizedDetail }));
    });
  };

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

    const handleWheel = (event: WheelEvent) => {
      if (!section.contains(event.target as Node)) return;

      if ((event.target as Element | null)?.closest("[data-detail-scroll]")) return;

      if (event.cancelable) event.preventDefault();
      event.stopPropagation();

      const stepDelta = Math.max(-MAX_WHEEL_STEP, Math.min(MAX_WHEEL_STEP, event.deltaY / WHEEL_STEP_SIZE));
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

    const handleTouchEnd = () => {
      touchYRef.current = null;
    };

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

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
    };

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = previous.htmlOverflow;
      html.style.overscrollBehavior = previous.htmlOverscrollBehavior;
      body.style.overflow = previous.bodyOverflow;
      body.style.overscrollBehavior = previous.bodyOverscrollBehavior;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pendingActiveTimerRef.current) clearTimeout(pendingActiveTimerRef.current);
      if (detailTimerRef.current) clearTimeout(detailTimerRef.current);
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════
  // 方案B：Apple-style 动画层 — 关闭卡片在 preserve-3d 外渲染
  // overflow:hidden 在平面层有效，彻底消除穿模
  // ═══════════════════════════════════════════════════════════
  const closingLayoutItem = closingSymbol
    ? layout.find((item) => item.card.symbol === closingSymbol) ?? null
    : null;

  const clickableCards = layout.filter(({ isClickableSlot }) => isClickableSlot).sort((a, b) => a.y - b.y);

  const getHitMetrics = (item: (typeof clickableCards)[number]) => {
    const isActive = item.index === activeIndex;
    const hitSlot = Math.max(0, Math.min(VISIBLE_COUNT - 1, Math.round(item.motionSlot)));
    const isFrontCard = hitSlot === VISIBLE_COUNT - 1;
    const yOffset = isActive ? (isFrontCard ? 2 : 0) : isFrontCard ? 26 : 4 + HIT_Y_OFFSET_BY_SLOT[hitSlot];
    const centerY = item.y + yOffset;
    const width = isActive ? Math.min(540, Math.max(320, item.width + 100)) : Math.max(174, item.width + (isFrontCard ? 42 : -44));
    const height = isActive ? Math.max(90, item.height + 4) : isFrontCard ? 62 : HIT_HEIGHT_BY_SLOT[hitSlot];
    const xOffset = 0;

    return {
      centerY,
      height,
      hitSlot,
      width,
      xOffset,
    };
  };

  return (
    <section
      ref={sectionRef}
      id="companies"
      data-lenis-prevent
      className="relative flex h-[100svh] touch-none items-center justify-center overflow-hidden overscroll-none px-4 py-8 text-[#111]"
      style={{
        background:
          "linear-gradient(90deg, #c9dcb2 0%, #eef1dc 16%, #f5f3ed 50%, #e8f0cf 84%, #b7d392 100%)",
      }}
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
            style={{
              perspective: "560px",
              perspectiveOrigin: "50% 35%",
            }}
          >
            <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              {layout.map(({ card, index, motionSlot, opacity, y, z, width, height, tilt, roll }) => {
                const isActive = index === activeIndex;
                const isHovered = hoveredIndex === index && !isActive && activeIndex === null;
                const motionDuration = activeIndex !== null || isActive ? ACTIVE_TRANSITION_MS : SCROLL_TRANSITION_MS;
                const item = {
                  card,
                  index,
                  slot: 0,
                  motionSlot,
                  opacity,
                  isClickableSlot: true,
                  y,
                  z,
                  width,
                  height,
                  tilt,
                  roll,
                };
                const visual = getCardVisualState(item, isActive ? "active" : "stack");
                const faceState = getCardFaceRenderState(visual);
                const isExpanded = expandedSymbol === card.symbol;
                const isClosing = closingSymbol === card.symbol;
                const isExpandedOrClosing = isExpanded || isClosing;

                // Option C: 卡片始终在 DOM 中，展开时改变样式
                const expandTarget = getDetailTargetRect();
                const expandW = expandTarget.width;
                const expandH = expandTarget.height;

                // 一体化：卡片本身就是展开/收纳元素
                const stackWidth = Math.min(560, window.innerWidth * 0.72);
                const springTransition = {
                  type: "spring" as const,
                  stiffness: 68,
                  damping: 19,
                  mass: 0.98,
                };
                const stackTween = {
                  type: "tween" as const,
                  duration: motionDuration / 1000,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  opacity: { duration: SCROLL_TRANSITION_MS / 1000, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
                };
                // ═══════════════════════════════════════════════════════════
                // 动画系统（一体化架构 - 请勿修改关闭卡片的动画逻辑）
                // ═══════════════════════════════════════════════════════════
                const cardTransition = isExpandedOrClosing ? springTransition : stackTween;

                // -------------------------------------------------------
                // 穿模适配：仅在展开状态（静态）隐藏其他卡片
                // 收纳开始瞬间 expandedSymbol 被清除，其他卡片立刻恢复显示
                // 这样收纳动画期间用户能看到卡片堆叠回来的效果
                // -------------------------------------------------------
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
                  // 关闭卡片：保持原始 opacity 逻辑（一体化动画不动）
                  // 其他卡片：展开/收纳期间淡出到 0，避免穿模
                  opacity: isExpanded ? 1 : (shouldFadeOut ? 0 : visual.opacity),
                };
                const expandedFaceState: CardFaceRenderState = isExpanded ? {
                  height: Math.min(132, Math.max(108, expandH * 0.26)),
                  radius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.08)",
                  boxShadow: "0 18px 46px rgba(0,0,0,0.36), 0 1px 0 rgba(255,255,255,0.14) inset",
                  imageScale: 1,
                  compactTitleOpacity: 0,
                  detailTitleOpacity: 1,
                  metaOpacity: 0.45,
                  descriptionOpacity: 1,
                  descriptionY: 0,
                  hintOpacity: 0,
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
                    ref={(element) => {
                      if (element) {
                        cardRefs.current.set(card.symbol, element);
                        return;
                      }
                      cardRefs.current.delete(card.symbol);
                    }}
                    data-card-symbol={card.symbol}
                    data-card-active={isActive ? "true" : "false"}
                    className={`absolute select-none text-white${isExpanded ? " pointer-events-auto" : " pointer-events-none"}`}
                    initial={false}
                    animate={cardAnimate}
                    transition={cardTransition}
                    transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
                    style={{
                      left: "50%",
                      top: "50%",
                      zIndex: isExpandedOrClosing ? 200 : visual.zIndex,
                      transformOrigin: "50% 50%",
                      willChange: "transform, width, height",
                      backfaceVisibility: "hidden",
                      overflow: "hidden",
                      // Flex 布局：让 InlineDetailContent 高度跟随卡片缩小
                      display: "flex",
                      flexDirection: "column" as const,
                      // 方案B：关闭时原卡片保持可见（只有CardFace），动画层负责白色区域裁剪
                    }}
                    onAnimationComplete={() => {
                      // 方案B：关闭动画由动画层处理，原卡片不再清理 closingSymbol
                    }}
                  >
                    <CardFace card={card} state={renderState} />
                    {isExpanded && (
                      <InlineDetailContent
                        card={card}
                        detail={cardDetail}
                        profile={cardProfile}
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
              })}
            </div>

            {/* ═══ 方案B：动画层（preserve-3d 外部，overflow:hidden 有效） ═══ */}
            {closingSymbol && closingLayoutItem && (() => {
              const clItem = closingLayoutItem;
              const clCard = clItem.card;
              const clVisual = getCardVisualState(clItem, "stack");
              const clFaceState = getCardFaceRenderState(clVisual);
              const clExpandTarget = getDetailTargetRect();
              const clExpandW = clExpandTarget.width;
              const clExpandH = clExpandTarget.height;
              const clStackWidth = Math.min(560, window.innerWidth * 0.72);
              const clSpring = { type: "spring" as const, stiffness: 68, damping: 19, mass: 0.98 };
              const clDetail = detailCache[clCard.symbol] ?? fallbackDetail(clCard);
              const clProfile = clDetail.profile ?? fallbackDetail(clCard).profile;

              return (
                <motion.div
                  key={`closing-layer-${clCard.symbol}`}
                  className="absolute select-none text-white pointer-events-auto"
                  initial={{
                    y: 0, z: 0, rotateX: 0, rotateZ: 0, scaleX: 1,
                    width: clExpandW, height: clExpandH,
                    borderRadius: 12, opacity: 1,
                  }}
                  animate={{
                    y: clVisual.y, z: clVisual.z,
                    rotateX: clVisual.tilt, rotateZ: clVisual.roll,
                    scaleX: clVisual.scaleX,
                    width: clStackWidth, height: clVisual.height,
                    borderRadius: 7, opacity: 0,
                  }}
                  transition={{
                    ...clSpring,
                    // opacity 延迟淡出：动画前半段保持可见，后半段渐隐
                    // 让动画层平滑交接给 preserve-3d 中的原卡片
                    opacity: { type: "tween", duration: 0.28, delay: 0.38, ease: "easeIn" },
                  }}
                  transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
                  style={{
                    left: "50%",
                    top: "50%",
                    zIndex: 200,
                    transformOrigin: "50% 50%",
                    willChange: "transform, width, height",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column" as const,
                  }}
                  onAnimationComplete={() => {
                    setClosingSymbol(null);
                    activeSinceRef.current = performance.now();
                  }}
                >
                  <CardFace card={clCard} state={clFaceState} />
                  <InlineDetailContent
                    card={clCard}
                    detail={clDetail}
                    profile={clProfile}
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

            <div
              className={`absolute inset-0 z-[100]${expandedSymbol || closingSymbol ? " pointer-events-none" : ""}`}
              aria-hidden="true"
            >
              {clickableCards.map((item, order) => {
                const { card, index } = item;
                const isActive = index === activeIndex;
                const metrics = getHitMetrics(item);
                const previousMetrics = clickableCards[order - 1] ? getHitMetrics(clickableCards[order - 1]) : null;
                const nextMetrics = clickableCards[order + 1] ? getHitMetrics(clickableCards[order + 1]) : null;
                const bandTop = previousMetrics
                  ? (previousMetrics.centerY + metrics.centerY) / 2 + 6
                  : metrics.centerY - metrics.height / 2;
                const bandBottom = nextMetrics
                  ? (metrics.centerY + nextMetrics.centerY) / 2 - 6
                  : metrics.centerY + metrics.height / 2;
                const safeTop = Math.max(metrics.centerY - metrics.height / 2, bandTop);
                const safeBottom = Math.min(metrics.centerY + metrics.height / 2, bandBottom);
                const hitHeight = Math.max(18, safeBottom - safeTop);
                const hitY = (safeTop + safeBottom) / 2;

                return (
                  <button
                    key={card.symbol}
                    data-card-symbol={card.symbol}
                    type="button"
                    tabIndex={-1}
                    className="absolute cursor-pointer bg-transparent"
                    style={{
                      appearance: "none",
                      border: 0,
                      outline: "none",
                      WebkitTapHighlightColor: "transparent",
                      left: "50%",
                      top: `calc(50% + ${hitY}px)`,
                      width: `${metrics.width}px`,
                      height: hitHeight,
                      padding: 0,
                      transform: `translate(calc(-50% + ${metrics.xOffset}px), -50%)`,
                      zIndex: isActive ? 90 : metrics.hitSlot + 1,
                      clipPath: isActive ? "inset(0)" : "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
                    }}
                    onPointerEnter={() => setHoveredIndex(index)}
                    onPointerLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
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

/* ─── Option C: 内联详情内容（渲染在卡片内部） ─── */
function InlineDetailContent({
  card, detail, profile, heavyReady, headerHeight, totalHeight,
  onClose, onWheel, onTouchStart, onTouchMove,
}: {
  card: RecordCard;
  detail: CompanyDetailPayload;
  profile: CompanyDetailPayload["profile"];
  heavyReady: boolean;
  headerHeight: number;
  totalHeight: number;
  onClose: () => void;
  onWheel: (e: ReactWheelEvent<HTMLDivElement>) => void;
  onTouchStart: (e: ReactTouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: ReactTouchEvent<HTMLDivElement>) => void;
}) {
  const latestMetrics = detail.latestMetrics;
  const latestIncome = detail.latestIncome;
  const incomeData = detail.incomeData ?? [];
  const contentHeight = totalHeight - headerHeight;

  return (
    <div
      className="relative z-20 -mt-[1px] overflow-hidden border border-[#d7d8cd] bg-[#f8f7f2] text-[#20231d]"
      style={{
        // Flex 自适应：高度跟随卡片缩小，不再固定
        // 卡片缩小时此区域自然缩小到 0，实现"插回卡堆"效果
        flex: "1 1 0",
        minHeight: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        boxShadow: "0 24px 70px rgba(36,39,30,0.24), 0 1px 0 rgba(255,255,255,0.7) inset",
      }}
    >
      <div
        data-detail-scroll
        className="relative z-20 h-full touch-pan-y overflow-y-auto overscroll-contain"
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        <header className="px-8 pb-5 pt-7 text-center">
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#62645d]">
            <span>Stock Insight Archive</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[5px] bg-[#57584f] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_8px_16px_rgba(0,0,0,0.16)] transition hover:bg-[#34362f]"
            >
              Back
            </button>
          </div>
          <div className="relative mx-auto flex h-40 w-full max-w-[420px] items-center justify-center overflow-hidden bg-[#090a0a] shadow-[0_18px_42px_rgba(0,0,0,0.24)]">
            <div className="absolute h-40 w-full max-w-[420px] bg-[radial-gradient(circle_at_68%_40%,rgba(255,255,255,0.22),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0)_42%),linear-gradient(90deg,#070909,#171a18)]" />
            {profile?.image && (
              <img src={profile.image} alt="" className="relative z-10 h-16 w-16 rounded-[6px] bg-white object-contain p-2 shadow-[0_14px_36px_rgba(0,0,0,0.28)]" />
            )}
            <div className="relative z-10 ml-5 text-left">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">{profile?.symbol ?? card.symbol}</p>
              <p className="mt-2 max-w-[260px] text-xl font-semibold leading-tight text-white">{profile?.companyName ?? card.sub}</p>
            </div>
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#9c9f74]">
            {profile?.sector || "Company Research"} / {profile?.industry || "Analysis"}
          </p>
          <h1 className="mx-auto mt-2 max-w-[620px] text-[clamp(1.8rem,3.2vw,2.9rem)] font-bold leading-[0.98] text-[#7d8178]">
            {profile?.companyName ?? card.sub}
          </h1>
          <p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-[#5b5e57]">
            {profile?.description || card.desc}
          </p>
        </header>
        <section className="grid grid-cols-2 gap-3 px-8 pb-8 md:grid-cols-4">
          <MetricCard label="Price" value={profile?.price ? `$${profile.price}` : "Loading"} />
          <MetricCard label="Change" value={profile?.change !== undefined ? `${profile.change >= 0 ? "+" : ""}${profile.change.toFixed(2)}%` : card.change} tone={(profile?.change ?? 0) >= 0 ? "up" : "down"} />
          <MetricCard label="Market Cap" value={profile?.marketCap ? formatCurrency(profile.marketCap) : "Loading"} />
          <MetricCard label="P/E" value={detail.peRatio ? detail.peRatio.toFixed(1) : "N/A"} />
          <MetricCard label="ROE" value={latestMetrics ? formatPercent(latestMetrics.returnOnEquity) : "N/A"} />
          <MetricCard label="ROA" value={latestMetrics ? formatPercent(latestMetrics.returnOnAssets) : "N/A"} />
          <MetricCard label="EV/EBITDA" value={latestMetrics ? formatMultiple(latestMetrics.evToEBITDA) : "N/A"} />
          <MetricCard label="Revenue" value={latestIncome ? formatCurrency(latestIncome.revenue) : "N/A"} />
        </section>
        <section className="space-y-4 px-8 pb-8">
          {heavyReady && incomeData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <RevenueChart data={incomeData} />
                <MarginChart data={incomeData} />
              </div>
              <EPSChart data={incomeData} />
            </>
          ) : (
            <FinancialChartPlaceholder />
          )}
        </section>
      </div>
    </div>
  );
}

function FinancialChartPlaceholder() {
  return (
    <div className="border border-[#dcddd2] bg-[#f8f7f2] px-5 py-5 text-[#3e4239]">
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#898b82]">
        <span>Financial modules</span>
        <span>Loading data</span>
      </div>
      <div className="grid grid-cols-6 items-end gap-2 border border-[#e0dfd5] bg-[#fdfcf7] p-4">
        {[34, 52, 45, 68, 61, 78].map((height, index) => (
          <div key={index} className="flex h-28 items-end border-l border-[#ece9de] pl-1">
            <div
              className="w-full bg-[#69715e]"
              style={{ height: `${height}%`, opacity: 0.52 + index * 0.055 }}
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#98998e]">
        Revenue / margin / EPS charts will appear here when data is available
      </p>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" }) {
  const toneClass = tone === "up" ? "text-[#267c4a]" : tone === "down" ? "text-[#bd3850]" : "text-[#1f221d]";

  return (
    <div className="rounded-[4px] border border-[#dcddd2] bg-[#f8f7f2] px-3 py-2.5">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#898b82]">{label}</div>
      <div className={`mt-1 truncate text-sm font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}
