/**
 * 首页 — 任务006视觉优化
 * 
 * Hero(LazyVimeo) → Marquee → CompanyCarousel(Swiper 3D) → PinnedCards → 视频统计 → Footer
 */
"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Link from "next/link";
import LazyVimeo from "@/components/LazyVimeo";
import CompanyCarousel from "@/components/CompanyCarousel";
import PinnedCards from "@/components/animations/PinnedCards";
import Marquee from "@/components/Marquee";

interface SearchResult {
  symbol: string;
  name: string;
  currency: string;
  exchangeFullName: string;
  exchange: string;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Hero 入场动画
  useGSAP(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline();
    tl.from(".hero-title", { opacity: 0, y: 40, duration: 1, ease: "power3.out" })
      .from(".hero-sub", { opacity: 0, y: 30, duration: 0.8 }, "-=0.5")
      .from(".hero-search", { opacity: 0, y: 20, duration: 0.8, ease: "back.out(1.2)" }, "-=0.4");
  }, { scope: heroRef });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try { const r = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`); setResults(await r.json()); }
    catch { setResults([]); } finally { setLoading(false); }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

  return (
    <main className="bg-black">
      {/* 1. Hero - 全屏视频背景 */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <LazyVimeo videoId="1089995529" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="hero-title text-5xl md:text-7xl font-bold text-white mb-6">See Beyond the Numbers</h1>
          <p className="hero-sub text-xl text-zinc-300 mb-10">Professional-grade financial analytics for every investor.<br className="hidden md:block" /> Real-time data. Visual insights. Zero complexity.</p>
          <div className="hero-search w-full max-w-xl mx-auto">
            <div className="flex gap-2">
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Search by ticker or company name..." className="flex-1 px-5 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white text-lg placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors" />
              <button onClick={handleSearch} disabled={loading} className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-500 transition-colors">{loading ? "..." : "Search"}</button>
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
            {searched && !results.length && !loading && <p className="mt-3 text-white/50">No results found</p>}
          </div>
        </div>
      </section>

      {/* 2. Marquee */}
      <Marquee items={["AAPL","MSFT","NVDA","GOOGL","AMZN","TSLA","META","NFLX","AMD","CRM"]} speed={25} className="py-5 bg-zinc-900 text-white/20 text-xl font-bold border-y border-zinc-800" />

      {/* 3. Company Carousel - Swiper 3D */}
      <CompanyCarousel />

      {/* 4. PinnedCards - GSAP 扇形展开 */}
      <PinnedCards />

      {/* 5. 视频 + 数据统计 */}
      <section className="relative py-32 overflow-hidden">
        <LazyVimeo videoId="1090081012" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          <div><div className="text-4xl font-bold text-white">10,000+</div><div className="text-zinc-400 mt-2">Companies</div></div>
          <div><div className="text-4xl font-bold text-white">70+</div><div className="text-zinc-400 mt-2">Exchanges</div></div>
          <div><div className="text-4xl font-bold text-white">15+</div><div className="text-zinc-400 mt-2">Years of Data</div></div>
          <div><div className="text-4xl font-bold text-white">Real-time</div><div className="text-zinc-400 mt-2">Updates</div></div>
        </div>
      </section>

      {/* 6. Marquee 2 */}
      <Marquee items={["Financial Analytics","Data Visualization","Global Markets","Real-time Updates","Investment Research"]} speed={30} className="py-4 bg-black text-white/10 text-2xl font-bold" />

      {/* 7. Footer */}
      <footer className="py-16 px-4 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Stock Insight</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Professional-grade financial analytics.<br/>Free for every investor.</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Features</h3>
            <ul className="text-zinc-500 text-sm space-y-2"><li>Company Search</li><li>Financial Statements</li><li>Trend Charts</li><li>Key Metrics</li></ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-3">About</h3>
            <p className="text-zinc-500 text-sm italic">&ldquo;From overwhelming to effortless&rdquo;</p>
            <p className="text-zinc-600 text-xs mt-4">© 2026 Stock Insight</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
