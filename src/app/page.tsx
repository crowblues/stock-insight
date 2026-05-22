"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Link from "next/link";
import SideNav from "@/components/SideNav";
import StackedCompanyCards from "@/components/StackedCompanyCards";

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-line", { opacity: 0, y: 80, duration: 1.2, stagger: 0.15, delay: 0.2 })
      .from(".hero-sub", { opacity: 0, y: 30, duration: 0.8 }, "-=0.5")
      .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3");
  }, { scope: heroRef });

  useGSAP(() => {
    if (!servicesRef.current) return;
    const items = servicesRef.current.querySelectorAll(".service-item");
    items.forEach((item) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: "top 85%", end: "top 50%", scrub: 1 },
        opacity: 0, y: 60, duration: 1,
      });
    });
  }, { scope: servicesRef });

  return (
    <main className="bg-[#F8F7F4] text-[#1a1a1a] min-h-screen">
      <SideNav />

      {/* ══ Hero ══ */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24">
        <div className="max-w-[1200px]">
          <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight">
            <span className="hero-line block">Institutional-grade</span>
            <span className="hero-line block">financial analytics,</span>
            <span className="hero-line block text-[#1a1a1a]/35">distilled.</span>
          </h1>
          <p className="hero-sub text-lg md:text-xl text-[#1a1a1a]/50 mt-8 max-w-xl leading-relaxed">
            We turn complex financial data into clear, actionable insights for modern investors.
          </p>
          <div className="hero-cta mt-12 flex gap-4 items-center">
            <Link href="#companies" className="px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-medium text-sm hover:bg-[#333] transition-colors">
              Explore Companies
            </Link>
            <Link href="#services" className="px-8 py-4 border border-[#1a1a1a]/15 rounded-full font-medium text-sm hover:bg-[#1a1a1a]/5 transition-colors">
              Our Approach
            </Link>
          </div>
        </div>
        <div className="absolute bottom-12 right-12 text-[#1a1a1a]/20 text-sm font-mono hidden lg:block">
          scroll to explore ↓
        </div>
      </section>

      {/* ══ Companies - 唱片挑选 ══ */}
      <StackedCompanyCards />

      {/* ══ Services ══ */}
      <section id="services" ref={servicesRef} className="py-32 px-6 md:px-16 lg:px-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="service-item border-t border-[#1a1a1a]/10 py-16">
            <div className="flex flex-col md:flex-row gap-8">
              <span className="text-[#1a1a1a]/30 font-mono text-sm">(01)</span>
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Real-time financial data across 70+ exchanges.</h3>
                <p className="text-[#1a1a1a]/50 text-lg leading-relaxed max-w-2xl">Second-level market data covering equities, ETFs, and indices. Every metric updated in real-time so you never trade on stale information.</p>
              </div>
            </div>
          </div>
          <div className="service-item border-t border-[#1a1a1a]/10 py-16">
            <div className="flex flex-col md:flex-row gap-8">
              <span className="text-[#1a1a1a]/30 font-mono text-sm">(02)</span>
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">AI-powered analysis that finds what you miss.</h3>
                <p className="text-[#1a1a1a]/50 text-lg leading-relaxed max-w-2xl">Pattern recognition across 15+ years of financial history. Surface hidden correlations, flag anomalies, and generate actionable thesis in seconds.</p>
              </div>
            </div>
          </div>
          <div className="service-item border-t border-[#1a1a1a]/10 py-16">
            <div className="flex flex-col md:flex-row gap-8">
              <span className="text-[#1a1a1a]/30 font-mono text-sm">(03)</span>
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Visual reports that tell the story clearly.</h3>
                <p className="text-[#1a1a1a]/50 text-lg leading-relaxed max-w-2xl">Interactive charts and dashboards designed for decision-making. Complex data distilled into clear narratives you can act on immediately.</p>
              </div>
            </div>
          </div>
          <div className="service-item border-t border-[#1a1a1a]/10 py-16 border-b border-b-[#1a1a1a]/10">
            <div className="flex flex-col md:flex-row gap-8">
              <span className="text-[#1a1a1a]/30 font-mono text-sm">(04)</span>
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">10,000+ companies. One unified platform.</h3>
                <p className="text-[#1a1a1a]/50 text-lg leading-relaxed max-w-2xl">Cross-market comparison at your fingertips. From mega-caps to mid-caps, every company gets the same depth of analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section id="cta" className="py-40 px-6 md:px-16 lg:px-24 text-center">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">Ready to see clearly?</h2>
        <p className="text-[#1a1a1a]/40 text-lg mb-12 max-w-lg mx-auto">From earnings reports to investment decisions, in seconds.</p>
        <Link href="/company/AAPL" className="inline-flex px-10 py-5 bg-[#1a1a1a] text-white rounded-full font-medium text-sm hover:bg-[#333] transition-colors">
          Start Exploring
        </Link>
      </section>

      {/* ══ Footer ══ */}
      <footer className="py-12 px-6 md:px-16 lg:px-24 border-t border-[#1a1a1a]/10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold text-lg">Stock Insight</div>
          <p className="text-[#1a1a1a]/30 text-sm">&copy; 2026 Stock Insight</p>
          <a href="https://github.com/crowblues/stock-insight" target="_blank" rel="noopener" className="text-[#1a1a1a]/30 hover:text-[#1a1a1a] transition-colors text-sm">GitHub ↗</a>
        </div>
      </footer>
    </main>
  );
}
