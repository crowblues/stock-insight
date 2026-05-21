/**
 * 数据格式化工具
 * 
 * 把原始数字转换成人类可读的格式。
 * 比如 383285000000 → "$383.3B"
 */

/**
 * 格式化货币（大数字）
 * 把很长的数字变成带单位的简短格式
 * 
 * 例子：
 * - 416161000000 → "$416.2B"（十亿）
 * - 34550000000  → "$34.6B"
 * - 500000000    → "$500.0M"（百万）
 * - 1200000      → "$1.2M"
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1_000_000_000_000) {
    // 万亿级别（Trillion）
    return `${sign}$${(absValue / 1_000_000_000_000).toFixed(1)}T`;
  } else if (absValue >= 1_000_000_000) {
    // 十亿级别（Billion）
    return `${sign}$${(absValue / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    // 百万级别（Million）
    return `${sign}$${(absValue / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    // 千级别
    return `${sign}$${(absValue / 1_000).toFixed(1)}K`;
  }
  return `${sign}$${absValue.toFixed(2)}`;
}

/**
 * 格式化百分比
 * 把小数转换成百分比显示
 * 
 * 例子：
 * - 0.4689 → "46.89%"
 * - 1.5191 → "151.91%"（ROE 可能超过100%）
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  // 乘以100转换为百分比，保留两位小数
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * 格式化数字（千分位分隔）
 * 让大数字更容易阅读
 * 
 * 例子：
 * - 14948500000 → "14,948,500,000"
 * - 7.49 → "7.49"
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return value.toLocaleString("en-US");
}

/**
 * 格式化市盈率等倍数指标
 * 保留一位小数，加个 "x" 后缀
 * 
 * 例子：
 * - 28.5 → "28.5x"
 */
export function formatMultiple(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return `${value.toFixed(1)}x`;
}
