"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";
import SideNav from "@/components/SideNav";
import Marquee from "@/components/Marquee";
import StackedCompanyCards from "@/components/StackedCompanyCards";

interface SearchResult { symbol: string; name: string; exchange: string; }

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-badge", { opacity: 0, y: 20, filter: "blur(10px)", duration: 0.8, delay: 0.3 })
      .from(".hero-title", { opacity: 0, y: 50, duration: 1.2 }, "-=0.4")
      .from(".hero-sub", { opacity: 0, y: 20, filter: "blur(8px)", duration: 0.8 }, "-=0.6")
      .from(".hero-cta", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, "-=0.4");
  }, { scope: heroRef });

  useGSAP(() => {
    if (!featRef.current) return;
    gsap.from(".feat-card", {
      scrollTrigger: { trigger: featRef.current, start: "top 80%" },
      y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out",
    });
  }, { scope: featRef });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try { const r = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`); setResults(await r.json()); }
    catch { setResults([]); } finally { setLoading(false); }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

  return (
    <main className="bg-black text-white">
      <SideNav />

      {/* ══ Section 1: Hero - CSS动画背景 ══ */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 动画网格背景 */}
        <div className="absolute inset-0 bg-[#0a0a0f]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          {/* 浮动光球 */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-zinc-300">Real-Time Market Data</span>
          </div>
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
            洞察数字背后的<br/><span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">真相</span>
          </h1>
          <p className="hero-sub text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">专业级财务数据分析，为每一位投资者而生</p>
          <div className="flex gap-4 justify-center flex-wrap mb-10">
            <MagneticButton href="#companies"><span className="hero-cta px-8 py-4 bg-white text-black rounded-full font-medium inline-block hover:bg-zinc-100 transition-colors">开始探索</span></MagneticButton>
            <MagneticButton href="#features"><span className="hero-cta px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/15 rounded-full font-medium inline-block hover:bg-white/10 transition-colors">了解更多</span></MagneticButton>
          </div>
          {/* 搜索 */}
          <div className="w-full max-w-xl mx-auto">
            <div className="flex gap-2">
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="输入股票代码或公司名称..." className="flex-1 px-5 py-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl text-white text-lg placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all" />
              <button onClick={handleSearch} disabled={loading} className="px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors disabled:opacity-50">{loading ? "..." : "搜索"}</button>
            </div>
            {searched && results.length > 0 && (
              <div className="mt-3 bg-zinc-900/95 backdrop-blur border border-zinc-700/50 rounded-xl overflow-hidden text-left shadow-2xl">
                {results.slice(0, 6).map(item => (
                  <Link key={item.symbol} href={`/company/${item.symbol}`} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors border-b border-zinc-800/50 last:border-b-0">
                    <div><span className="font-bold text-blue-400 mr-2">{item.symbol}</span><span className="text-zinc-300">{item.name}</span></div>
                    <span className="text-sm text-zinc-500">{item.exchange}</span>
                  </Link>
                ))}
              </div>
            )}
            {searched && !results.length && !loading && <p className="mt-3 text-white/40 text-sm">未找到匹配的公司</p>}
          </div>
        </div>
      </section>

      {/* ══ Section 2: 公司档案（Chill FM 风格） ══ */}
      <StackedCompanyCards />

      {/* Marquee 信任条 */}
      <Marquee items={["AAPL","MSFT","NVDA","GOOGL","AMZN","TSLA","META","JPM","V","JNJ","BRK.B","UNH"]} speed={30} className="py-5 text-white/15 text-2xl font-bold border-y border-zinc-800/50" />

      {/* ══ Section 3: 功能展示 2x2 ══ */}
      <section id="features" ref={featRef} className="relative py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">核心功能</h2>
          <p className="text-zinc-400 text-center mb-16 text-lg">从数据到洞察，一站式解决</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "实时数据", desc: "覆盖全球 70+ 交易所的 Real-Time 行情，秒级更新", gradient: "from-blue-600 to-cyan-500" },
              { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "AI 分析", desc: "智能驱动的财务洞察与趋势预测，发现隐藏机会", gradient: "from-purple-600 to-pink-500" },
              { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "可视化报告", desc: "交互式图表，让复杂数据讲出清晰的故事", gradient: "from-emerald-600 to-teal-500" },
              { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "全球覆盖", desc: "10,000+ 上市公司深度财务数据，跨市场对比", gradient: "from-orange-600 to-amber-500" },
            ].map(f => (
              <div key={f.title} className="feat-card p-8 rounded-2xl bg-zinc-900/50 backdrop-blur border border-zinc-800/80 hover:border-zinc-600 transition-all duration-300 group hover:bg-zinc-800/50">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Section 4: 数据统计 ══ */}
      <section id="stats" className="relative py-40 min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0f]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">数据说话</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">10,000+</div><div className="text-zinc-400">覆盖公司</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">70+</div><div className="text-zinc-400">全球交易所</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">15+</div><div className="text-zinc-400">年历史数据</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Real-Time</div><div className="text-zinc-400">数据更新</div></div>
          </div>
        </div>
      </section>

      {/* ══ Section 5: CTA ══ */}
      <section id="cta" className="py-32 text-center px-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">准备好更聪明地投资了吗？</h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">从财报到投资决策，只需几秒</p>
          <MagneticButton href="/company/AAPL"><span className="inline-flex px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-zinc-100 transition-colors">免费体验</span></MagneticButton>
        </div>
      </section>

      {/* ══ Section 6: Footer ══ */}
      <footer className="py-12 px-4 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold text-lg">Stock Insight</div>
          <p className="text-zinc-500 text-sm">&copy; 2026 Stock Insight &middot; 专业级财务分析平台</p>
          <a href="https://github.com/crowblues/stock-insight" target="_blank" rel="noopener" className="text-zinc-500 hover:text-white transition-colors text-sm">GitHub ↗</a>
        </div>
      </footer>
    </main>
  );
}