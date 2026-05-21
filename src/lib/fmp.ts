/**
 * FMP (Financial Modeling Prep) API 封装
 * 
 * 这个文件统一管理所有对 FMP 数据接口的调用。
 * FMP 是一个提供美股财务数据的第三方服务。
 */

// API 基础地址（新版 stable 端点，v3 已废弃）
const BASE_URL = "https://financialmodelingprep.com/stable";

// 从环境变量中读取 API 密钥（保存在 .env.local 文件里，不会被上传到 GitHub）
const API_KEY = process.env.FMP_API_KEY;

/**
 * 搜索公司的返回数据类型
 * 每条搜索结果包含：股票代码、公司名、货币、交易所等信息
 */
export interface SearchResult {
  symbol: string;            // 股票代码，如 "AAPL"
  name: string;              // 公司名称，如 "Apple Inc."
  currency: string;          // 交易货币，如 "USD"
  exchangeFullName: string;  // 交易所全称，如 "NASDAQ Global Select"
  exchange: string;          // 交易所缩写，如 "NASDAQ"
}

/**
 * 搜索公司
 * 用户输入关键词（股票代码或公司名），返回匹配的公司列表
 * 
 * @param query - 搜索关键词，比如 "AAPL" 或 "Apple"
 * @returns 匹配的公司列表
 */
export async function searchCompanies(query: string): Promise<SearchResult[]> {
  // 如果没有配置 API 密钥，直接返回空数组
  if (!API_KEY) {
    console.error("FMP_API_KEY 未配置，请检查 .env.local 文件");
    return [];
  }

  // 拼接完整的请求地址（使用 search-name 端点，支持按公司名搜索）
  const url = `${BASE_URL}/search-name?query=${encodeURIComponent(query)}&limit=10&apikey=${API_KEY}`;

  try {
    // 发送请求到 FMP 服务器
    const response = await fetch(url);
    
    // 如果请求失败，打印错误信息
    if (!response.ok) {
      console.error(`FMP API 请求失败: ${response.status}`);
      return [];
    }

    // 把返回的 JSON 数据解析成我们定义的类型
    const data: SearchResult[] = await response.json();
    return data;
  } catch (error) {
    // 网络错误等异常情况
    console.error("搜索公司时出错:", error);
    return [];
  }
}

// ============================================================
// 以下是任务002新增的 API 函数
// ============================================================

/**
 * 公司基本信息的数据类型
 */
export interface CompanyProfile {
  symbol: string;
  companyName: string;
  image: string;           // Logo 图片 URL
  industry: string;        // 行业，如 "Consumer Electronics"
  sector: string;          // 板块，如 "Technology"
  exchange: string;        // 交易所
  marketCap: number;       // 市值
  price: number;           // 当前股价
  change: number;          // 涨跌额
  changePercentage: number;// 涨跌幅
  description: string;     // 公司简介
  country: string;
  ceo: string;
}

/**
 * 获取公司基本信息
 */
export async function getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
  if (!API_KEY) return null;
  const url = `${BASE_URL}/profile?symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    // API 返回的是数组，取第一个
    return data[0] || null;
  } catch (error) {
    console.error("获取公司信息失败:", error);
    return null;
  }
}

/**
 * 利润表（年度）的数据类型
 */
export interface IncomeStatement {
  date: string;
  fiscalYear: string;
  revenue: number;          // 营收
  grossProfit: number;      // 毛利润
  operatingIncome: number;  // 营业利润
  netIncome: number;        // 净利润
  eps: number;              // 每股收益
  epsDiluted: number;       // 稀释每股收益
  ebitda: number;
}

/**
 * 获取公司利润表（最近5年）
 */
export async function getIncomeStatement(symbol: string): Promise<IncomeStatement[]> {
  if (!API_KEY) return [];
  const url = `${BASE_URL}/income-statement?symbol=${encodeURIComponent(symbol)}&period=annual&apikey=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    // 只取最近5年的数据
    return data.slice(0, 5);
  } catch (error) {
    console.error("获取利润表失败:", error);
    return [];
  }
}

/**
 * 关键指标的数据类型
 */
export interface KeyMetrics {
  date: string;
  fiscalYear: string;
  marketCap: number;
  returnOnEquity: number;       // ROE 净资产收益率
  returnOnAssets: number;       // ROA 总资产收益率
  currentRatio: number;         // 流动比率
  evToEBITDA: number;           // EV/EBITDA
  earningsYield: number;        // 收益率（PE的倒数）
  netDebtToEBITDA: number;      // 净负债/EBITDA
}

/**
 * 获取关键财务指标
 */
export async function getKeyMetrics(symbol: string): Promise<KeyMetrics[]> {
  if (!API_KEY) return [];
  const url = `${BASE_URL}/key-metrics?symbol=${encodeURIComponent(symbol)}&period=annual&apikey=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 5);
  } catch (error) {
    console.error("获取关键指标失败:", error);
    return [];
  }
}
