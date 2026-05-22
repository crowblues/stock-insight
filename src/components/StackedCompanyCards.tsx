"use client";
import { useState } from "react";
import Link from "next/link";

const COMPANIES = [
  { symbol: "AAPL", name: "Apple Inc.", nameCn: "苹果公司", industry: "消费电子与服务", color: "#A3AAAE", bgTint: "#f5f3f0", desc: "A converging meeting point between hardware ecosystem and AI services.", metrics: { revenue: "$394.3B", pe: "30.2x", margin: "44.1%" }, tags: ["Tech", "Consumer", "AI"], image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80" },
  { symbol: "MSFT", name: "Microsoft", nameCn: "微软", industry: "云计算与企业软件", color: "#00A4EF", bgTint: "#eef6fc", desc: "Enterprise AI leader with Azure momentum and Copilot monetization.", metrics: { revenue: "$227.6B", pe: "38.4x", margin: "69.4%" }, tags: ["Tech", "Cloud", "AI"], image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80" },
  { symbol: "NVDA", name: "NVIDIA", nameCn: "英伟达", industry: "AI芯片与GPU计算", color: "#76B900", bgTint: "#f3f7ec", desc: "Monopolistic GPU supplier riding the AI infrastructure supercycle.", metrics: { revenue: "$130.5B", pe: "65.1x", margin: "73.0%" }, tags: ["Tech", "AI", "Semi"], image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80" },
  { symbol: "GOOGL", name: "Alphabet", nameCn: "谷歌母公司", industry: "搜索广告与云平台", color: "#4285F4", bgTint: "#eef2fc", desc: "Search dominance meets Gemini AI and Cloud acceleration.", metrics: { revenue: "$350.0B", pe: "24.0x", margin: "57.2%" }, tags: ["Tech", "Ads", "AI"], image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80" },
  { symbol: "AMZN", name: "Amazon", nameCn: "亚马逊", industry: "电商与云基础设施", color: "#FF9900", bgTint: "#fdf5e8", desc: "Dual flywheel of e-commerce and AWS reaching profit inflection.", metrics: { revenue: "$638.0B", pe: "58.7x", margin: "24.1%" }, tags: ["Tech", "Cloud", "EC"], image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80" },
  { symbol: "TSLA", name: "Tesla", nameCn: "特斯拉", industry: "电动车与能源", color: "#CC0000", bgTint: "#fcf0f0", desc: "Beyond EVs: FSD autonomy, Optimus robotics, and energy storage.", metrics: { revenue: "$96.8B", pe: "71.8x", margin: "17.9%" }, tags: ["Auto", "Energy", "AI"], image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80" },
  { symbol: "META", name: "Meta Platforms", nameCn: "Meta", industry: "社交广告与元宇宙", color: "#0668E1", bgTint: "#eef4fd", desc: "Social ads powerhouse betting big on AI and mixed reality.", metrics: { revenue: "$165.0B", pe: "28.5x", margin: "81.5%" }, tags: ["Tech", "Ads", "VR"], image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80" },
  { symbol: "JPM", name: "JPMorgan Chase", nameCn: "摩根大通", industry: "综合金融服务", color: "#003A70", bgTint: "#eef1f5", desc: "America's largest bank with unmatched scale in investment banking.", metrics: { revenue: "$177.6B", pe: "12.1x", margin: "38.2%" }, tags: ["Finance", "Bank", "IB"], image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800&q=80" },
];

export default function StackedCompanyCards() {
  const [hovered, setHovered] = useState<number | null>(null);
  const activeCompany = hovered !== null ? COMPANIES[hovered] : null;

  return (
    <section
      id="companies"
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden"
      style={{ backgroundColor: activeCompany ? activeCompany.bgTint : "#f0ede8" }}
    >
      {/* 模糊背景图 */}
      {COMPANIES.map((company, i) => (
        <div key={company.symbol} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: hovered === i ? 0.25 : 0 }}>
          <img src={company.image} alt="" className="w-full h-full object-cover blur-[50px] scale-110" />
        </div>
      ))}

      {/* 左上角标签 */}
      <div className="absolute top-6 left-6 z-20 hidden md:block">
        <span className="px-4 py-2 bg-[#1a1a1a] text-white text-[10px] font-mono rounded-lg uppercase tracking-[0.2em]">
          Stock Insight Archive
        </span>
      </div>

      {/* 3D 唱片堆叠容器 */}
      <div className="relative w-full max-w-[700px] z-10 px-4" style={{ perspective: "1400px" }}>
        {COMPANIES.map((company, index) => {
          const isHovered = hovered === index;
          const total = COMPANIES.length;

          // 默认：所有卡片按固定角度堆叠（从上到下逐渐平）
          // 选中时：只有选中卡片弹出倾斜，其他卡片保持原位不动
          const baseAngle = (index - total / 2) * 2.5;

          let transform: string;
          let zIdx: number;
          let opa: number;
          let shadow: string;

          if (isHovered) {
            // 选中：大幅弹出 + 明显倾斜（像从唱片堆里抽出来）
            transform = "rotateX(-6deg) rotateY(2deg) translateZ(120px) translateX(-10px) scale(1.04)";
            zIdx = 50;
            opa = 1;
            shadow = "0 40px 80px rgba(0,0,0,0.5), 0 0 0 2.5px rgba(255,255,255,0.95), 0 0 40px rgba(255,255,255,0.08)";
          } else {
            // 未选中：保持原位，不动
            transform = `rotateX(${baseAngle}deg) translateZ(0px) scale(1)`;
            zIdx = total - index;
            opa = hovered !== null ? 0.85 : 1;
            shadow = "0 2px 6px rgba(0,0,0,0.15)";
          }

          return (
            <Link
              key={company.symbol}
              href={`/company/${company.symbol}`}
              className="relative block cursor-pointer rounded-2xl overflow-hidden"
              style={{
                transform,
                transformOrigin: "center bottom",
                zIndex: zIdx,
                opacity: opa,
                boxShadow: shadow,
                transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                marginBottom: "-4px",
                willChange: "transform",
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHovered ? (
                <HoveredCard company={company} />
              ) : (
                <DefaultCard company={company} />
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ═══ 默认卡片（唱片封套侧面） ═══ */
function DefaultCard({ company }: { company: (typeof COMPANIES)[number] }) {
  return (
    <div className="h-[52px] bg-[#1a1a1a] flex items-center px-5 gap-3">
      <div className="w-[36px] h-[36px] rounded-lg overflow-hidden shrink-0 ring-1 ring-white/10">
        <img src={company.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <span className="text-[10px] text-white/50 font-mono">...</span>
        <span className="text-[11px] text-white/70 font-mono uppercase tracking-wider truncate">{company.name}</span>
      </div>
      <div className="flex gap-1.5 shrink-0">
        {company.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 text-[9px] rounded-full font-mono" style={{ background: `${company.color}20`, color: company.color }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══ 悬停卡片（弹出倾斜，白色边框光晕） ═══ */
function HoveredCard({ company }: { company: (typeof COMPANIES)[number] }) {
  return (
    <div className="bg-[#1a1a1a] p-5">
      <div className="flex gap-5">
        <div className="w-[90px] h-[90px] rounded-xl overflow-hidden shrink-0 ring-2 ring-white/20">
          <img src={company.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-white/40 font-mono">{company.symbol}</span>
            <span className="text-[10px] text-white/30">·</span>
            <span className="text-[10px] text-white/40 font-mono">{company.nameCn}</span>
            <div className="flex gap-1.5 ml-auto">
              {company.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-[9px] rounded-full font-mono" style={{ background: `${company.color}25`, color: company.color }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <h3 className="text-white text-lg font-bold leading-tight">{company.name}</h3>
          <p className="text-white/40 text-[11px] mt-0.5 mb-2">{company.industry}</p>
          <p className="text-white/55 text-[11px] leading-relaxed line-clamp-2">{company.desc}</p>
          <div className="flex items-center gap-5 mt-3">
            <div>
              <span className="text-[8px] text-white/30 font-mono block uppercase">Rev</span>
              <span className="text-white text-[12px] font-mono font-medium">{company.metrics.revenue}</span>
            </div>
            <div>
              <span className="text-[8px] text-white/30 font-mono block uppercase">P/E</span>
              <span className="text-white text-[12px] font-mono font-medium">{company.metrics.pe}</span>
            </div>
            <div>
              <span className="text-[8px] text-white/30 font-mono block uppercase">Margin</span>
              <span className="text-white text-[12px] font-mono font-medium">{company.metrics.margin}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
