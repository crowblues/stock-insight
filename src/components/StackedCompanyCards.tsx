"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";

const COMPANIES = [
  { symbol: "AAPL", name: "Apple Inc.", nameCn: "苹果", industry: "Consumer Electronics", color: "#A3AAAE", bgTint: "#f5f3f0", desc: "Hardware ecosystem meets AI services.", metrics: { revenue: "$394.3B", pe: "30.2x", margin: "44.1%" }, tags: ["Tech", "Consumer", "AI"], image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80" },
  { symbol: "MSFT", name: "Microsoft", nameCn: "微软", industry: "Cloud & Enterprise", color: "#00A4EF", bgTint: "#eef6fc", desc: "Azure momentum and Copilot monetization.", metrics: { revenue: "$227.6B", pe: "38.4x", margin: "69.4%" }, tags: ["Cloud", "AI", "SaaS"], image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80" },
  { symbol: "NVDA", name: "NVIDIA", nameCn: "英伟达", industry: "AI Chips & GPU", color: "#76B900", bgTint: "#f3f7ec", desc: "Monopolistic GPU supplier in AI supercycle.", metrics: { revenue: "$130.5B", pe: "65.1x", margin: "73.0%" }, tags: ["Semi", "AI", "HPC"], image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80" },
  { symbol: "GOOGL", name: "Alphabet", nameCn: "谷歌", industry: "Search & Cloud", color: "#4285F4", bgTint: "#eef2fc", desc: "Search dominance meets Gemini AI.", metrics: { revenue: "$350.0B", pe: "24.0x", margin: "57.2%" }, tags: ["Ads", "Cloud", "AI"], image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80" },
  { symbol: "AMZN", name: "Amazon", nameCn: "亚马逊", industry: "E-Commerce & AWS", color: "#FF9900", bgTint: "#fdf5e8", desc: "Dual flywheel reaching profit inflection.", metrics: { revenue: "$638.0B", pe: "58.7x", margin: "24.1%" }, tags: ["Cloud", "EC", "AI"], image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80" },
  { symbol: "TSLA", name: "Tesla", nameCn: "特斯拉", industry: "EV & Energy", color: "#CC0000", bgTint: "#fcf0f0", desc: "FSD autonomy, Optimus robotics, energy.", metrics: { revenue: "$96.8B", pe: "71.8x", margin: "17.9%" }, tags: ["Auto", "Energy", "AI"], image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80" },
  { symbol: "META", name: "Meta Platforms", nameCn: "Meta", industry: "Social & XR", color: "#0668E1", bgTint: "#eef4fd", desc: "Social ads powerhouse betting on AI and MR.", metrics: { revenue: "$165.0B", pe: "28.5x", margin: "81.5%" }, tags: ["Ads", "VR", "AI"], image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80" },
  { symbol: "JPM", name: "JPMorgan Chase", nameCn: "摩根大通", industry: "Banking & IB", color: "#003A70", bgTint: "#eef1f5", desc: "America's largest bank, unmatched scale.", metrics: { revenue: "$177.6B", pe: "12.1x", margin: "38.2%" }, tags: ["Finance", "Bank"], image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800&q=80" },
  { symbol: "V", name: "Visa Inc.", nameCn: "维萨", industry: "Payments Network", color: "#1A1F71", bgTint: "#eeeef8", desc: "Global payments duopoly with 65% margins.", metrics: { revenue: "$35.9B", pe: "31.5x", margin: "65.6%" }, tags: ["Fintech", "Pay"], image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" },
  { symbol: "UNH", name: "UnitedHealth", nameCn: "联合健康", industry: "Healthcare", color: "#002677", bgTint: "#eef0f6", desc: "Vertically integrated health services giant.", metrics: { revenue: "$371.6B", pe: "19.8x", margin: "8.2%" }, tags: ["Health", "Ins"], image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" },
  { symbol: "AVGO", name: "Broadcom", nameCn: "博通", industry: "Semiconductors", color: "#CC092F", bgTint: "#fcf0f2", desc: "Custom AI chips and VMware integration.", metrics: { revenue: "$51.6B", pe: "35.2x", margin: "63.1%" }, tags: ["Semi", "AI", "Infra"], image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
  { symbol: "BRK.B", name: "Berkshire Hathaway", nameCn: "伯克希尔", industry: "Conglomerate", color: "#2D1B69", bgTint: "#f0eef5", desc: "Buffett's empire: insurance, energy, rails.", metrics: { revenue: "$364.5B", pe: "9.8x", margin: "15.4%" }, tags: ["Value", "Ins"], image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
];

export default function StackedCompanyCards() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCompany = hovered !== null ? COMPANIES[hovered] : null;

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    setScrollOffset(prev => {
      const max = (COMPANIES.length - 8) * 58;
      return Math.max(0, Math.min(max, prev + e.deltaY * 0.5));
    });
  }, []);

  return (
    <section
      id="companies"
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden"
      style={{ backgroundColor: activeCompany ? activeCompany.bgTint : "#f0ede8", transition: "background-color 0.7s ease" }}
    >
      {/* 模糊背景图 */}
      {COMPANIES.map((company, i) => (
        <div key={company.symbol} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: hovered === i ? 0.2 : 0 }}>
          <img src={company.image} alt="" className="w-full h-full object-cover" style={{ filter: "blur(50px) saturate(1.2)", transform: "scale(1.1)" }} />
        </div>
      ))}

      <div className="absolute top-6 left-6 z-20 hidden md:block">
        <span className="px-4 py-2 bg-[#1a1a1a] text-white text-[10px] font-mono rounded-lg uppercase tracking-[0.2em]">
          Stock Insight Archive
        </span>
      </div>

      {/* 3D唱片堆 */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[720px] z-10 px-6"
        onWheel={handleWheel}
      >
        <div style={{ transform: `translateY(-${scrollOffset}px)`, transition: "transform 0.3s ease-out" }}>
          {COMPANIES.map((company, index) => {
            const isHovered = hovered === index;
            const total = COMPANIES.length;

            let transform: string;
            let zIdx: number;
            let opa: number;
            let shadow: string;

            if (isHovered) {
              // 选中：歪着抽出来 — rotateZ倾斜 + 左移 + 放大
              transform = `rotateZ(-2.5deg) translateX(-35px) translateY(-4px) scale(1.03)`;
              zIdx = 50;
              opa = 1;
              shadow = "0 30px 60px rgba(0,0,0,0.45), 0 0 0 2px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.05)";
            } else if (hovered !== null) {
              // 未选中：微微让开
              const dist = Math.abs(index - hovered);
              const pushY = index < hovered ? -3 * dist : 3 * dist;
              transform = `translateY(${pushY}px) scale(0.99)`;
              zIdx = total - dist;
              opa = Math.max(0.6, 1 - dist * 0.1);
              shadow = "0 2px 8px rgba(0,0,0,0.15)";
            } else {
              transform = `translateY(0px) scale(1)`;
              zIdx = total - index;
              opa = 1;
              shadow = "0 2px 6px rgba(0,0,0,0.12)";
            }

            return (
              <Link
                key={company.symbol}
                href={`/company/${company.symbol}`}
                className="relative block cursor-pointer rounded-2xl"
                style={{
                  transform,
                  transformOrigin: "center center",
                  zIndex: zIdx,
                  opacity: opa,
                  boxShadow: shadow,
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  marginBottom: "-2px",
                  willChange: "transform",
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {isHovered ? <HoveredCard company={company} /> : <DefaultCard company={company} />}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ 默认卡片 ═══ */
function DefaultCard({ company }: { company: (typeof COMPANIES)[number] }) {
  return (
    <div className="h-[54px] bg-[#1a1a1a] rounded-2xl flex items-center px-5 gap-3">
      <div className="w-[38px] h-[38px] rounded-lg overflow-hidden shrink-0 ring-1 ring-white/10">
        <img src={company.image} alt="" className="w-full h-full object-cover" />
      </div>
      <span className="text-[11px] text-white/70 font-mono uppercase tracking-wider truncate flex-1">{company.name}</span>
      <div className="flex gap-1.5 shrink-0">
        {company.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 text-[9px] rounded-full font-mono" style={{ background: `${company.color}20`, color: company.color }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══ 悬停卡片（倾斜弹出） ═══ */
function HoveredCard({ company }: { company: (typeof COMPANIES)[number] }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5">
      <div className="flex gap-5">
        <div className="w-[90px] h-[90px] rounded-xl overflow-hidden shrink-0 ring-2 ring-white/20">
          <img src={company.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-white/40 font-mono">{company.symbol}</span>
            <span className="text-[10px] text-white/25">·</span>
            <span className="text-[10px] text-white/40">{company.nameCn}</span>
            <div className="flex gap-1.5 ml-auto">
              {company.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-[9px] rounded-full font-mono" style={{ background: `${company.color}25`, color: company.color }}>{tag}</span>
              ))}
            </div>
          </div>
          <h3 className="text-white text-lg font-bold leading-tight">{company.name}</h3>
          <p className="text-white/40 text-[11px] mt-0.5 mb-2">{company.industry}</p>
          <p className="text-white/50 text-[11px] leading-relaxed">{company.desc}</p>
          <div className="flex items-center gap-5 mt-3">
            <div><span className="text-[8px] text-white/30 font-mono block">REV</span><span className="text-white text-[12px] font-mono">{company.metrics.revenue}</span></div>
            <div><span className="text-[8px] text-white/30 font-mono block">P/E</span><span className="text-white text-[12px] font-mono">{company.metrics.pe}</span></div>
            <div><span className="text-[8px] text-white/30 font-mono block">MGN</span><span className="text-white text-[12px] font-mono">{company.metrics.margin}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
