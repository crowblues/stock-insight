"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const COMPANIES = [
  { symbol: "AAPL", name: "Apple Inc.", nameCn: "苹果公司", industry: "消费电子与服务", color: "#A3AAAE", lightBg: "#f5f3f0", metrics: { revenue: "$394.3B", eps: "$6.57", pe: "30.2x", roe: "160%", margin: "44.1%" }, story: "全球市值最高的科技公司，以 iPhone 生态为核心，正在向服务和 AI 转型。Services 业务年收入突破千亿美元，Apple Intelligence 开启设备端 AI 新时代。", tags: ["Tech", "Consumer", "AI"], image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80" },
  { symbol: "MSFT", name: "Microsoft", nameCn: "微软", industry: "云计算与企业软件", color: "#00A4EF", lightBg: "#eef6fc", metrics: { revenue: "$227.6B", eps: "$11.07", pe: "38.4x", roe: "38%", margin: "69.4%" }, story: "Azure 云和 AI Copilot 双引擎驱动，企业级 AI 落地最快的科技巨头。GitHub Copilot 用户突破百万，Office 365 渗透率持续攀升。", tags: ["Tech", "Cloud", "AI"], image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80" },
  { symbol: "NVDA", name: "NVIDIA", nameCn: "英伟达", industry: "AI芯片与GPU计算", color: "#76B900", lightBg: "#f3f7ec", metrics: { revenue: "$130.5B", eps: "$2.94", pe: "65.1x", roe: "115%", margin: "73.0%" }, story: "AI 时代的\"卖铲人\"，GPU 算力垄断者，数据中心收入爆发式增长。Blackwell 架构供不应求，推理市场份额持续扩大。", tags: ["Tech", "AI", "Semiconductor"], image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80" },
  { symbol: "GOOGL", name: "Alphabet", nameCn: "谷歌母公司", industry: "搜索广告与云平台", color: "#4285F4", lightBg: "#eef2fc", metrics: { revenue: "$350.0B", eps: "$7.32", pe: "24.0x", roe: "32%", margin: "57.2%" }, story: "搜索广告霸主，Gemini AI 大模型加速落地，YouTube 和 Cloud 持续增长。Waymo 自动驾驶商业化进入新阶段。", tags: ["Tech", "Ads", "AI"], image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80" },
  { symbol: "AMZN", name: "Amazon", nameCn: "亚马逊", industry: "电商与云基础设施", color: "#FF9900", lightBg: "#fdf5e8", metrics: { revenue: "$638.0B", eps: "$5.53", pe: "58.7x", roe: "22%", margin: "24.1%" }, story: "电商+AWS 云双飞轮，AI 驱动的物流效率持续优化，利润率拐点已现。Bedrock 平台成为企业 AI 首选。", tags: ["Tech", "E-Commerce", "Cloud"], image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80" },
  { symbol: "TSLA", name: "Tesla", nameCn: "特斯拉", industry: "电动车与能源", color: "#CC0000", lightBg: "#fcf0f0", metrics: { revenue: "$96.8B", eps: "$2.48", pe: "71.8x", roe: "20%", margin: "17.9%" }, story: "不只是车企——FSD 自动驾驶、Optimus 机器人、储能业务打开新天花板。Robotaxi 即将商业化运营。", tags: ["Auto", "Energy", "AI"], image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80" },
];

export default function StackedCompanyCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const active = COMPANIES[activeIndex];

  return (
    <section id="companies" className="relative min-h-screen py-16 px-4 transition-colors duration-700 overflow-hidden" style={{ backgroundColor: active.lightBg }}>
      {/* 左侧装饰 */}
      <div className="absolute left-6 top-[20%] w-36 h-52 rounded-2xl overflow-hidden opacity-30 hidden xl:block shadow-xl" style={{ transform: "rotate(-6deg) translateZ(0)" }}>
        <Image src={COMPANIES[(activeIndex + 1) % 6].image} alt="" fill className="object-cover" sizes="144px" />
      </div>
      <div className="absolute left-16 bottom-[15%] w-28 h-40 rounded-xl overflow-hidden opacity-20 hidden xl:block shadow-lg" style={{ transform: "rotate(4deg)" }}>
        <Image src={COMPANIES[(activeIndex + 3) % 6].image} alt="" fill className="object-cover" sizes="112px" />
      </div>
      {/* 右侧浮动封面 */}
      <div className="absolute right-6 top-[25%] w-40 h-56 rounded-2xl overflow-hidden shadow-2xl hidden xl:block transition-all duration-700" style={{ transform: "rotate(4deg)", opacity: 0.6 }}>
        <Image src={active.image} alt="" fill className="object-cover" sizes="160px" />
      </div>
      <div className="absolute right-20 bottom-[20%] w-24 h-32 rounded-xl overflow-hidden opacity-25 hidden xl:block shadow-lg" style={{ transform: "rotate(-3deg)" }}>
        <Image src={COMPANIES[(activeIndex + 4) % 6].image} alt="" fill className="object-cover" sizes="96px" />
      </div>

      {/* 标题 */}
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">Stock Insight Archive</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">翻阅全球巨头</h2>
      </div>

      {/* 中心面板 — 唱片堆叠 */}
      <div className="relative max-w-3xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.12)] overflow-hidden">
          {COMPANIES.map((company, index) => {
            const isActive = index === activeIndex;
            const isHovered = index === hoveredIndex;
            return (
              <div key={company.symbol} className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ maxHeight: isActive ? "800px" : "44px", overflow: "hidden" }}>
                {/* 唱片脊背 — 深色条 */}
                {!isActive && (
                  <button
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="w-full h-[44px] flex items-center gap-3 px-6 transition-all duration-300 cursor-pointer relative group"
                    style={{ background: isHovered ? company.color : "#1a1a1a" }}
                  >
                    <span className="text-[11px] font-mono text-white/40 group-hover:text-white/70">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white">{company.nameCn}</span>
                    <span className="text-xs text-white/40 font-mono">{company.symbol}</span>
                    <span className="ml-auto text-[11px] text-white/30 group-hover:text-white/60 hidden sm:inline">{company.industry}</span>
                    {/* 品牌色左边条 */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 transition-opacity duration-300" style={{ background: company.color, opacity: isHovered ? 1 : 0.3 }} />
                  </button>
                )}

                {/* 展开的内容 */}
                {isActive && (
                  <div className="p-8 md:p-10 animate-[fadeIn_0.6s_ease-out]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* 左：公司图片 */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                        <Image src={company.image} alt={company.nameCn} fill className="object-cover" sizes="(max-width:768px) 100vw, 400px" priority />
                        <div className="absolute bottom-3 left-3 flex gap-1.5">
                          {company.tags.map(tag => (<span key={tag} className="px-2.5 py-1 text-[10px] rounded-full bg-white/90 text-gray-700 font-medium shadow-sm">{tag}</span>))}
                        </div>
                      </div>
                      {/* 右：信息 */}
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-1">No. {String(index + 1).padStart(2, "0")} — {company.industry}</p>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-1">{company.nameCn}</h2>
                        <p className="text-base text-gray-500 mb-6">{company.name}</p>
                        <div className="border-t border-gray-200">
                          {[{ label: "Revenue (营收)", value: company.metrics.revenue }, { label: "EPS (每股收益)", value: company.metrics.eps }, { label: "P/E Ratio (市盈率)", value: company.metrics.pe }, { label: "ROE (净资产收益率)", value: company.metrics.roe }, { label: "Gross Margin (毛利率)", value: company.metrics.margin }].map((item, i) => (
                            <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50/50 px-2 -mx-2 rounded transition-colors">
                              <div className="flex items-center gap-3"><span className="text-[11px] text-gray-300 font-mono w-5">{String(i + 1).padStart(2, "0")}</span><span className="text-sm text-gray-600">{item.label}</span></div>
                              <span className="text-sm font-mono font-semibold text-gray-900">{item.value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-5"><h3 className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Company Story</h3><p className="text-sm text-gray-600 leading-relaxed">{company.story}</p></div>
                        <div className="flex gap-3 mt-6">
                          <Link href={`/company/${company.symbol}`} className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-full font-medium hover:bg-gray-700 transition-colors">查看完整报告</Link>
                          <button className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium hover:bg-gray-200 transition-colors border border-gray-200">对比分析</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
