"use client";
import { useState, useRef, useEffect } from "react";

const CARDS = [
  { symbol: "AAPL", name: "Apple Inc.", desc: "Hardware ecosystem meets AI services.", tags: ["Tech","AI"], image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&q=80" },
  { symbol: "MSFT", name: "Microsoft", desc: "Azure momentum and Copilot monetization.", tags: ["Cloud","SaaS"], image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=200&q=80" },
  { symbol: "NVDA", name: "NVIDIA", desc: "Monopolistic GPU supplier in AI supercycle.", tags: ["Semi","AI"], image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=200&q=80" },
  { symbol: "GOOGL", name: "Alphabet", desc: "Search dominance meets Gemini AI.", tags: ["Ads","Cloud"], image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200&q=80" },
  { symbol: "AMZN", name: "Amazon", desc: "Dual flywheel reaching profit inflection.", tags: ["Cloud","EC"], image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&q=80" },
  { symbol: "TSLA", name: "Tesla", desc: "FSD autonomy, Optimus robotics, energy.", tags: ["Auto","AI"], image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=200&q=80" },
  { symbol: "META", name: "Meta Platforms", desc: "Social ads powerhouse betting on AI and MR.", tags: ["Ads","VR"], image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&q=80" },
  { symbol: "JPM", name: "JPMorgan Chase", desc: "America's largest bank, unmatched scale.", tags: ["Finance"], image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&q=80" },
  { symbol: "V", name: "Visa Inc.", desc: "Global payments duopoly with 65% margins.", tags: ["Fintech"], image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80" },
  { symbol: "AVGO", name: "Broadcom", desc: "Custom AI chips and VMware integration.", tags: ["Semi","AI"], image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80" },
  { symbol: "UNH", name: "UnitedHealth", desc: "Vertically integrated health services.", tags: ["Health"], image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&q=80" },
  { symbol: "BRK.B", name: "Berkshire", desc: "Buffett's empire: insurance, energy, rails.", tags: ["Value"], image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80" },
];

export default function RecordGallery3D() {
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setActive(p => {
        const n = p + (e.deltaY > 0 ? 1 : -1);
        if (n < -1) return CARDS.length - 1;
        if (n >= CARDS.length) return -1;
        return n;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section id="companies" ref={ref} data-lenis-prevent
      className="relative min-h-screen flex items-center justify-center py-20 bg-[#F5F4F0]"
      style={{ perspective: "1800px" }}>

      {/* 透视堆叠容器 — rotateX 制造俯视角度 */}
      <div className="relative" style={{
        transformStyle: "preserve-3d",
        transform: "rotateX(48deg) rotateZ(-1deg)",
        transformOrigin: "center center",
      }}>
        {CARDS.map((card, i) => {
          const isActive = active === i;
          const cardStyle: React.CSSProperties = {
            transformStyle: "preserve-3d",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: isActive
              ? "translateZ(120px) rotateX(-48deg) rotateZ(3deg) scale(1.05)"
              : "translateZ(0px)",
            zIndex: isActive ? 50 : CARDS.length - i,
            marginBottom: "4px",
          };

          return (
            <div key={card.symbol} style={cardStyle}
              className="cursor-pointer"
              onClick={() => setActive(isActive ? -1 : i)}>
              {isActive ? (
                <ExpandedCard card={card} />
              ) : (
                <CollapsedCard card={card} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CollapsedCard({ card }: { card: typeof CARDS[number] }) {
  return (
    <div className="w-[500px] h-[44px] bg-[#1a1a1a] rounded-lg flex items-center px-4 gap-3 shadow-md">
      <img src={card.image} alt="" className="w-7 h-7 rounded object-cover shrink-0" />
      <span className="text-white/70 text-[11px] font-mono truncate flex-1">{card.symbol} · {card.name}</span>
      <div className="flex gap-1 shrink-0">
        {card.tags.map(t => (
          <span key={t} className="px-2 py-0.5 text-[9px] rounded bg-white/10 text-white/50 font-mono">{t}</span>
        ))}
      </div>
    </div>
  );
}

function ExpandedCard({ card }: { card: typeof CARDS[number] }) {
  return (
    <div className="w-[500px] bg-[#1a1a1a] rounded-xl p-5 shadow-2xl border border-white/10">
      <div className="flex gap-4">
        <img src={card.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white/40 text-[10px] font-mono">{card.symbol}</p>
          <h3 className="text-white text-lg font-bold leading-tight">{card.name}</h3>
          <p className="text-white/40 text-xs mt-1">{card.desc}</p>
          <div className="flex gap-2 mt-3">
            <a href={`/company/${card.symbol}`}
              className="px-3 py-1 text-[10px] font-mono rounded bg-emerald-500 text-white">
              Report
            </a>
            {card.tags.map(t => (
              <span key={t} className="px-2 py-1 text-[10px] rounded bg-white/10 text-white/50 font-mono">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
