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
      <main className="h-screen overflow-hidden bg-[#0b0b0b] text-white">
        <RecordGallery3D
          onBackToStart={() => {
            window.history.replaceState(null, "", "/");
            setHasEntered(false);
          }}
        />
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-[#0b0b0b] text-white">
      <section
        id="hero"
        className="relative flex h-screen items-center justify-center overflow-hidden px-4 py-8"
        style={{
          background:
            "linear-gradient(90deg, #c9dcb2 0%, #eff3dc 16%, #f6f4e8 50%, #eef4d8 84%, #b6d58f 100%)",
        }}
      >
        <div className="pointer-events-none absolute left-0 top-0 h-full w-[20vw] min-w-44 overflow-hidden">
          <div className="absolute -left-16 bottom-4 h-[72%] w-[120%] rotate-[-10deg] rounded-[45%] bg-[linear-gradient(130deg,rgba(214,232,115,0.78)_0%,rgba(244,239,195,0.86)_36%,rgba(221,65,80,0.56)_67%,rgba(80,104,60,0.34)_100%)] blur-[1px]" />
          <div className="absolute left-12 top-[31%] h-[46%] w-8 rotate-[5deg] rounded-full bg-[#31452d]/70" />
          <div className="absolute -left-3 bottom-20 h-24 w-48 rotate-[12deg] rounded-[50%] bg-[#e34c55]/70" />
        </div>

        <div className="pointer-events-none absolute right-0 top-0 h-full w-[20vw] min-w-44 overflow-hidden">
          <div className="absolute -right-20 top-6 h-[66%] w-[130%] rotate-[16deg] rounded-[45%] bg-[linear-gradient(230deg,rgba(35,94,42,0.82)_0%,rgba(126,178,72,0.66)_44%,rgba(238,238,188,0.72)_72%,rgba(235,143,159,0.48)_100%)] blur-[1px]" />
          <div className="absolute right-16 top-4 h-48 w-16 rotate-[22deg] rounded-full bg-[#4c7d35]/80" />
          <div className="absolute -right-3 bottom-24 h-36 w-28 rotate-[-24deg] rounded-[48%] bg-[#eaa2b2]/60" />
        </div>

        <div className="relative z-10 flex h-[min(76vh,760px)] w-full max-w-[1320px] items-center justify-center bg-[#030613] shadow-[0_26px_70px_rgba(35,44,28,0.26)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_49%,rgba(246,71,102,0.12),transparent_15%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%,rgba(0,0,0,0.18))]" />

          <button
            type="button"
            aria-label="Enter the chill zone"
            onClick={() => setHasEntered(true)}
            className="group relative flex -translate-y-4 flex-col items-center p-8 outline-none focus-visible:ring-2 focus-visible:ring-[#f95372]"
          >
            <div className="relative h-[86px] w-[152px] transform-gpu rounded-[8px] bg-[#f65370] shadow-[0_0_26px_rgba(246,83,112,0.42),0_16px_40px_rgba(0,0,0,0.36)] transition-transform duration-200 ease-out will-change-transform group-hover:-translate-y-2 group-hover:scale-[1.13]">
              <div className="absolute -top-9 left-[82px] h-11 w-px rotate-[-10deg] bg-[#42475b]" />
              <div className="absolute left-5 top-4 h-4 w-[104px] rounded-sm bg-[#080a13]" />
              <div className="absolute left-7 top-[21px] h-0.5 w-16 bg-[#f1b3c0]/80" />
              <div className="absolute right-6 top-[20px] h-1.5 w-1.5 rounded-full bg-[#f1b3c0]" />
              <div className="absolute bottom-5 left-7 grid grid-cols-5 gap-x-3 gap-y-2">
                {Array.from({ length: 15 }).map((_, index) => (
                  <span key={index} className="h-1.5 w-1.5 rounded-full bg-[#8e2033]/72" />
                ))}
              </div>
              <div className="absolute bottom-[22px] right-5 h-7 w-7 rounded-full border border-[#ff9daf] bg-[#e94766] shadow-[inset_0_2px_8px_rgba(255,255,255,0.25)]" />
            </div>

            <span className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.34em] text-[#f65370]/60 transition group-hover:text-[#ff7590]">
              Enter the chill zone
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
