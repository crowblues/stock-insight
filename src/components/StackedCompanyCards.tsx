"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const COMPANIES = [
  { symbol: "AAPL", name: "Apple Inc.", nameCn: "苹果公司", industry: "消费电子与服务", color: "#555555", metrics: { revenue: "$394.3B", eps: "$6.57", pe: "30.2x", roe: "160%", margin: "44.1%" }, story: "全球市值最高的科技公司，以 iPhone 生态为核心，正在向服务和 AI 转型。", tags: ["Tech", "Consumer", "AI"], bgImage: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&q=60" },
  { symbol: "MSFT", name: "Microsoft", nameCn: "微软", industry: "云计算与企业软件", color: "#00A4EF", metrics: { revenue: "$227.6B", eps: "$11.07", pe: "38.4x", roe: "38%", margin: "69.4%" }, story: "Azure 云和 AI Copilot 双引擎驱动，企业级 AI 落地最快的科技巨头。", tags: ["Tech", "Cloud", "AI"], bgImage: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=1200&q=60" },
  { symbol: "NVDA", name: "NVIDIA", nameCn: "英伟达", industry: "AI芯片与GPU计算", color: "#76B900", metrics: { revenue: "$130.5B", eps: "$2.94", pe: "65.1x", roe: "115%", margin: "73.0%" }, story: "AI 时代的\"卖铲人\"，GPU 算力垄断者，数据中心收入爆发式增长。", tags: ["Tech", "AI", "Semiconductor"], bgImage: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=1200&q=60" },
  { symbol: "GOOGL", name: "Alphabet", nameCn: "谷歌母公司", industry: "搜索广告与云平台", color: "#4285F4", metrics: { revenue: "$350.0B", eps: "$7.32", pe: "24.0x", roe: "32%", margin: "57.2%" }, story: "搜索广告霸主，Gemini AI 大模型加速落地，YouTube 和 Cloud 持续增长。", tags: ["Tech", "Ads", "AI"], bgImage: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&q=60" },
  { symbol: "AMZN", name: "Amazon", nameCn: "亚马逊", industry: "电商与云基础设施", color: "#FF9900", metrics: { revenue: "$638.0B", eps: "$5.53", pe: "58.7x", roe: "22%", margin: "24.1%" }, story: "电商+AWS 云双飞轮，AI 驱动的物流效率持续优化，利润率拐点已现。", tags: ["Tech", "E-Commerce", "Cloud"], bgImage: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=1200&q=60" },
  { symbol: "TSLA", name: "Tesla", nameCn: "特斯拉", industry: "电动车与能源", color: "#CC0000", metrics: { revenue: "$96.8B", eps: "$2.48", pe: "71.8x", roe: "20%", margin: "17.9%" }, story: "不只是车企——FSD 自动驾驶、Optimus 机器人、储能业务打开新天花板。", tags: ["Auto", "Energy", "AI"], bgImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=60" },
];

type Company = typeof COMPANIES[number];

export default function StackedCompanyCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeColor = expandedIndex !== null ? COMPANIES[expandedIndex].color : activeIndex !== null ? COMPANIES[activeIndex].color : null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setExpandedIndex(null); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = expandedIndex !== null ? "hidden" : "";
  }, [expandedIndex]);

  const getCardStyle = (index: number): React.CSSProperties => {
    const isHovered = activeIndex === index;
    const isExpanded = expandedIndex === index;
    if (isExpanded) return { position: "fixed", inset: "5vh 5vw", zIndex: 100, transform: "none", filter: "none", opacity: 1, transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" };
    if (expandedIndex !== null && expandedIndex !== index) {
      const direction = index < expandedIndex ? -1 : 1;
      return { transform: `translateY(${direction * 120}vh) scale(0.85)`, opacity: 0.2, filter: "blur(4px)", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" };
    }
    if (isHovered) return { transform: "translateZ(60px) translateY(-8px) scale(1.02)", filter: "blur(0px)", opacity: 1, zIndex: 20, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" };
    return { transform: `translateZ(${index * -25}px) translateY(${index * 8}px)`, filter: `blur(${index * 0.6}px)`, opacity: 1 - index * 0.08, zIndex: 10 - index, transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" };
  };

  return (
    <>
      <div className="absolute inset-0 -z-10 transition-all duration-700 ease-out pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[160px] transition-all duration-700" style={{ background: activeColor ? `${activeColor}25` : "transparent", opacity: activeColor ? 1 : 0 }} />
        <div className="absolute top-0 left-0 right-0 h-1/2 transition-all duration-700" style={{ background: activeColor ? `radial-gradient(ellipse at top, ${activeColor}12 0%, transparent 70%)` : "transparent" }} />
      </div>
      {expandedIndex !== null && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]" onClick={() => setExpandedIndex(null)} />}
      <div ref={containerRef} className="relative w-full max-w-4xl mx-auto" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
        {COMPANIES.map((company, index) => (
          <div key={company.symbol} className="relative mb-3 cursor-pointer will-change-transform" style={getCardStyle(index)} onMouseEnter={() => expandedIndex === null && setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
            {expandedIndex === index ? <ExpandedCard company={company} onClose={() => setExpandedIndex(null)} /> : <CollapsedCard company={company} isHovered={activeIndex === index} />}
          </div>
        ))}
      </div>
    </>
  );
}

function CollapsedCard({ company, isHovered }: { company: Company; isHovered: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all duration-400 ${isHovered ? "bg-zinc-800/90 border-zinc-600 p-6" : "bg-zinc-900/80 border-zinc-800/60 p-5"}`} style={isHovered ? { borderColor: `${company.color}55` } : {}}>
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: company.color }} />
      <div className="flex items-center justify-between pl-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${company.color}66, ${company.color}22)`, border: `1px solid ${company.color}44` }}>
            <span className="relative z-10">{company.symbol[0]}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg">{company.nameCn}</span>
              <span className="text-sm font-mono text-zinc-500">{company.symbol}</span>
            </div>
            <div className="text-sm text-zinc-400">{company.industry}</div>
          </div>
        </div>
        <div className={`flex gap-6 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-60"}`}>
          <div className="text-right"><div className="text-xs text-zinc-500 uppercase">Revenue</div><div className="font-mono text-white">{company.metrics.revenue}</div></div>
          <div className="text-right"><div className="text-xs text-zinc-500 uppercase">P/E</div><div className="font-mono text-white">{company.metrics.pe}</div></div>
          <div className="text-right hidden md:block"><div className="text-xs text-zinc-500 uppercase">Margin</div><div className="font-mono text-emerald-400">{company.metrics.margin}</div></div>
        </div>
      </div>
      {isHovered && (
        <div className="flex gap-2 mt-3 pl-4">
          {company.tags.map(tag => (<span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-zinc-700/50 text-zinc-300 border border-zinc-700">{tag}</span>))}
        </div>
      )}
    </div>
  );
}

function ExpandedCard({ company, onClose }: { company: Company; onClose: () => void }) {
  return (
    <div className="relative w-full h-full bg-zinc-900 rounded-3xl border border-zinc-700 overflow-y-auto p-8 md:p-12">
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <img src={company.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] blur-[40px] scale-125" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top left, ${company.color}15 0%, transparent 50%)` }} />
      </div>
      <div className="relative flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-500 uppercase tracking-widest">Stock Insight Archive</span>
          <span className="text-zinc-700">·</span>
          <span className="text-sm text-zinc-400">{company.industry}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">✕</button>
      </div>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl flex items-center justify-center text-6xl md:text-8xl font-bold text-white shadow-2xl" style={{ background: `linear-gradient(135deg, ${company.color}44, ${company.color}11)`, border: `2px solid ${company.color}33` }}>{company.symbol.slice(0, 2)}</div>
          <div className="flex gap-2 mt-6">{company.tags.map(tag => (<span key={tag} className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">{tag}</span>))}</div>
        </div>
        <div>
          <span className="font-mono text-zinc-500 text-sm">{company.symbol}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{company.nameCn}</h2>
          <p className="text-xl text-zinc-400 mb-8">{company.name}</p>
          <div className="space-y-0 border-t border-zinc-800">
            {[{ label: "Revenue (营收)", value: company.metrics.revenue }, { label: "EPS (每股收益)", value: company.metrics.eps }, { label: "P/E Ratio (市盈率)", value: company.metrics.pe }, { label: "ROE (净资产收益率)", value: company.metrics.roe }, { label: "Gross Margin (毛利率)", value: company.metrics.margin }].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between py-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 px-3 -mx-3 rounded-lg transition-colors">
                <div className="flex items-center gap-3"><span className="text-xs text-zinc-600 font-mono w-5">{String(i + 1).padStart(2, "0")}</span><span className="text-zinc-300">{item.label}</span></div>
                <span className="font-mono text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-8"><h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-3">Company Story</h3><p className="text-zinc-300 leading-relaxed">{company.story}</p></div>
          <div className="flex gap-3 mt-8">
            <Link href={`/company/${company.symbol}`} className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors" onClick={(e) => e.stopPropagation()}>查看完整报告</Link>
            <button className="px-6 py-3 bg-zinc-800 text-white rounded-full font-medium border border-zinc-700 hover:border-zinc-500 transition-colors">对比分析</button>
          </div>
        </div>
      </div>
    </div>
  );
}
