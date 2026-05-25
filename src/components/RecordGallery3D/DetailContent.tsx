"use client";

import type { WheelEvent as ReactWheelEvent, TouchEvent as ReactTouchEvent } from "react";
import EPSChart from "@/components/charts/EPSChart";
import MarginChart from "@/components/charts/MarginChart";
import RevenueChart from "@/components/charts/RevenueChart";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/format";
import type { RecordCard, CompanyDetailPayload } from "./types";

export function InlineDetailContent({
  card, detail, profile, heavyReady, headerHeight, totalHeight,
  onClose, onWheel, onTouchStart, onTouchMove,
}: {
  card: RecordCard;
  detail: CompanyDetailPayload;
  profile: CompanyDetailPayload["profile"];
  heavyReady: boolean;
  headerHeight: number;
  totalHeight: number;
  onClose: () => void;
  onWheel: (e: ReactWheelEvent<HTMLDivElement>) => void;
  onTouchStart: (e: ReactTouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: ReactTouchEvent<HTMLDivElement>) => void;
}) {
  const latestMetrics = detail.latestMetrics;
  const latestIncome = detail.latestIncome;
  const incomeData = detail.incomeData ?? [];

  return (
    <div
      className="relative z-20 -mt-[1px] overflow-hidden border border-[#d7d8cd] bg-[#f8f7f2] text-[#20231d]"
      style={{
        flex: "1 1 0",
        minHeight: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        boxShadow: "0 24px 70px rgba(36,39,30,0.24), 0 1px 0 rgba(255,255,255,0.7) inset",
      }}
    >
      <div
        data-detail-scroll
        data-lenis-prevent
        className="relative z-20 h-full touch-pan-y overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch", transform: "translateZ(0)" }}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        <header className="px-5 pb-5 pt-6 text-center sm:px-8 sm:pt-7">
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#62645d]">
            <span>Stock Insight Archive</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[5px] bg-[#57584f] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_8px_16px_rgba(0,0,0,0.16)] transition hover:bg-[#34362f]"
            >
              Back
            </button>
          </div>
          <div className="relative mx-auto flex h-32 w-full max-w-[420px] items-center justify-center overflow-hidden bg-[#090a0a] shadow-[0_18px_42px_rgba(0,0,0,0.24)] sm:h-40">
            <div className="absolute h-full w-full max-w-[420px] bg-[radial-gradient(circle_at_68%_40%,rgba(255,255,255,0.22),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0)_42%),linear-gradient(90deg,#070909,#171a18)]" />
            {profile?.image && (
              <img src={profile.image} alt="" className="relative z-10 h-14 w-14 rounded-[6px] bg-white object-contain p-2 shadow-[0_14px_36px_rgba(0,0,0,0.28)] sm:h-16 sm:w-16" />
            )}
            <div className="relative z-10 ml-4 text-left sm:ml-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45 sm:text-[11px]">{profile?.symbol ?? card.symbol}</p>
              <p className="mt-1.5 max-w-[220px] text-lg font-semibold leading-tight text-white sm:mt-2 sm:max-w-[260px] sm:text-xl">{profile?.companyName ?? card.sub}</p>
            </div>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[#9c9f74] sm:mt-5">
            {profile?.sector || "Company Research"} / {profile?.industry || "Analysis"}
          </p>
          <h1 className="mx-auto mt-2 max-w-[620px] text-[clamp(1.4rem,3.2vw,2.9rem)] font-bold leading-[0.98] text-[#7d8178]">
            {profile?.companyName ?? card.sub}
          </h1>
          <p className="mx-auto mt-3 max-w-[560px] text-xs leading-5 text-[#5b5e57] sm:text-sm sm:leading-6">
            {profile?.description || card.desc}
          </p>
        </header>
        <section className="grid grid-cols-2 gap-2 px-5 pb-6 sm:gap-3 sm:px-8 sm:pb-8 md:grid-cols-4">
          <MetricCard label="Price" value={profile?.price ? `$${profile.price}` : "Loading"} />
          <MetricCard label="Change" value={profile?.change !== undefined ? `${profile.change >= 0 ? "+" : ""}${profile.change.toFixed(2)}%` : card.change} tone={(profile?.change ?? 0) >= 0 ? "up" : "down"} />
          <MetricCard label="Market Cap" value={profile?.marketCap ? formatCurrency(profile.marketCap) : "Loading"} />
          <MetricCard label="P/E" value={detail.peRatio ? detail.peRatio.toFixed(1) : "N/A"} />
          <MetricCard label="ROE" value={latestMetrics ? formatPercent(latestMetrics.returnOnEquity) : "N/A"} />
          <MetricCard label="ROA" value={latestMetrics ? formatPercent(latestMetrics.returnOnAssets) : "N/A"} />
          <MetricCard label="EV/EBITDA" value={latestMetrics ? formatMultiple(latestMetrics.evToEBITDA) : "N/A"} />
          <MetricCard label="Revenue" value={latestIncome ? formatCurrency(latestIncome.revenue) : "N/A"} />
        </section>
        <section className="space-y-4 px-5 pb-6 sm:px-8 sm:pb-8">
          {heavyReady && incomeData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <RevenueChart data={incomeData} />
                <MarginChart data={incomeData} />
              </div>
              <EPSChart data={incomeData} />
            </>
          ) : (
            <FinancialChartPlaceholder />
          )}
        </section>
      </div>
    </div>
  );
}

function FinancialChartPlaceholder() {
  return (
    <div className="border border-[#dcddd2] bg-[#f8f7f2] px-5 py-5 text-[#3e4239]">
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#898b82]">
        <span>Financial modules</span>
        <span>Loading data</span>
      </div>
      <div className="grid grid-cols-6 items-end gap-2 border border-[#e0dfd5] bg-[#fdfcf7] p-4">
        {[34, 52, 45, 68, 61, 78].map((height, index) => (
          <div key={index} className="flex h-28 items-end border-l border-[#ece9de] pl-1">
            <div className="w-full bg-[#69715e]" style={{ height: `${height}%`, opacity: 0.52 + index * 0.055 }} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#98998e]">
        Revenue / margin / EPS charts will appear here when data is available
      </p>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" }) {
  const toneClass = tone === "up" ? "text-[#267c4a]" : tone === "down" ? "text-[#bd3850]" : "text-[#1f221d]";
  return (
    <div className="rounded-[4px] border border-[#dcddd2] bg-[#f8f7f2] px-3 py-2.5">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#898b82]">{label}</div>
      <div className={`mt-1 truncate text-sm font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}
