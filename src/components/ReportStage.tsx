"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";

type ReportStageProps = {
  children: ReactNode;
};

export default function ReportStage({ children }: ReportStageProps) {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleBack = () => {
    if (isLeaving) return;

    setIsLeaving(true);
    window.setTimeout(() => {
      router.push("/?view=cards");
    }, 280);
  };

  return (
    <main
      className={`report-stage relative flex min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 text-[#20231d] ${
        isLeaving ? "report-stage-leaving" : ""
      }`}
      style={{
        background:
          "linear-gradient(90deg, #c9dcb2 0%, #eef1dc 16%, #f5f3ed 50%, #e8f0cf 84%, #b7d392 100%)",
      }}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[18vw] min-w-40 bg-[linear-gradient(135deg,rgba(211,235,137,0.5),rgba(225,76,91,0.2)_48%,rgba(55,99,79,0.25))]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[18vw] min-w-40 bg-[linear-gradient(225deg,rgba(54,114,59,0.5),rgba(176,211,120,0.34)_50%,rgba(239,161,173,0.22))]" />

      <button
        type="button"
        onClick={handleBack}
        className="report-back-button absolute left-[max(24px,calc((100vw-1320px)/2+20px))] top-8 z-30 rounded-[5px] bg-[#57584f] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_18px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#34362f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f65370]"
      >
        Back to stack
      </button>

      <div className="report-stage-inner relative flex min-h-[760px] w-full max-w-[1320px] items-center justify-center overflow-hidden bg-[#f3f1ea] shadow-[0_24px_80px_rgba(42,56,31,0.18)]">
        <div className="pointer-events-none absolute left-1/2 top-[10%] h-8 w-[260px] -translate-x-1/2 rounded-[6px] bg-[#090b0b] opacity-90 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />
        <div className="pointer-events-none absolute left-1/2 top-[14%] h-8 w-[340px] -translate-x-1/2 rounded-[6px] bg-[#111313] opacity-85 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />
        <div className="pointer-events-none absolute bottom-[11%] left-1/2 h-8 w-[360px] -translate-x-1/2 rounded-[6px] bg-[#111313] opacity-90 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />

        <div className="report-depth-layer report-depth-layer-a pointer-events-none absolute left-1/2 top-1/2 h-[min(70vh,560px)] w-[min(760px,86vw)] -translate-x-1/2 -translate-y-1/2 rotate-[-1.2deg] bg-[#151813] shadow-[0_30px_70px_rgba(25,30,20,0.18)]" />
        <div className="report-depth-layer report-depth-layer-b pointer-events-none absolute left-1/2 top-1/2 h-[min(70vh,560px)] w-[min(760px,86vw)] -translate-x-1/2 -translate-y-1/2 rotate-[1deg] bg-[#d9dbcf] shadow-[0_26px_62px_rgba(39,45,32,0.16)]" />
        <div className="report-side-rail pointer-events-none absolute left-[calc(50%-450px)] top-1/2 hidden h-[430px] w-3 -translate-y-1/2 bg-[#d86f5b]/70 shadow-[0_14px_34px_rgba(216,111,91,0.26)] lg:block" />
        <div className="report-side-rail pointer-events-none absolute right-[calc(50%-450px)] top-1/2 hidden h-[430px] w-3 -translate-y-1/2 bg-[#586041]/70 shadow-[0_14px_34px_rgba(88,96,65,0.22)] lg:block" />

        {children}
      </div>
    </main>
  );
}
