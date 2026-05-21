/**
 * 公司详情页 — 展示真实财报数据
 * 
 * 路由：/company/AAPL、/company/MSFT 等
 * 这是 Server Component，数据在服务端获取，不需要 "use client"
 * 
 * 页面结构：
 * 1. 顶部：公司名 + Logo + 基本信息
 * 2. 关键指标卡片（PE、ROE、市值等）
 * 3. 财务数据表格（最近5年）
 * 4. 底部：返回按钮
 */

import Link from "next/link";
import { getCompanyProfile, getIncomeStatement, getKeyMetrics } from "@/lib/fmp";
import { formatCurrency, formatPercent, formatMultiple } from "@/lib/format";
import RevenueChart from "@/components/charts/RevenueChart";
import MarginChart from "@/components/charts/MarginChart";
import EPSChart from "@/components/charts/EPSChart";

// 页面参数类型
interface CompanyPageProps {
  params: Promise<{ symbol: string }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { symbol } = await params;

  // 并行请求所有数据（更快）
  const [profile, incomeData, metricsData] = await Promise.all([
    getCompanyProfile(symbol),
    getIncomeStatement(symbol),
    getKeyMetrics(symbol),
  ]);

  // 如果获取不到公司信息，显示错误页面
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">
            😕 未找到公司信息
          </h1>
          <p className="text-gray-500 mb-6">
            无法获取 {symbol.toUpperCase()} 的数据，请检查股票代码是否正确
          </p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg
                                     hover:bg-blue-700 transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    );
  }

  // 取最新一年的关键指标
  const latestMetrics = metricsData[0] || null;
  // 计算 PE（市盈率）= 1 / 收益率
  const peRatio = latestMetrics?.earningsYield
    ? 1 / latestMetrics.earningsYield
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ===== 顶部：公司基本信息 ===== */}
      <header className="bg-[#141414] border-b border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* 公司 Logo */}
            {profile.image && (
              <img
                src={profile.image}
                alt={`${profile.companyName} logo`}
                width={64}
                height={64}
                className="rounded-lg bg-white p-1"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                  {profile.companyName}
                </h1>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-medium">
                  {profile.symbol}
                </span>
              </div>
              <p className="text-gray-400 mt-1">
                {profile.sector} · {profile.industry} · {profile.exchange}
              </p>
            </div>
            {/* 股价信息 */}
            <div className="text-right">
              <div className="text-2xl font-bold text-white">${profile.price}</div>
              <div className={`text-sm ${profile.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {profile.change >= 0 ? "+" : ""}{profile.change.toFixed(2)} ({profile.changePercentage.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== 主内容区域 ===== */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ===== 关键指标卡片 ===== */}
        <section>
          <h2 className="text-lg font-semibold text-gray-300 mb-4">📈 关键指标</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <MetricCard label="市值" value={formatCurrency(profile.marketCap)} />
            <MetricCard label="市盈率 (PE)" value={peRatio ? peRatio.toFixed(1) : "N/A"} />
            <MetricCard label="ROE 净资产收益率" value={latestMetrics ? formatPercent(latestMetrics.returnOnEquity) : "N/A"} />
            <MetricCard label="ROA 总资产收益率" value={latestMetrics ? formatPercent(latestMetrics.returnOnAssets) : "N/A"} />
            <MetricCard label="EV/EBITDA" value={latestMetrics ? formatMultiple(latestMetrics.evToEBITDA) : "N/A"} />
            <MetricCard label="流动比率" value={latestMetrics ? latestMetrics.currentRatio.toFixed(2) : "N/A"} />
          </div>
        </section>

        {/* ===== 图表区域 ===== */}
        {incomeData.length > 0 && (
          <section>
          <h2 className="text-lg font-semibold text-gray-300 mb-4">📈 趋势图表</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RevenueChart data={incomeData} />
              <MarginChart data={incomeData} />
            </div>
            <div className="mt-4">
              <EPSChart data={incomeData} />
            </div>
          </section>
        )}

        {/* ===== 财务数据表格 ===== */}
        {incomeData.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-300 mb-4">📊 年度财务数据</h2>
            <div className="bg-[#141414] rounded-2xl border border-[#2a2a2a] overflow-hidden">
              <table className="w-full text-base font-mono">
                <thead className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
                  <tr>
                    <th className="px-5 py-4 text-left text-gray-200 font-semibold">年份</th>
                    <th className="px-5 py-4 text-right text-gray-200 font-semibold">营收</th>
                    <th className="px-5 py-4 text-right text-gray-200 font-semibold">净利润</th>
                    <th className="px-5 py-4 text-right text-gray-200 font-semibold">毛利率</th>
                    <th className="px-5 py-4 text-right text-gray-200 font-semibold">净利率</th>
                    <th className="px-5 py-4 text-right text-gray-200 font-semibold">EPS</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeData.map((row, idx) => {
                    const grossMargin = row.revenue ? row.grossProfit / row.revenue : 0;
                    const netMargin = row.revenue ? row.netIncome / row.revenue : 0;
                    return (
                      <tr key={row.fiscalYear} className={`border-b border-[#2a2a2a] last:border-b-0 ${idx % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#111]"}`}>
                        <td className="px-5 py-4 font-medium text-white">{row.fiscalYear}</td>
                        <td className="px-5 py-4 text-right text-gray-300">{formatCurrency(row.revenue)}</td>
                        <td className={`px-5 py-4 text-right ${row.netIncome >= 0 ? "text-green-400" : "text-red-400"}`}>{formatCurrency(row.netIncome)}</td>
                        <td className="px-5 py-4 text-right text-gray-300">{formatPercent(grossMargin)}</td>
                        <td className="px-5 py-4 text-right text-gray-300">{formatPercent(netMargin)}</td>
                        <td className={`px-5 py-4 text-right ${row.epsDiluted >= 0 ? "text-green-400" : "text-red-400"}`}>${row.epsDiluted.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ===== 公司简介 ===== */}
        {profile.description && (
          <section>
            <h2 className="text-lg font-semibold text-gray-300 mb-4">🏢 公司简介</h2>
            <p className="text-gray-400 leading-relaxed bg-[#141414] p-4 rounded-lg border border-[#2a2a2a]">
              {profile.description.slice(0, 500)}
              {profile.description.length > 500 ? "..." : ""}
            </p>
          </section>
        )}

        {/* ===== 返回按钮 ===== */}
        <div className="text-center pt-4 pb-10">
          <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg
                                     hover:bg-blue-700 transition-colors">
            ← 返回首页搜索
          </Link>
        </div>
      </main>
    </div>
  );
}

/**
 * 指标卡片组件
 * 用来展示单个关键指标（如市盈率、ROE等）
 */
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#141414] p-4 rounded-lg border border-[#2a2a2a]">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}
