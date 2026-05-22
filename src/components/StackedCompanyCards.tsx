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
  const active = COMPANIES[activeIndex];

  return (
    <section id="companies" className="relative min-h-screen py-20 px-4 transition-colors duration-700" style={{ backgroundColor: active.lightBg }}>
      {/* 两侧装饰图片 */}
      <div className="absolute left-4 top-1/4 w-32 h-44 rounded-2xl overflow-hidden opacity-40 hidden xl:block shadow-lg rotate-[-3deg]">
        <Image src={COMPANIES[1].image} alt="" fill className="object-cover" sizes="128px" />
      </div>
      <div className="absolute left-8 bottom-1/4 w-28 h-36 rounded-2xl overflow-hidden opacity-30 hidden xl:block shadow-lg rotate-[2deg]">
        <Image src={COMPANIES[4].image} alt="" fill className="object-cover" sizes="112px" />
      </div>
      {/* 右侧浮动封面卡片 */}
      <div className="absolute right-4 top-1/3 w-36 h-48 rounded-2xl overflow-hidden opacity-50 hidden xl:block shadow-xl rotate-[3deg]">
        <Image src={active.image} alt="" fill className="object-cover" sizes="144px" />
      </div>
      <div className="absolute right-12 bottom-1/3 w-28 h-36 rounded-2xl overflow-hidden opacity-30 hidden xl:block shadow-lg rotate-[-2deg]">
        <Image src={COMPANIES[2].image} alt="" fill className="object-cover" sizes="112px" />
      </div>

      {/* 中心面板 */}
      <div className="relative max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* 上方未选中的窄条 */}
          {COMPANIES.map((company, index) => {
            if (index >= activeIndex) return null;
            return (
              <button key={company.symbol} onClick={() => setActiveIndex(index)} className="w-full h-[38px] flex items-center px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left">
                <span className="text-xs font-mono text-gray-400 mr-3">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-sm font-medium text-gray-700">{company.nameCn}</span>
                <span className="text-xs text-gray-400 ml-2">{company.symbol}</span>
                <span className="ml-auto text-xs text-gray-400">{company.industry}</span>
              </button>
            );
          })}

          {/* 展开的活跃项 */}
          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 左侧：公司图片 */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image src={active.image} alt={active.nameCn} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" priority />
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {active.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-white/90 text-gray-700 font-medium">{tag}</span>
                  ))}
                </div>
              </div>
              {/* 右侧：公司信息 */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Stock Insight Archive</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-1">{active.nameCn}</h2>
                <p className="text-lg text-gray-500 mb-6">{active.name} · {active.industry}</p>

                {/* 财务指标列表（像曲目列表） */}
                <div className="border-t border-gray-200">
                  {[
                    { label: "Revenue (营收)", value: active.metrics.revenue },
                    { label: "EPS (每股收益)", value: active.metrics.eps },
                    { label: "P/E Ratio (市盈率)", value: active.metrics.pe },
                    { label: "ROE (净资产收益率)", value: active.metrics.roe },
                    { label: "Gross Margin (毛利率)", value: active.metrics.margin },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 group hover:bg-gray-50 px-2 -mx-2 rounded transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-gray-300 font-mono w-5">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <span className="text-sm font-mono font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Company Story */}
                <div className="mt-6">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Company Story</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{active.story}</p>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 mt-6">
                  <Link href={`/company/${active.symbol}`} className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-full font-medium hover:bg-gray-700 transition-colors">查看完整报告</Link>
                  <button className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium hover:bg-gray-200 transition-colors border border-gray-200">对比分析</button>
                </div>
              </div>
            </div>
          </div>

          {/* 下方未选中的窄条 */}
          {COMPANIES.map((company, index) => {
            if (index <= activeIndex) return null;
            return (
              <button key={company.symbol} onClick={() => setActiveIndex(index)} className="w-full h-[38px] flex items-center px-6 border-t border-gray-100 hover:bg-gray-50 transition-colors text-left">
                <span className="text-xs font-mono text-gray-400 mr-3">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-sm font-medium text-gray-700">{company.nameCn}</span>
                <span className="text-xs text-gray-400 ml-2">{company.symbol}</span>
                <span className="ml-auto text-xs text-gray-400">{company.industry}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
