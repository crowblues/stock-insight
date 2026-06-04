/**
 * 营收与净利润趋势图（柱状图）—— City Pop 配色
 *
 * X轴：年份（从旧到新，左到右）
 * Y轴：金额
 * 蓝色柱子 = 营收，绿色柱子 = 净利润
 */
"use client";

import ReactECharts from "echarts-for-react";

interface RevenueChartProps {
  data: {
    fiscalYear: string;
    revenue: number;
    netIncome: number;
  }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const reversed = [...data].reverse();

  const option = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "#fdf6ec",
      borderColor: "#e8e0d4",
      textStyle: { color: "#2d2a26" },
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
    legend: { data: ["营收", "净利润"], top: 0, textStyle: { color: "#7a7067" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category" as const,
      data: reversed.map((d) => d.fiscalYear),
      axisLabel: { color: "#7a7067" },
      axisLine: { lineStyle: { color: "#e8e0d4" } },
    },
    yAxis: {
      type: "value" as const,
      axisLabel: {
        formatter: (val: number) => `$${(val / 1_000_000_000).toFixed(0)}B`,
        color: "#7a7067",
      },
      splitLine: { lineStyle: { color: "#e8e0d4" } },
    },
    series: [
      {
        name: "营收",
        type: "bar",
        data: reversed.map((d) => d.revenue),
        itemStyle: { color: "#6bb8c4", borderRadius: [4, 4, 0, 0] },
      },
      {
        name: "净利润",
        type: "bar",
        data: reversed.map((d) => d.netIncome),
        itemStyle: { color: "#7ecba1", borderRadius: [4, 4, 0, 0] },
      },
    ],
  };

  return (
    <div className="rounded-xl border border-cp-line bg-cp-paper p-4">
      <h3 className="mb-2 text-sm font-medium text-cp-ink-soft">营收与净利润趋势</h3>
      <ReactECharts option={option} style={{ height: "280px" }} />
    </div>
  );
}
