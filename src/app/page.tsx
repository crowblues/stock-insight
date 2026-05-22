"use client";

import { useRef, Suspense } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import dynamic from "next/dynamic";

const RecordGallery3D = dynamic(() => import("@/components/RecordGallery3D"), { ssr: false });

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-line", { opacity: 0, y: 100, duration: 1.4, stagger: 0.12, delay: 0.4 })
      .from(".hero-sub", { opacity: 0, y: 40, duration: 0.9 }, "-=0.5")
      .from(".hero-badge", { opacity: 0, scale: 0.8, duration: 0.7 }, "-=0.4");
  }, { scope: heroRef });

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">

      {/* ══ Hero - 深色宇宙风 ══ */}
      <section id="hero" ref={heroRef} className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        {/* 宇宙背景动画 */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(49,46,129,0.3) 0%, #0a0a0a 70%)" }} />
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full animate-spin-slow blur-3xl" style={{ background: "conic-gradient(from 0deg, rgba(37,99,235,0.2), rgba(124,58,237,0.1), rgba(49,46,129,0.05), rgba(37,99,235,0.2))" }} />
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full animate-spin-reverse blur-2xl" style={{ background: "conic-gradient(from 180deg, rgba(6,182,212,0.15), transparent, rgba(6,182,212,0.15))" }} />
        </div>

        <div className="relative z-10 px-6 max-w-[900px]">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Live · 10,000+ companies</span>
          </div>

          <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[1.05] tracking-tight">
            <span className="hero-line block">Browse financials</span>
            <span className="hero-line block">like vinyl records.</span>
          </h1>
          <p className="hero-sub text-base md:text-lg text-white/40 mt-8 max-w-lg mx-auto leading-relaxed">
            Enabling fluid interactions with financial data. Our platform empowers investors to act with intent, harnessing clarity, velocity, and insight to outperform tomorrow.
          </p>

          <div className="hero-badge mt-12">
            <a href="#companies" className="inline-flex px-8 py-4 border border-white/20 rounded-full text-sm font-medium text-white/80 hover:bg-white/10 hover:border-white/40 transition-all duration-300">
              Start Browsing
            </a>
          </div>
        </div>

        {/* 底部滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
        </div>
      </section>

      {/* ══ 3D 唱片画廊 ══ */}
      <Suspense fallback={<div className="h-screen bg-[#0a0a0a] flex items-center justify-center"><span className="text-white/20 text-sm font-mono">Loading gallery...</span></div>}>
        <RecordGallery3D />
      </Suspense>

      {/* ══ Footer ══ */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <span className="text-white/20 text-xs font-mono">Stock Insight &copy; 2026</span>
          <a href="https://github.com/crowblues/stock-insight" target="_blank" rel="noopener" className="text-white/20 hover:text-white/60 transition-colors text-xs font-mono">GitHub ↗</a>
        </div>
      </footer>
    </main>
  );
}
