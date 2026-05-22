"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const CARDS = [
  { symbol: "AAPL", name: "苹果", sub: "Apple Inc.", desc: "硬件生态 × AI 服务，全球最大市值公司。", tags: ["科技","AI"], image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=70" },
  { symbol: "MSFT", name: "微软", sub: "Microsoft", desc: "Azure 云增长 + Copilot 商业化全面铺开。", tags: ["云","SaaS"], image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=400&q=70" },
  { symbol: "NVDA", name: "英伟达", sub: "NVIDIA", desc: "AI 超级周期中的垄断级 GPU 供应商。", tags: ["芯片","AI"], image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&q=70" },
  { symbol: "GOOGL", name: "谷歌", sub: "Alphabet", desc: "搜索霸主遇上 Gemini，广告+云双引擎。", tags: ["广告","云"], image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&q=70" },
  { symbol: "AMZN", name: "亚马逊", sub: "Amazon", desc: "电商+AWS 双飞轮，利润拐点已至。", tags: ["云","电商"], image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&q=70" },
  { symbol: "TSLA", name: "特斯拉", sub: "Tesla", desc: "FSD 自动驾驶 + Optimus 机器人 + 能源。", tags: ["汽车","AI"], image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&q=70" },
  { symbol: "META", name: "Meta", sub: "Meta Platforms", desc: "社交广告巨头，全力押注 AI 和混合现实。", tags: ["广告","VR"], image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=70" },
  { symbol: "JPM", name: "摩根大通", sub: "JPMorgan Chase", desc: "美国最大银行，规模无可匹敌。", tags: ["金融","银行"], image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&q=70" },
  { symbol: "V", name: "维萨", sub: "Visa Inc.", desc: "全球支付双寡头，65%净利率。", tags: ["支付"], image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=70" },
  { symbol: "AVGO", name: "博通", sub: "Broadcom", desc: "定制 AI 芯片 + VMware 整合。", tags: ["芯片","AI"], image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70" },
  { symbol: "UNH", name: "联合健康", sub: "UnitedHealth", desc: "纵向整合的医疗健康服务巨头。", tags: ["医疗"], image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=70" },
  { symbol: "BRK.B", name: "伯克希尔", sub: "Berkshire", desc: "巴菲特帝国：保险、能源、铁路。", tags: ["价值","保险"], image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=70" },
];

export default function RecordGallery3D() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => { e.preventDefault(); e.stopPropagation(); };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-16" style={{ background: "#F5F4F0" }}>
      <div ref={containerRef} data-lenis-prevent className="relative flex flex-col items-center gap-[3px]"
        style={{ perspective: "750px", perspectiveOrigin: "center bottom", transformStyle: "preserve-3d" }}>
        {CARDS.map((card, index) => {
          const isActive = index === activeIndex;
          const zLayer = CARDS.length - index; // 第1张z最高
          const transform = isActive
            ? "rotateX(10deg) rotate(-2.5deg) translateZ(60px)"
            : `rotateX(16deg) translateZ(${zLayer}px)`;
          return (
            <div
              key={card.symbol}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className="relative"
              style={{
                width: "650px",
                height: isActive ? "auto" : "50px",
                transform,
                transformOrigin: "center bottom",
                transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                zIndex: isActive ? 50 : zLayer,
                marginTop: isActive ? "15px" : "0",
                marginBottom: isActive ? "15px" : "0",
                borderRadius: "12px",
                border: isActive ? "1.5px solid rgba(255,255,255,0.6)" : "none",
                borderTop: isActive ? "1.5px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.06)",
                boxShadow: isActive ? "0 20px 60px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)",
                background: "linear-gradient(180deg, #1f1f1f 0%, #141414 100%)",
                overflow: "hidden",
              }}
            >
              {isActive ? (
                <div className="p-5 flex gap-5 items-start">
                  <img src={card.image} alt={card.name} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/50 text-xs font-mono mb-0.5">{card.symbol}</p>
                    <h3 className="text-white text-xl font-bold">{card.name} <span className="text-white/50 text-sm font-normal">{card.sub}</span></h3>
                    <p className="text-white/60 text-sm mt-1.5 leading-relaxed">{card.desc}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Link href={`/company/${card.symbol}`} className="px-4 py-1.5 bg-white text-black text-xs rounded-full font-medium hover:bg-gray-200 transition-colors">查看报告 →</Link>
                      {card.tags.map(t => (<span key={t} className="px-2.5 py-1 text-[10px] rounded-full bg-white/10 text-white/70">{t}</span>))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[50px] flex items-center px-5 gap-3">
                  <img src={card.image} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                  <span className="text-white/90 text-sm font-medium truncate">{card.name}</span>
                  <span className="text-white/30 text-xs font-mono">{card.symbol}</span>
                  <div className="ml-auto flex gap-1.5">
                    {card.tags.map(t => (<span key={t} className="px-2 py-0.5 text-[9px] rounded-full bg-white/5 text-white/40">{t}</span>))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
