import type { MotionValue } from "motion/react";

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

export type OverlayRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type CardLayoutItem = {
  card: RecordCard;
  index: number;
  slot: number;
  motionSlot: number;
  opacity: number;
  isClickableSlot: boolean;
  y: number;
  z: number;
  width: number;
  height: number;
  tilt: number;
  roll: number;
};

export type CardFaceMode = "stack" | "active" | "detail";

export type CardVisualState = {
  y: number;
  z: number;
  width: number;
  height: number;
  scaleX: number;
  tilt: number;
  roll: number;
  zIndex: number;
  opacity: number;
  radius: number;
  borderWidth: number;
  borderOpacity: number;
  shadowStrength: number;
  imageScale: number;
  compactTitleOpacity: number;
  detailTitleOpacity: number;
  metaOpacity: number;
  descriptionOpacity: number;
  hintOpacity: number;
};

type CardFaceNumberValue = number | MotionValue<number>;
type CardFaceStringValue = string | MotionValue<string>;

export type CardFaceRenderState = {
  height: CardFaceNumberValue;
  radius: CardFaceNumberValue;
  borderWidth: CardFaceNumberValue;
  borderColor: CardFaceStringValue;
  boxShadow: CardFaceStringValue;
  imageScale: CardFaceNumberValue;
  compactTitleOpacity: CardFaceNumberValue;
  detailTitleOpacity: CardFaceNumberValue;
  metaOpacity: CardFaceNumberValue;
  descriptionOpacity: CardFaceNumberValue;
  descriptionY: CardFaceNumberValue;
  hintOpacity: CardFaceNumberValue;
};

export type RecordGallery3DProps = {
  onBackToStart?: () => void;
};
