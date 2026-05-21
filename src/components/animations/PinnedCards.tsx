"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const features = [
  { title: "Real-Time Data", description: "Live financial data from 70+ global exchanges", icon: "📊", gradient: "from-blue-600 to-cyan-500" },
  { title: "AI Analysis", description: "Machine learning powered insights and predictions", icon: "🤖", gradient: "from-purple-600 to-pink-500" },
  { title: "Visual Reports", description: "Interactive charts that tell the story behind numbers", icon: "📈", gradient: "from-emerald-600 to-teal-500" },
  { title: "Global Coverage", description: "10,000+ companies across all major markets", icon: "🌍", gradient: "from-orange-600 to-amber-500" },
];

export default function PinnedCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;
    const cards = cardRefs.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${cards.length * 400}`,
        pin: true,
        scrub: 1,
      },
    });

    cards.forEach((card, i) => {
      tl.fromTo(card,
        { y: 200 + i * 50, x: (i % 2 === 0 ? -1 : 1) * (150 + i * 30), rotation: (i % 2 === 0 ? -1 : 1) * 15, opacity: 0, scale: 0.7 },
        { y: 0, x: 0, rotation: (i - 1.5) * 5, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
        i * 0.3
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="relative w-full max-w-5xl h-[400px] flex items-center justify-center">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            ref={(el) => { if (el) cardRefs.current[i] = el; }}
            className="absolute w-[280px] p-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-2xl"
            style={{ zIndex: i }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
