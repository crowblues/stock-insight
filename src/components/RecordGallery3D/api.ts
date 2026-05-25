import type { RecordCard, CompanyDetailPayload } from "./types";

const buildFallbackIncomeData = (card: RecordCard): CompanyDetailPayload["incomeData"] => {
  const seed = Array.from(card.symbol).reduce((total, char) => total + char.charCodeAt(0), 0);
  const latestRevenue = (42 + (seed % 96)) * 1_000_000_000;
  const growth = 0.055 + (seed % 5) * 0.012;
  const grossMargin = 0.42 + (seed % 16) / 100;
  const netMargin = 0.16 + (seed % 12) / 100;
  const shares = 3_200_000_000 + (seed % 9) * 620_000_000;

  return Array.from({ length: 5 }, (_, index) => {
    const revenue = Math.round(latestRevenue / Math.pow(1 + growth, index));
    const netIncome = Math.round(revenue * (netMargin - index * 0.006));
    return {
      fiscalYear: `${2025 - index}`,
      revenue,
      grossProfit: Math.round(revenue * (grossMargin - index * 0.004)),
      netIncome,
      epsDiluted: Number((netIncome / shares).toFixed(2)),
    };
  });
};

export const fallbackDetail = (card: RecordCard): CompanyDetailPayload => ({
  profile: {
    symbol: card.symbol,
    companyName: card.sub,
    image: card.image,
    industry: card.tags[0] ?? "Analysis",
    sector: "Company Research",
    exchange: "Stock Insight",
    marketCap: 0,
    price: 0,
    change: Number.parseFloat(card.change.replace("%", "")),
    description: card.desc,
  },
  latestMetrics: null,
  latestIncome: (() => {
    const latest = buildFallbackIncomeData(card)[0];
    return {
      fiscalYear: latest.fiscalYear,
      revenue: latest.revenue,
      netIncome: latest.netIncome,
    };
  })(),
  incomeData: buildFallbackIncomeData(card),
  peRatio: null,
});

export const normalizeCompanyDetail = (card: RecordCard, detail: CompanyDetailPayload): CompanyDetailPayload => {
  const fallback = fallbackDetail(card);
  const incomeData = detail.incomeData?.length ? detail.incomeData : fallback.incomeData;
  const latestIncome = detail.latestIncome ?? {
    fiscalYear: incomeData[0]?.fiscalYear,
    revenue: incomeData[0]?.revenue ?? 0,
    netIncome: incomeData[0]?.netIncome ?? 0,
  };

  return {
    ...fallback,
    ...detail,
    profile: detail.profile ?? fallback.profile,
    latestMetrics: detail.latestMetrics ?? fallback.latestMetrics,
    latestIncome,
    incomeData,
    peRatio: detail.peRatio ?? fallback.peRatio,
  };
};

export const loadCompanyDetail = async (symbol: string): Promise<CompanyDetailPayload | null> => {
  try {
    const response = await fetch(`/api/company/${encodeURIComponent(symbol)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};
