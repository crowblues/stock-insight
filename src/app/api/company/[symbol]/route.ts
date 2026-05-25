import { NextRequest, NextResponse } from "next/server";
import { getCompanyProfile, getIncomeStatement, getKeyMetrics } from "@/lib/fmp";

interface CompanyApiProps {
  params: Promise<{ symbol: string }>;
}

export async function GET(_request: NextRequest, { params }: CompanyApiProps) {
  const { symbol } = await params;

  const [profile, incomeData, metricsData] = await Promise.all([
    getCompanyProfile(symbol),
    getIncomeStatement(symbol),
    getKeyMetrics(symbol),
  ]);

  const latestMetrics = metricsData[0] || null;
  const latestIncome = incomeData[0] || null;
  const peRatio = latestMetrics?.earningsYield ? 1 / latestMetrics.earningsYield : null;

  return NextResponse.json({
    profile,
    incomeData,
    latestMetrics,
    latestIncome,
    peRatio,
  });
}
