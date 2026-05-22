"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const CARDS = [
  { symbol: "AAPL", name: "苹果", desc: "硬件生态 × AI 服务，全球最大市值公司。", tags: ["科技","AI"], image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&q=80" },
  { symbol: "MSFT", name: "微软", desc: "Azure 云增长 + Copilot 商业化全面铺开。", tags: ["云","SaaS"], image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=200&q=80" },
  { symbol: "NVDA", name: "英伟达", desc: "AI 超级周期中的垄断级 GPU 供应商。", tags: ["芯片","AI"], image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=200&q=80" },
  { symbol: "GOOGL", name: "谷歌", desc: "搜索霸主遇上 Gemini，广告+云双引擎。", tags: ["广告","云"], image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200&q=80" },
  { symbol: "AMZN", name: "亚马逊", desc: "电商+AWS 双飞轮，利润拐点已至。", tags: ["云","电商"], image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&q=80" },
  { symbol: "TSLA", name: "特斯拉", desc: "FSD 自动驾驶 + Optimus 机器人 + 能源。", tags: ["汽车","AI"], image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=200&q=80" },
  { symbol: "META", name: "Meta", desc: "社交广告巨头，全力押注 AI 和混合现实。", tags: ["广告","VR"], image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&q=80" },
  { symbol: "JPM", name: "摩根大通", desc: "美国最大银行，规模无可匹敌。", tags: ["金融"], image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&q=80" },
  { symbol: "V", name: "维萨", desc: "全球支付双寡头，65%净利率。", tags: ["支付"], image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80" },
  { symbol: "AVGO", name: "博通", desc: "定制 AI 芯片 + VMware 整合。", tags: ["芯片","AI"], image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80" },
  { symbol: "UNH", name: "联合健康", desc: "纵向整合的医疗健康服务巨头。", tags: ["医疗"], image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&q=80" },
  { symbol: "BRK.B", name: "伯克希尔", desc: "巴菲特帝国：保险、能源、铁路。", tags: ["价值"], image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80" },
];

export default function RecordGallery3D() {
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const scrollLock = useRef(false);

  // 丝滑滚动：防抖 + 动画锁，避免快速跳动
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollLock.current) return;
      scrollLock.current = true;
      const dir = e.deltaY > 0 ? 1 : -1;
      setActive(p => {
        const n = p + dir;
        if (n < -1) return CARDS.length - 1;
        if (n >= CARDS.length) return -1;
        return n;
      });
      setTimeout(() => { scrollLock.current = false; }, 300);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section id="companies" ref={ref} data-lenis-prevent
      className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a]"
      style={{ perspective: "1200px", perspectiveOrigin: "center 40%" }}>

      {/* 卡片堆 — 不旋转整体，只靠 perspective 产生俯视感 */}
      <div className="flex flex-col items-center gap-[3px]">
        {CARDS.map((card, i) => {
          const isActive = active === i;
          return (
            <div key={card.symbol}
              className="cursor-pointer"
              style={{
                transition: "all 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
                transform: isActive
                  ? "translateZ(80px) translateX(-30px) rotate(-2.5deg) scale(1.02)"
                  : "translateZ(0) translateX(0) rotate(0deg) scale(1)",
                zIndex: isActive ? 50 : CARDS.length - i,
                filter: active !== -1 && !isActive ? "brightness(0.6)" : "none",
              }}
              onClick={() => setActive(isActive ? -1 : i)}>

              {isActive ? (
                <div className="w-[520px] bg-[#181818] rounded-2xl p-5 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
                  <div className="flex gap-4">
                    <img src={card.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/30 text-[10px] font-mono tracking-wider">{card.symbol}</p>
                      <h3 className="text-white text-xl font-bold mt-0.5">{card.name}</h3>
                      <p className="text-white/40 text-xs mt-1.5 leading-relaxed">{card.desc}</p>
                      <div className="flex gap-2 mt-4">
                        <a href={`/company/${card.symbol}`}
                          className="px-4 py-1.5 text-[11px] font-medium rounded-full bg-white text-black hover:bg-white/90 transition-colors">
                          查看报告 →
                        </a>
                        {card.tags.map(t => (
                          <span key={t} className="px-3 py-1.5 text-[10px] rounded-full bg-white/[0.06] text-white/40 font-mono">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-[520px] h-[46px] bg-[#141414] rounded-xl flex items-center px-4 gap-3 border border-white/[0.04]">
                  <img src={card.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <span className="text-white/60 text-[12px] truncate flex-1">{card.name}</span>
                  <div className="flex gap-1.5">
                    {card.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 text-[9px] rounded-full bg-white/[0.06] text-white/30 font-mono">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 左下角状态 */}
      <div className="absolute bottom-8 left-8 pointer-events-none">
        <p className="text-[10px] font-mono text-white/20 tracking-widest">
          {active >= 0 ? `${String(active+1).padStart(2,"0")} / ${CARDS.length}` : "滚轮浏览"}
        </p>
      </div>
    </section>
  );
}
