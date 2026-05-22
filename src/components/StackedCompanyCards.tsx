"use client";
import { useState } from "react";
import Link from "next/link";

const COMPANIES = [
  {
    symbol: "AAPL", name: "Apple Inc.", nameCn: "苹果公司",
    industry: "消费电子与服务", color: "#A3AAAE", bgTint: "#f5f3f0",
    headline: "生态壁垒下的服务化转型",
    subtitle: "Revenue-driven growth with ecosystem lock-in and margin expansion.",
    metrics: { revenue: "$394.3B", eps: "$6.57", pe: "30.2x", roe: "160%", margin: "44.1%" },
    story: "全球市值最高的科技公司，以 iPhone 生态为核心，Services 收入占比持续攀升。Apple Intelligence 开启设备端 AI 新时代，Vision Pro 布局空间计算。",
    tags: ["Tech", "Consumer", "AI"],
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
  },
  {
    symbol: "MSFT", name: "Microsoft", nameCn: "微软",
    industry: "云计算与企业软件", color: "#00A4EF", bgTint: "#eef6fc",
    headline: "云与 AI 的双轮驱动",
    subtitle: "Enterprise AI leader with Azure momentum and Copilot monetization.",
    metrics: { revenue: "$227.6B", eps: "$11.07", pe: "38.4x", roe: "38%", margin: "69.4%" },
    story: "Azure 云和 AI Copilot 双引擎驱动，企业级 AI 落地最快的科技巨头。GitHub Copilot 用户突破百万，Office 365 渗透率持续攀升。",
    tags: ["Tech", "Cloud", "AI"],
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80",
  },
  {
    symbol: "NVDA", name: "NVIDIA", nameCn: "英伟达",
    industry: "AI芯片与GPU计算", color: "#76B900", bgTint: "#f3f7ec",
    headline: "算力垄断者的指数增长",
    subtitle: "Monopolistic GPU supplier riding the AI infrastructure supercycle.",
    metrics: { revenue: "$130.5B", eps: "$2.94", pe: "65.1x", roe: "115%", margin: "73.0%" },
    story: "AI 时代的'卖铲人'，数据中心 GPU 垄断者。Blackwell 架构供不应求，推理市场份额持续扩大，数据中心收入爆发式增长。",
    tags: ["Tech", "AI", "Semiconductor"],
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80",
  },
  {
    symbol: "GOOGL", name: "Alphabet", nameCn: "谷歌母公司",
    industry: "搜索广告与云平台", color: "#4285F4", bgTint: "#eef2fc",
    headline: "搜索帝国的 AI 重构",
    subtitle: "Search dominance meets Gemini AI and Cloud acceleration.",
    metrics: { revenue: "$350.0B", eps: "$7.32", pe: "24.0x", roe: "32%", margin: "57.2%" },
    story: "搜索广告霸主，Gemini 大模型加速落地，YouTube 广告和 Cloud 持续高增。Waymo 自动驾驶商业化进入新阶段。",
    tags: ["Tech", "Ads", "AI"],
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80",
  },
  {
    symbol: "AMZN", name: "Amazon", nameCn: "亚马逊",
    industry: "电商与云基础设施", color: "#FF9900", bgTint: "#fdf5e8",
    headline: "飞轮效应的利润拐点",
    subtitle: "Dual flywheel of e-commerce and AWS reaching profit inflection.",
    metrics: { revenue: "$638.0B", eps: "$5.53", pe: "58.7x", roe: "22%", margin: "24.1%" },
    story: "电商+AWS 云双飞轮，AI 驱动的物流效率持续优化，利润率拐点已现。广告业务成为第三增长极。",
    tags: ["Tech", "E-Commerce", "Cloud"],
    image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80",
  },
  {
    symbol: "TSLA", name: "Tesla", nameCn: "特斯拉",
    industry: "电动车与能源", color: "#CC0000", bgTint: "#fcf0f0",
    headline: "从车企到 AI 机器人平台",
    subtitle: "Beyond EVs: FSD autonomy, Optimus robotics, and energy storage.",
    metrics: { revenue: "$96.8B", eps: "$2.48", pe: "71.8x", roe: "20%", margin: "17.9%" },
    story: "不只是车企——FSD 自动驾驶、Optimus 机器人、储能业务打开全新天花板。Robotaxi 即将商业化运营。",
    tags: ["Auto", "Energy", "AI"],
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
  },
];

type Company = (typeof COMPANIES)[number];

