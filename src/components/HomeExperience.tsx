"use client";

import RecordGallery3D from "@/components/RecordGallery3D";
import { useState } from "react";

type HomeExperienceProps = {
  initialEntered?: boolean;
};

export default function HomeExperience({ initialEntered = false }: HomeExperienceProps) {
  const [hasEntered, setHasEntered] = useState(initialEntered);

  if (hasEntered) {
    return (
      <main className="h-screen overflow-hidden bg-cp-bg text-cp-ink">
        <RecordGallery3D
          onBackToStart={() => {
            window.history.replaceState(null, "", "/");
            setHasEntered(false);
          }}
        />
      </main>
    );
  }

  const handleEnter = () => setHasEntered(true);

  return (
    <main className="min-h-screen w-full overflow-hidden bg-cp-bg text-cp-ink relative cp-paper-texture">
      {/* 装饰几何（左上） */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-cp-pink/15 blur-3xl" />
      <div className="pointer-events-none absolute left-12 top-32 h-3 w-3 rotate-45 bg-cp-yellow" />
      <div className="pointer-events-none absolute left-44 top-56 h-2 w-2 rounded-full bg-cp-blue" />
      <div className="pointer-events-none absolute left-8 top-1/2 h-px w-32 bg-cp-line-strong" />

      {/* 装饰几何（右下） */}
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-[480px] w-[480px] rounded-full bg-cp-blue/15 blur-3xl" />
      <div className="pointer-events-none absolute right-20 bottom-44 h-1 w-24 -rotate-12 bg-cp-purple" />
      <div className="pointer-events-none absolute right-44 top-1/3 h-4 w-4 rounded-full border-2 border-cp-pink" />

      {/* 顶部条 */}
      <header className="relative z-10 flex items-center justify-between px-8 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-cp-ink-soft">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-cp-pink" />
          STOCK INSIGHT — FINANCIAL ANALYSIS MAG
        </span>
        <span>VOL.84 / 2026 JUN / ¥0</span>
      </header>

      {/* 主内容 */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-[1280px] flex-col items-center justify-center px-8 pt-8 pb-16">
        <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-cp-ink-soft">
          <div className="h-px w-12 bg-cp-line-strong" />
          <span>CITY POP × FINANCE</span>
          <span className="rounded-sm bg-cp-yellow/40 px-2 py-0.5 text-cp-ink">33⅓ RPM</span>
          <div className="h-px w-12 bg-cp-line-strong" />
        </div>

        <h1 className="text-center font-bold tracking-tight text-cp-ink leading-[0.9]">
          <span className="block text-[clamp(3rem,8vw,6.5rem)]">
            ストック·<span className="text-cp-pink">インサイト</span>
          </span>
          <span className="mt-3 block font-mono text-[clamp(0.8rem,1.4vw,1.1rem)] uppercase tracking-[0.5em] text-cp-ink-soft">
            S T O C K &nbsp; I N S I G H T
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-center text-base leading-relaxed text-cp-ink-soft md:text-lg">
          像挑选唱片一样，浏览全球公司的财务报告。
          <br />
          每一家公司，都是一张值得收藏的封面。
        </p>

        <div className="mt-12 grid w-full max-w-3xl grid-cols-3 gap-4 md:gap-8">
          <FeatureBadge num="A1" label="美股财报" desc="12 家精选" tint="pink" />
          <FeatureBadge num="A2" label="可视图表" desc="ECharts 驱动" tint="blue" />
          <FeatureBadge num="B1" label="3D 卡片" desc="像翻黑胶" tint="yellow" />
        </div>

        <div className="mt-14 flex items-center gap-6">
          <button
            type="button"
            onClick={handleEnter}
            className="group relative flex items-center gap-3 rounded-full bg-cp-ink px-8 py-4 font-mono text-sm font-semibold uppercase tracking-[0.2em] text-cp-bg shadow-[0_8px_24px_rgba(45,42,38,0.18)] transition hover:-translate-y-0.5 hover:bg-cp-pink hover:shadow-[0_12px_32px_rgba(232,120,138,0.35)]"
          >
            <span>BROWSE THE COLLECTION</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
          <span className="hidden font-mono text-xs uppercase tracking-[0.25em] text-cp-ink-soft md:inline">
            CLICK TO ENTER
          </span>
        </div>

        <div className="mt-16 flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-cp-ink-soft">
          <span>SIDE A · OVERVIEW</span>
          <span className="h-px w-8 bg-cp-line-strong" />
          <span>SIDE B · DETAILS</span>
        </div>
      </section>

      <footer className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t border-cp-line px-8 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-cp-ink-soft">
        <span>EST. 2026</span>
        <div className="flex items-center gap-4">
          <span className="h-2 w-2 rounded-full bg-cp-up" />
          <span>MARKET OPEN</span>
          <span className="h-px w-12 bg-cp-line-strong" />
          <span>NYC · TOKYO · BERLIN</span>
        </div>
        <span>★ ★ ★</span>
      </footer>
    </main>
  );
}

function FeatureBadge({
  num,
  label,
  desc,
  tint,
}: {
  num: string;
  label: string;
  desc: string;
  tint: "pink" | "blue" | "yellow";
}) {
  const tintClass = {
    pink: "bg-cp-pink/15 border-cp-pink/40",
    blue: "bg-cp-blue/15 border-cp-blue/40",
    yellow: "bg-cp-yellow/20 border-cp-yellow/50",
  }[tint];

  return (
    <div className={`relative flex flex-col items-start gap-1 rounded-2xl border ${tintClass} px-5 py-4 backdrop-blur-sm`}>
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-cp-ink-soft">
        TRACK {num}
      </span>
      <span className="text-base font-bold text-cp-ink">{label}</span>
      <span className="text-xs text-cp-ink-soft">{desc}</span>
    </div>
  );
}
