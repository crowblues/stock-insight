/**
 * 首页 — 全面视觉重塑 (007)
 * 
 * 融合: Wealth_Video_Hero(视频+glassmorphic pill) + Dark_Portfolio_Hero(GSAP blur-in)
 *       + Weblex(rAF视频循环) + FluxSim(pin步骤) + TrustMarquee(信任条)
 * 
 * 结构: Hero(视频) → Trust Marquee → Company Carousel → PinnedCards → Stats(视频) → CTA → Footer
 */
"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Link from "next/link";
import Image from "next/image";
import VideoBackground from "@/components/VideoBackground";
import CompanyCarousel from "@/components/CompanyCarousel";
import PinnedCards from "@/components/animations/PinnedCards";
import Marquee from "@/components/Marquee";

const VIDEO_HERO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260207_050933_33e2620d-09cd-43a2-80ef-4cdbb42f4194.mp4";
const VIDEO_MID = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4";

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // GSAP 入场动画 (融合 Dark_Portfolio_Hero 的 blur-in + name-reveal)
  useGSAP(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-badge", { opacity: 0, y: 20, filter: "blur(10px)", duration: 0.8, delay: 0.3 })
      .from(".hero-title", { opacity: 0, y: 50, duration: 1.2 }, "-=0.4")
      .from(".hero-sub", { opacity: 0, y: 20, filter: "blur(8px)", duration: 0.8 }, "-=0.6")
      .from(".hero-cta", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, "-=0.4")
      .from(".hero-search", { opacity: 0, y: 15, duration: 0.8 }, "-=0.3");
  }, { scope: heroRef });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try { const r = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`); setResults(await r.json()); }
    catch { setResults([]); } finally { setLoading(false); }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

  return (
    <main className="bg-black text-white">
      {/* ═══════ HERO — 全屏视频 + Glassmorphic Badge + GSAP blur-in ═══════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        <VideoBackground src={VIDEO_HERO} />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Glassmorphic pill badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-zinc-300">Real-Time Market Data</span>
          </div>
          {/* 主标题 */}
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
            See Beyond<br />the Numbers
          </h1>
          <p className="hero-sub text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
            Professional-grade financial analytics for every investor. Complex data, simplified.
          </p>
          {/* CTA 按钮 */}
          <div className="flex gap-4 justify-center mb-12">
            <a href="#search" className="hero-cta px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform">Start Exploring</a>
            <a href="#features" className="hero-cta px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-medium hover:bg-white/20 transition-colors">Learn More</a>
          </div>
          {/* 搜索框 */}
          <div id="search" className="hero-search w-full max-w-xl mx-auto">
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

      {/* ═══════ TRUST MARQUEE ═══════ */}
      <section className="py-8 bg-zinc-950 border-y border-zinc-800/50">
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400 uppercase tracking-widest">Trusted by investors worldwide</span>
        </div>
        <Marquee items={["AAPL","MSFT","NVDA","GOOGL","AMZN","TSLA","META","JPM","V","JNJ"]} speed={30} className="text-white/20 text-2xl font-bold" />
      </section>

      {/* ═══════ COMPANY CAROUSEL (Swiper Coverflow 3D) ═══════ */}
      <div id="features">
        <CompanyCarousel />
      </div>

      {/* ═══════ PINNED CARDS — 功能展示 ═══════ */}
      <PinnedCards />

      {/* ═══════ STATS — 视频背景 + 数据 ═══════ */}
      <section className="relative py-40 min-h-[80vh] flex items-center">
        <VideoBackground src={VIDEO_MID} />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">The Numbers Speak</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div><div className="text-zinc-400">Companies</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2">70+</div><div className="text-zinc-400">Exchanges</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2">15+</div><div className="text-zinc-400">Years of Data</div></div>
            <div><div className="text-4xl md:text-5xl font-bold mb-2">Real-time</div><div className="text-zinc-400">Updates</div></div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-32 text-center px-4 bg-black">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to invest smarter?</h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">From balance sheet to investment thesis in seconds.</p>
        <Link href="/company/AAPL" className="inline-flex px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:scale-105 transition-transform">Try It Free</Link>
      </section>

      {/* ═══════ FOOTER ═══════ */}
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