export default function StackedCompanyCards() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const active = COMPANIES[expandedIndex];
  const before = COMPANIES.slice(0, expandedIndex);
  const after = COMPANIES.slice(expandedIndex + 1);

  return (
    <section
      id="companies"
      className="relative min-h-screen flex items-center justify-center py-16 px-4 transition-all duration-700 overflow-hidden"
      style={{ backgroundColor: active.bgTint }}
    >
      {/* 左侧装饰 */}
      <div className="absolute left-0 top-0 bottom-0 w-[180px] hidden lg:block pointer-events-none opacity-40">
        <img src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=50" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-current" style={{ color: active.bgTint }} />
      </div>
      {/* 右侧装饰 */}
      <div className="absolute right-0 top-0 bottom-0 w-[180px] hidden lg:block pointer-events-none opacity-40">
        <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=50" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-current" style={{ color: active.bgTint }} />
      </div>

      {/* 右侧浮动封面 */}
      <div className="absolute right-[200px] top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 z-10">
        {COMPANIES.filter((_, i) => i !== expandedIndex).slice(0, 3).map((c) => (
          <div
            key={c.symbol}
            onClick={() => setExpandedIndex(COMPANIES.indexOf(c))}
            className="w-[120px] h-[140px] rounded-xl overflow-hidden shadow-md cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 relative group"
          >
            <img src={c.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <div className="text-white text-[11px] font-bold leading-tight">{c.nameCn}</div>
              <div className="text-white/60 text-[9px] font-mono">{c.symbol}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 中央面板 */}
      <div className="relative w-full max-w-[680px] rounded-2xl shadow-2xl overflow-hidden z-10 bg-white">
        {/* 顶部堆叠条 */}
        {before.map((c) => (
          <StackBar key={c.symbol} company={c} onClick={() => setExpandedIndex(COMPANIES.indexOf(c))} />
        ))}

        {/* 展开内容 */}
        <ExpandedPanel company={active} />

        {/* 底部堆叠条 */}
        {after.map((c) => (
          <StackBar key={c.symbol} company={c} onClick={() => setExpandedIndex(COMPANIES.indexOf(c))} />
        ))}
      </div>
    </section>
  );
}

/* ═══ 深色窄条（未选中的公司） ═══ */
function StackBar({ company, onClick }: { company: Company; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="h-[42px] bg-[#1a1a1a] flex items-center px-5 cursor-pointer hover:bg-[#252525] transition-colors border-b border-[#2a2a2a] last:border-b-0 first:border-t-0"
    >
      <div
        className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center mr-3 shrink-0"
        style={{ background: company.color }}
      >
        <span className="text-[9px] text-white font-bold">{company.symbol[0]}</span>
      </div>
      <span className="text-[#888] text-[11px] font-mono uppercase tracking-[0.12em] truncate">
        {company.name}
      </span>
      <span className="ml-auto text-[10px] text-[#555] font-mono">{company.metrics.pe}</span>
    </div>
  );
}

/* ═══ 展开面板（选中的公司） ═══ */
function ExpandedPanel({ company }: { company: Company }) {
  return (
    <div className="bg-white">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-7 pt-6 pb-4">
        <span className="text-[10px] text-[#999] uppercase tracking-[0.25em] font-mono">
          Stock Insight Archive
        </span>
        <span className="text-[10px] text-[#666] font-mono">{company.nameCn}</span>
      </div>

      {/* 大图 */}
      <div className="relative mx-7 h-[260px] rounded-xl overflow-hidden">
        <img
          src={company.image}
          alt={company.name}
          className="w-full h-full object-cover"
          style={{ filter: "grayscale(25%) contrast(1.05)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-5">
          <span className="text-white/80 text-[11px] font-mono uppercase tracking-[0.1em]">
            {company.symbol} | {company.industry}
          </span>
        </div>
      </div>

      {/* 标签行 */}
      <div className="flex items-center gap-2 px-7 mt-5 mb-3">
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: company.color }} />
        <span className="text-[9px] text-[#aaa] uppercase tracking-[0.2em] font-mono">
          Archived 2026 · {company.tags[0]}
        </span>
      </div>

      {/* 大标题 */}
      <div className="px-7 mb-6">
        <h2 className="text-[26px] font-bold text-[#1a1a1a] leading-[1.3] mb-2 font-serif">
          财报解码：{company.headline}
        </h2>
        <p className="text-[13px] text-[#888] italic leading-relaxed">
          {company.subtitle}
        </p>
      </div>

      {/* 分割线 */}
      <div className="mx-7 border-t border-[#eee]" />

      {/* KEY METRICS */}
      <div className="px-7 pt-5 pb-2">
        <h3 className="text-[10px] text-[#aaa] uppercase tracking-[0.25em] font-mono mb-4">
          Key Metrics
        </h3>
        {[
          { label: "Revenue (营收)", value: company.metrics.revenue },
          { label: "EPS (每股收益)", value: company.metrics.eps },
          { label: "P/E Ratio (市盈率)", value: company.metrics.pe },
          { label: "ROE (净资产收益率)", value: company.metrics.roe },
          { label: "Gross Margin (毛利率)", value: company.metrics.margin },
        ].map((item, i) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-[10px] border-b border-[#f5f5f5] hover:bg-[#fafafa] px-2 -mx-2 rounded transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[#ccc] font-mono w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] text-[#555]">{item.label}</span>
            </div>
            <span className="text-[13px] text-[#1a1a1a] font-mono font-semibold">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* 分割线 */}
      <div className="mx-7 border-t border-[#eee] mt-2" />

      {/* COMPANY STORY */}
      <div className="px-7 py-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] text-[#aaa] uppercase tracking-[0.25em] font-mono">
            📄 Company Story
          </h3>
          <Link
            href={`/company/${company.symbol}`}
            className="text-[10px] text-[#999] border border-[#ddd] rounded px-2 py-[3px] hover:bg-[#f5f5f5] transition-colors font-mono uppercase tracking-wider"
          >
            Read More
          </Link>
        </div>
        <p className="text-[13px] text-[#666] leading-[1.8]">{company.story}</p>
      </div>

      {/* 底部状态栏 */}
      <div className="mx-7 border-t border-[#eee] pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-[#aaa] font-mono uppercase tracking-wider">Live</span>
          </div>
          <span className="text-[9px] text-[#aaa] font-mono uppercase tracking-[0.2em]">
            Stock Insight
          </span>
        </div>
      </div>

      {/* Analyst Terminal */}
      <div className="mx-7 border-t border-[#f0f0f0] pt-3 pb-6">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-[#bbb] font-mono">↗ ANALYST TERMINAL</span>
          <Link
            href={`/company/${company.symbol}`}
            className="text-[9px] text-[#999] border border-[#ddd] rounded px-3 py-1 hover:bg-[#f5f5f5] transition-colors font-mono uppercase"
          >
            Open
          </Link>
        </div>
      </div>
    </div>
  );
}