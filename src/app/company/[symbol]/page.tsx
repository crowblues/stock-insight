import Link from "next/link";
import { getCompanyProfile, getIncomeStatement, getKeyMetrics } from "@/lib/fmp";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/format";
import RevenueChart from "@/components/charts/RevenueChart";
import MarginChart from "@/components/charts/MarginChart";
import EPSChart from "@/components/charts/EPSChart";

interface CompanyPageProps {
  params: Promise<{ symbol: string }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { symbol } = await params;

  const [profile, incomeData, metricsData] = await Promise.all([
    getCompanyProfile(symbol),
    getIncomeStatement(symbol),
    getKeyMetrics(symbol),
  ]);

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2e9] px-4">
        <section className="w-full max-w-md bg-white p-8 text-center shadow-[0_24px_70px_rgba(36,41,29,0.16)]">
          <h1 className="text-2xl font-bold text-[#20231d]">没有找到公司数据</h1>
          <p className="mt-3 text-sm text-[#6b6d65]">无法获取 {symbol.toUpperCase()} 的数据，请检查股票代码。</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-[5px] bg-[#4b4d45] px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#30332d]"
          >
            Back to start
          </Link>
        </section>
      </main>
    );
  }

  const latestMetrics = metricsData[0] || null;
  const peRatio = latestMetrics?.earningsYield ? 1 / latestMetrics.earningsYield : null;
  const latestIncome = incomeData[0] || null;

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-[#20231d]"
      style={{
        background:
          "linear-gradient(90deg, #c9dcb2 0%, #eef1dc 16%, #f5f3ed 50%, #e8f0cf 84%, #b7d392 100%)",
      }}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[18vw] min-w-40 bg-[linear-gradient(135deg,rgba(211,235,137,0.5),rgba(225,76,91,0.2)_48%,rgba(55,99,79,0.25))]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[18vw] min-w-40 bg-[linear-gradient(225deg,rgba(54,114,59,0.5),rgba(176,211,120,0.34)_50%,rgba(239,161,173,0.22))]" />

      <Link
        href="/"
        className="absolute left-[max(24px,calc((100vw-1320px)/2+20px))] top-8 z-30 rounded-[5px] bg-[#57584f] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_18px_rgba(0,0,0,0.22)] transition hover:bg-[#34362f]"
      >
        Back to start
      </Link>

      <div className="relative flex min-h-[760px] w-full max-w-[1320px] items-center justify-center bg-[#f3f1ea] shadow-[0_24px_80px_rgba(42,56,31,0.18)]">
        <div className="pointer-events-none absolute left-1/2 top-[11%] h-8 w-[260px] -translate-x-1/2 rounded-[6px] bg-[#090b0b] opacity-90 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />
        <div className="pointer-events-none absolute left-1/2 top-[15%] h-8 w-[340px] -translate-x-1/2 rounded-[6px] bg-[#111313] opacity-85 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />
        <div className="pointer-events-none absolute bottom-[11%] left-1/2 h-8 w-[360px] -translate-x-1/2 rounded-[6px] bg-[#111313] opacity-90 shadow-[0_10px_26px_rgba(0,0,0,0.18)]" />

        <article className="relative z-10 h-[min(72vh,590px)] w-[min(760px,86vw)] overflow-y-auto bg-white shadow-[0_26px_68px_rgba(28,31,24,0.28)]">
          <header className="px-8 pb-6 pt-7 text-center">
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#62645d]">
              <span>Stock Insight Archive</span>
              <span>{profile.exchange}</span>
            </div>

            <div className="relative mx-auto flex h-48 w-full max-w-[470px] items-center justify-center overflow-hidden bg-[#090a0a] shadow-[0_18px_42px_rgba(0,0,0,0.24)]">
              <div className="absolute h-48 w-full max-w-[470px] bg-[radial-gradient(circle_at_68%_40%,rgba(255,255,255,0.22),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0)_42%),linear-gradient(90deg,#070909,#171a18)]" />
              {profile.image && (
                <img
                  src={profile.image}
                  alt={`${profile.companyName} logo`}
                  className="relative z-10 h-20 w-20 rounded-[6px] bg-white object-contain p-2 shadow-[0_14px_36px_rgba(0,0,0,0.28)]"
                />
              )}
              <div className="relative z-10 ml-5 text-left">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">{profile.symbol}</p>
                <p className="mt-2 max-w-[260px] text-xl font-semibold leading-tight text-white">{profile.companyName}</p>
              </div>
            </div>

            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.28em] text-[#9c9f74]">
              {profile.sector || "Company"} / {profile.industry || "Analysis"}
            </p>
            <h1 className="mx-auto mt-2 max-w-[620px] text-[clamp(2.1rem,4vw,3.45rem)] font-bold leading-[0.98] text-[#7d8178]">
              {profile.companyName}
            </h1>
            <p className="mx-auto mt-4 max-w-[560px] text-sm leading-6 text-[#5b5e57]">
              {profile.description ? `${profile.description.slice(0, 180)}${profile.description.length > 180 ? "..." : ""}` : "A compact company report with valuation, profitability, and trend signals."}
            </p>
          </header>

          <section className="grid grid-cols-2 gap-3 px-8 md:grid-cols-4">
            <MetricCard label="Price" value={`$${profile.price}`} />
            <MetricCard label="Change" value={`${profile.change >= 0 ? "+" : ""}${profile.change.toFixed(2)}%`} tone={profile.change >= 0 ? "up" : "down"} />
            <MetricCard label="Market Cap" value={formatCurrency(profile.marketCap)} />
            <MetricCard label="P/E" value={peRatio ? peRatio.toFixed(1) : "N/A"} />
            <MetricCard label="ROE" value={latestMetrics ? formatPercent(latestMetrics.returnOnEquity) : "N/A"} />
            <MetricCard label="ROA" value={latestMetrics ? formatPercent(latestMetrics.returnOnAssets) : "N/A"} />
            <MetricCard label="EV/EBITDA" value={latestMetrics ? formatMultiple(latestMetrics.evToEBITDA) : "N/A"} />
            <MetricCard label="Revenue" value={latestIncome ? formatCurrency(latestIncome.revenue) : "N/A"} />
          </section>

          {incomeData.length > 0 && (
            <section className="mt-6 space-y-4 px-8 pb-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <RevenueChart data={incomeData} />
                <MarginChart data={incomeData} />
              </div>
              <EPSChart data={incomeData} />
            </section>
          )}
        </article>
      </div>
    </main>
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
