/**
 * 营收与净利润趋势图（柱状图）
 * 
 * X轴：年份（从旧到新，左到右）
 * Y轴：金额
 * 蓝色柱子 = 营收，绿色柱子 = 净利润
 * 鼠标悬停显示具体数值
 */
"use client"; // ECharts 需要浏览器环境，必须是客户端组件

import ReactECharts from "echarts-for-react";

// 定义组件接收的数据格式
interface RevenueChartProps {
  data: {
    fiscalYear: string;
    revenue: number;
    netIncome: number;
  }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // 反转数据顺序：FMP 返回最新在前，图表需要最旧在左
  const reversed = [...data].reverse();

  // ECharts 配置项
  const option = {
    // 提示框：鼠标悬停时显示
    tooltip: {
      trigger: "axis" as const,
      formatter: (params: Array<{ seriesName: string; value: number; axisValue: string }>) => {
        const year = params[0].axisValue;
        let html = `<strong>${year}年</strong><br/>`;
        params.forEach((p) => {
          const val = (p.value / 1_000_000_000).toFixed(1);
          html += `${p.seriesName}: $${val}B<br/>`;
        });
        return html;
      },
    },
    // 图例
    legend: { data: ["营收", "净利润"], top: 0 },
    // 网格（留出边距）
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    // X轴：年份
    xAxis: { type: "category" as const, data: reversed.map((d) => d.fiscalYear) },
    // Y轴：金额（自动格式化为B）
    yAxis: {
      type: "value" as const,
      axisLabel: {
        formatter: (val: number) => `$${(val / 1_000_000_000).toFixed(0)}B`,
      },
    },
    // 数据系列
    series: [
      {
        name: "营收",
        type: "bar",
        data: reversed.map((d) => d.revenue),
        itemStyle: { color: "#3b82f6" }, // 蓝色
      },
      {
        name: "净利润",
        type: "bar",
        data: reversed.map((d) => d.netIncome),
        itemStyle: { color: "#10b981" }, // 绿色
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-2">营收与净利润趋势</h3>
      <ReactECharts option={option} style={{ height: "280px" }} />
    </div>
  );
}
