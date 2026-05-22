"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Link from "next/link";
import Image from "next/image";
import VideoBackground from "@/components/VideoBackground";
import MagneticButton from "@/components/MagneticButton";
import SideNav from "@/components/SideNav";
import Marquee from "@/components/Marquee";
import StackedCompanyCards from "@/components/StackedCompanyCards";

const VIDEO_HERO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260207_050933_33e2620d-09cd-43a2-80ef-4cdbb42f4194.mp4";
const VIDEO_MID = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4";


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

      {/* ══ Section 1: Hero ══ */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        <VideoBackground src={VIDEO_HERO} />
        {/* 网格线装饰 */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
        {/* 浮动小视频窗口装饰 */}
        <div className="absolute bottom-24 right-8 w-48 h-28 rounded-xl overflow-hidden border border-white/10 shadow-2xl hidden lg:block opacity-70">
          <video autoPlay muted loop playsInline preload="none" className="w-full h-full object-cover">
            <source src={VIDEO_MID} type="video/mp4" />
          </video>
        </div>
        {/* 滚动指示器 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-xs text-zinc-500 uppercase tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-zinc-700 relative overflow-hidden"><div className="w-full h-3 bg-white/60 animate-bounce" /></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-zinc-300">Real-Time 市场数据</span>
          </div>
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">洞察数字背后的<br/>真相</h1>
          <p className="hero-sub text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10">专业级财务数据分析，为每一位投资者而生</p>
          <div className="flex gap-4 justify-center flex-wrap mb-10">
            <MagneticButton href="#companies"><span className="hero-cta px-8 py-4 bg-white text-black rounded-full font-medium inline-block">开始探索</span></MagneticButton>
            <MagneticButton href="#features"><span className="hero-cta px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-medium inline-block">了解更多</span></MagneticButton>
          </div>
          {/* 搜索 */}
          <div className="w-full max-w-xl mx-auto">
            <div className="flex gap-2">
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="输入股票代码或公司名称..." className="flex-1 px-5 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white text-lg placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors" />
              <button onClick={handleSearch} disabled={loading} className="px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors">{loading ? "..." : "搜索"}</button>
            </div>
            {searched && results.length > 0 && (
              <div className="mt-3 bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-xl overflow-hidden text-left">
                {results.slice(0, 6).map(item => (
                  <Link key={item.symbol} href={`/company/${item.symbol}`} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors border-b border-zinc-800 last:border-b-0">
                    <div><span className="font-bold text-blue-400 mr-2">{item.symbol}</span><span className="text-zinc-300">{item.name}</span></div>
                    <span className="text-sm text-zinc-500">{item.exchange}</span>
                  </Link>
                ))}
              </div>
            )}
            {searched && !results.length && !loading && <p className="mt-3 text-white/50">未找到匹配的公司</p>}
          </div>
        </div>
      </section>

      {/* ══ Section 2: 3D 堆叠卡片 ══ */}
      <section id="companies" className="relative py-32 px-4 overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">翻阅全球巨头</h2>
            <p className="text-zinc-400 text-lg">像挑选唱片一样，发现下一个投资机会</p>
          </div>
          <StackedCompanyCards />
        </div>
      </section>

      {/* Marquee 信任条 */}
      <Marquee items={["AAPL","MSFT","NVDA","GOOGL","AMZN","TSLA","META","JPM","V","JNJ","BRK.B","UNH"]} speed={30} className="py-5 text-white/15 text-2xl font-bold border-y border-zinc-800/50" />

      {/* ══ Section 3: 功能展示 2x2 ══ */}
      <section id="features" ref={featRef} className="relative py-32 px-4 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">核心功能</h2>
          <p className="text-zinc-400 text-center mb-16 text-lg">从数据到洞察，一站式解决</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "📊", title: "实时数据", desc: "覆盖全球 70+ 交易所的 Real-Time 行情，秒级更新", gradient: "from-blue-600 to-cyan-500" },
              { icon: "🤖", title: "AI 分析", desc: "智能驱动的财务洞察与趋势预测，发现隐藏机会", gradient: "from-purple-600 to-pink-500" },
              { icon: "📈", title: "可视化报告", desc: "交互式图表，让复杂数据讲出清晰的故事", gradient: "from-emerald-600 to-teal-500" },
              { icon: "🌍", title: "全球覆盖", desc: "10,000+ 上市公司深度财务数据，跨市场对比", gradient: "from-orange-600 to-amber-500" },
            ].map(f => (
              <div key={f.title} className="feat-card p-8 rounded-2xl bg-zinc-900/50 backdrop-blur border border-zinc-800 hover:border-zinc-600 transition-colors group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-5`}>{f.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Section 4: 数据统计 + 视频 ══ */}
      <section id="stats" className="relative py-40 min-h-[80vh] flex items-center">
        <VideoBackground src={VIDEO_MID} />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">数据说话</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div><div className="text-zinc-400">覆盖公司</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2">70+</div><div className="text-zinc-400">全球交易所</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2">15+</div><div className="text-zinc-400">年历史数据</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2">Real-Time</div><div className="text-zinc-400">数据更新</div></div>
          </div>
        </div>
      </section>

      {/* ══ Section 5: CTA ══ */}
      <section id="cta" className="relative py-32 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">准备好更聪明地投资了吗？</h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">从财报到投资决策，只需几秒</p>
          <MagneticButton href="/company/AAPL"><span className="inline-flex px-10 py-5 bg-white text-black rounded-full font-medium text-lg">免费体验</span></MagneticButton>
        </div>
      </section>

      {/* ══ Section 6: Footer ══ */}
      <footer className="py-12 px-4 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold text-lg">Stock Insight</div>
          <p className="text-zinc-500 text-sm">© 2026 Stock Insight · 专业级财务分析平台</p>
          <a href="https://github.com/crowblues/stock-insight" target="_blank" rel="noopener" className="text-zinc-500 hover:text-white transition-colors text-sm">GitHub ↗</a>
        </div>
      </footer>
    </main>
  );
}
