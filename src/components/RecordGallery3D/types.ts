export type RecordCard = {
  symbol: string;
  name: string;
  sub: string;
  desc: string;
  tags: string[];
  image: string;
  tint: string;
  change: string;
};

export type CompanyDetailPayload = {
  profile: {
    symbol: string;
    companyName: string;
    image: string;
    industry: string;
    sector: string;
    exchange: string;
    marketCap: number;
    price: number;
    change: number;
    description: string;
  } | null;
  latestMetrics: {
    returnOnEquity: number;
    returnOnAssets: number;
    evToEBITDA: number;
  } | null;
  latestIncome: {
    fiscalYear?: string;
    revenue: number;
    netIncome: number;
  } | null;
  incomeData: {
    fiscalYear: string;
    revenue: number;
    grossProfit: number;
    netIncome: number;
    epsDiluted: number;
  }[];
  peRatio: number | null;
};

export type ActiveMode = "idle" | "peek" | "full";

export type RecordGallery3DProps = {
  onBackToStart?: () => void;
};
