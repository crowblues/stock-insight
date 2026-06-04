/**
 * 利润率趋势图（折线图）—— City Pop 配色
 */
"use client";

import ReactECharts from "echarts-for-react";

interface MarginChartProps {
  data: {
    fiscalYear: string;
    revenue: number;
    grossProfit: number;
    netIncome: number;
  }[];
}

export default function MarginChart({ data }: MarginChartProps) {
  const reversed = [...data].reverse();

  const grossMargins = reversed.map((d) =>
    d.revenue ? ((d.grossProfit / d.revenue) * 100).toFixed(2) : "0"
  );
  const netMargins = reversed.map((d) =>
    d.revenue ? ((d.netIncome / d.revenue) * 100).toFixed(2) : "0"
  );

  const option = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "#fdf6ec",
      borderColor: "#e8e0d4",
      textStyle: { color: "#2d2a26" },
      formatter: (params: Array<{ seriesName: string; value: string; axisValue: string }>) => {
        const year = params[0].axisValue;
        let html = `<strong>${year}年</strong><br/>`;
        params.forEach((p) => {
          html += `${p.seriesName}: ${p.value}%<br/>`;
        });
        return html;
      },
    },
    legend: { data: ["毛利率", "净利率"], top: 0, textStyle: { color: "#7a7067" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category" as const,
      data: reversed.map((d) => d.fiscalYear),
      axisLabel: { color: "#7a7067" },
      axisLine: { lineStyle: { color: "#e8e0d4" } },
    },
    yAxis: {
      type: "value" as const,
      axisLabel: { formatter: (val: number) => `${val}%`, color: "#7a7067" },
      splitLine: { lineStyle: { color: "#e8e0d4" } },
    },
    series: [
      {
        name: "毛利率",
        type: "line",
        smooth: true,
        data: grossMargins,
        symbol: "circle",
        symbolSize: 7,
        itemStyle: { color: "#9b8ec4" },
        lineStyle: { width: 3, color: "#9b8ec4" },
      },
      {
        name: "净利率",
        type: "line",
        smooth: true,
        data: netMargins,
        symbol: "circle",
        symbolSize: 7,
        itemStyle: { color: "#f2c94c" },
        lineStyle: { width: 3, color: "#f2c94c" },
      },
    ],
  };

  return (
    <div className="rounded-xl border border-cp-line bg-cp-paper p-4">
      <h3 className="mb-2 text-sm font-medium text-cp-ink-soft">利润率趋势</h3>
      <ReactECharts option={option} style={{ height: "280px" }} />
    </div>
  );
}
