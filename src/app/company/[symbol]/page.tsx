import Link from "next/link";
import { getCompanyProfile, getIncomeStatement, getKeyMetrics } from "@/lib/fmp";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/format";
import RevenueChart from "@/components/charts/RevenueChart";
import MarginChart from "@/components/charts/MarginChart";
import EPSChart from "@/components/charts/EPSChart";
import ReportStage from "@/components/ReportStage";

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
            href="/?view=cards"
            className="mt-6 inline-flex rounded-[5px] bg-[#4b4d45] px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#30332d]"
          >
            Back to stack
          </Link>
        </section>
      </main>
    );
  }

  const latestMetrics = metricsData[0] || null;
  const peRatio = latestMetrics?.earningsYield ? 1 / latestMetrics.earningsYield : null;
  const latestIncome = incomeData[0] || null;

  return (
    <ReportStage>
        <article
          data-lenis-prevent
          className="report-panel relative z-10 h-[min(72vh,590px)] w-[min(760px,86vw)] overscroll-contain overflow-y-auto border border-white/70 bg-white shadow-[0_30px_80px_rgba(28,31,24,0.32)]"
        >
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
    </ReportStage>
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
