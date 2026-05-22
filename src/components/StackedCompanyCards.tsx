"use client";
import { useState } from "react";
import Link from "next/link";

const COMPANIES = [
  { symbol: "AAPL", name: "Apple Inc.", nameCn: "苹果公司", industry: "消费电子与服务", color: "#A3AAAE", bgTint: "#f5f3f0", desc: "A converging meeting point between hardware ecosystem and AI services.", metrics: { revenue: "$394.3B", pe: "30.2x", margin: "44.1%" }, tags: ["Tech", "Consumer", "AI"], image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=70" },
  { symbol: "MSFT", name: "Microsoft", nameCn: "微软", industry: "云计算与企业软件", color: "#00A4EF", bgTint: "#eef6fc", desc: "Enterprise AI leader with Azure momentum and Copilot monetization.", metrics: { revenue: "$227.6B", pe: "38.4x", margin: "69.4%" }, tags: ["Tech", "Cloud", "AI"], image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=400&q=70" },
  { symbol: "NVDA", name: "NVIDIA", nameCn: "英伟达", industry: "AI芯片与GPU计算", color: "#76B900", bgTint: "#f3f7ec", desc: "Monopolistic GPU supplier riding the AI infrastructure supercycle.", metrics: { revenue: "$130.5B", pe: "65.1x", margin: "73.0%" }, tags: ["Tech", "AI", "Semi"], image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&q=70" },
  { symbol: "GOOGL", name: "Alphabet", nameCn: "谷歌母公司", industry: "搜索广告与云平台", color: "#4285F4", bgTint: "#eef2fc", desc: "Search dominance meets Gemini AI and Cloud acceleration.", metrics: { revenue: "$350.0B", pe: "24.0x", margin: "57.2%" }, tags: ["Tech", "Ads", "AI"], image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&q=70" },
  { symbol: "AMZN", name: "Amazon", nameCn: "亚马逊", industry: "电商与云基础设施", color: "#FF9900", bgTint: "#fdf5e8", desc: "Dual flywheel of e-commerce and AWS reaching profit inflection.", metrics: { revenue: "$638.0B", pe: "58.7x", margin: "24.1%" }, tags: ["Tech", "Cloud", "EC"], image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&q=70" },
  { symbol: "TSLA", name: "Tesla", nameCn: "特斯拉", industry: "电动车与能源", color: "#CC0000", bgTint: "#fcf0f0", desc: "Beyond EVs: FSD autonomy, Optimus robotics, and energy storage.", metrics: { revenue: "$96.8B", pe: "71.8x", margin: "17.9%" }, tags: ["Auto", "Energy", "AI"], image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&q=70" },
  { symbol: "META", name: "Meta Platforms", nameCn: "Meta", industry: "社交广告与元宇宙", color: "#0668E1", bgTint: "#eef4fd", desc: "Social ads powerhouse betting big on AI and mixed reality.", metrics: { revenue: "$165.0B", pe: "28.5x", margin: "81.5%" }, tags: ["Tech", "Ads", "VR"], image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=70" },
  { symbol: "JPM", name: "JPMorgan Chase", nameCn: "摩根大通", industry: "综合金融服务", color: "#003A70", bgTint: "#eef1f5", desc: "America's largest bank with unmatched scale in investment banking.", metrics: { revenue: "$177.6B", pe: "12.1x", margin: "38.2%" }, tags: ["Finance", "Bank", "IB"], image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&q=70" },
];

export default function StackedCompanyCards() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="companies"
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: hovered !== null ? COMPANIES[hovered].bgTint : "#f0ede8" }}
    >
      {/* 左侧装饰 */}
      <div className="absolute left-0 top-0 bottom-0 w-[200px] hidden lg:block pointer-events-none opacity-50">
        <img src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=50" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-[200px] hidden lg:block pointer-events-none opacity-50">
        <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=50" alt="" className="w-full h-full object-cover" />
      </div>

      {/* 左上角标签 */}
      <div className="absolute top-6 left-6 z-20 hidden md:block">
        <span className="px-4 py-2 bg-[#1a1a1a] text-white text-[10px] font-mono rounded-lg uppercase tracking-[0.2em]">
          Stock Insight Archive
        </span>
      </div>

      {/* 3D 唱片堆叠容器 */}
      <div className="relative w-full max-w-[680px] z-10" style={{ perspective: "1200px" }}>
        {COMPANIES.map((company, index) => {
          const isHovered = hovered === index;
          const offset = hovered !== null ? index - hovered : 0;

          let transform: string;
          let zIdx: number;
          let opa: number;
          let shadow: string;
          let mb: string;

          if (isHovered) {
            transform = "rotateX(0deg) translateZ(60px) scale(1.04)";
            zIdx = 50;
            opa = 1;
            shadow = "0 25px 50px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.85)";
            mb = "6px";
          } else if (hovered !== null) {
            const dist = Math.abs(offset);
            const angle = offset < 0 ? dist * 7 : dist * -7;
            const s = Math.max(1 - dist * 0.025, 0.88);
            transform = `rotateX(${angle}deg) translateZ(${-dist * 15}px) scale(${s})`;
            zIdx = 20 - dist;
            opa = Math.max(1 - dist * 0.12, 0.5);
            shadow = "0 4px 15px rgba(0,0,0,0.25)";
            mb = "-10px";
          } else {
            const angle = (index - COMPANIES.length / 2) * 2.5;
            transform = `rotateX(${angle}deg)`;
            zIdx = COMPANIES.length - index;
            opa = 1;
            shadow = "0 2px 8px rgba(0,0,0,0.2)";
            mb = "-8px";
          }

          return (
            <div
              key={company.symbol}
              className="relative cursor-pointer rounded-2xl overflow-hidden"
              style={{ transform, transformOrigin: "center center", zIndex: zIdx, opacity: opa, boxShadow: shadow, transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)", marginBottom: mb }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHovered ? <HoveredCard company={company} /> : <DefaultCard company={company} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══ 默认卡片（像唱片封套侧面） ═══ */
function DefaultCard({ company }: { company: (typeof COMPANIES)[number] }) {
  return (
    <div className="h-[54px] bg-[#1a1a1a] flex items-center px-4 gap-3">
      <div className="w-[38px] h-[38px] rounded-lg overflow-hidden shrink-0 shadow">
        <img src={company.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-[10px] text-[#555] font-mono">●●</span>
        <span className="text-[11px] text-[#aaa] font-mono uppercase tracking-wider truncate">{company.name}</span>
      </div>
      <div className="flex gap-1 shrink-0">
        {company.tags.map(tag => (
          <span key={tag} className="px-1.5 py-0.5 text-[8px] rounded font-mono" style={{ background: `${company.color}20`, color: company.color }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══ 悬停卡片（弹出放大，白色边框光晕） ═══ */
function HoveredCard({ company }: { company: (typeof COMPANIES)[number] }) {
  return (
    <div className="bg-[#1a1a1a] p-5">
      <div className="flex gap-4">
        <div className="w-[85px] h-[85px] rounded-xl overflow-hidden shrink-0 shadow-lg">
          <img src={company.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] text-[#555] font-mono">●●● {company.nameCn}</span>
            <div className="flex gap-1 ml-auto">
              {company.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 text-[8px] rounded font-mono" style={{ background: `${company.color}25`, color: company.color }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <h3 className="text-white text-lg font-bold leading-tight">{company.name}</h3>
          <p className="text-[#777] text-[11px] mt-0.5 mb-2">{company.industry}</p>
          <p className="text-[#999] text-[11px] leading-relaxed line-clamp-2">{company.desc}</p>
          <div className="flex items-center gap-4 mt-3">
            <div><span className="text-[8px] text-[#555] font-mono block">REV</span><span className="text-white text-[11px] font-mono">{company.metrics.revenue}</span></div>
            <div><span className="text-[8px] text-[#555] font-mono block">P/E</span><span className="text-white text-[11px] font-mono">{company.metrics.pe}</span></div>
            <div><span className="text-[8px] text-[#555] font-mono block">MARGIN</span><span className="text-white text-[11px] font-mono">{company.metrics.margin}</span></div>
            <Link href={`/company/${company.symbol}`} className="ml-auto px-3 py-1 bg-white text-black text-[10px] rounded-md font-medium hover:bg-zinc-200 transition-colors" onClick={e => e.stopPropagation()}>
              查看报告 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}