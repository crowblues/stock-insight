/**
 * 热门公司卡片组件（大图卡片 + Stagger 动画）
 * 
 * Brand Appart 风格：大图铺满，暗色渐变遮罩，文字在底部，
 * hover 时图片微微放大（scale 1.05）。
 */
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Link from "next/link";

const HOT_COMPANIES = [
  {
    symbol: "AAPL",
    name: "苹果公司",
    nameEn: "Apple Inc.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
  },
  {
    symbol: "MSFT",
    name: "微软",
    nameEn: "Microsoft Corp.",
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=600&q=80",
  },
  {
    symbol: "GOOGL",
    name: "谷歌",
    nameEn: "Alphabet Inc.",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80",
  },
  {
    symbol: "AMZN",
    name: "亚马逊",
    nameEn: "Amazon.com",
    image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&q=80",
  },
  {
    symbol: "TSLA",
    name: "特斯拉",
    nameEn: "Tesla Inc.",
    image: "https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=600&q=80",
  },
  {
    symbol: "NVDA",
    name: "英伟达",
    nameEn: "NVIDIA Corp.",
    image: "https://images.unsplash.com/photo-1625535163131-5fe4a7960771?w=600&q=80",
  },
];

export default function CompanyCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".company-card");

    gsap.from(cards, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 80,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power2.out",
    });
  }, { scope: containerRef });

  return (
    <section className="py-24 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16">
          热门公司
        </h2>
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {HOT_COMPANIES.map((company) => (
            <Link
              key={company.symbol}
              href={`/company/${company.symbol}`}
              className="company-card group relative block h-[320px] rounded-2xl
                         overflow-hidden shadow-lg"
            >
              {/* 背景图 + hover 放大 */}
              <img
                src={company.image}
                alt={company.nameEn}
                className="absolute inset-0 w-full h-full object-cover
                           transition-transform duration-500 group-hover:scale-105"
              />
              {/* 暗色渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* 底部文字 */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-3xl font-bold text-white mb-1">
                  {company.symbol}
                </div>
                <div className="text-white/90 text-sm">{company.name}</div>
                <div className="text-white/60 text-xs mt-1">{company.nameEn}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
