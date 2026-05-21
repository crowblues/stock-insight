/**
 * 利润率趋势图（折线图）
 * 
 * X轴：年份
 * Y轴：百分比
 * 蓝色线 = 毛利率，绿色线 = 净利率
 * 带数据点标记
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
  // 反转顺序：最旧在左
  const reversed = [...data].reverse();

  // 计算利润率
  const grossMargins = reversed.map((d) =>
    d.revenue ? ((d.grossProfit / d.revenue) * 100).toFixed(2) : "0"
  );
  const netMargins = reversed.map((d) =>
    d.revenue ? ((d.netIncome / d.revenue) * 100).toFixed(2) : "0"
  );

  const option = {
    tooltip: {
      trigger: "axis" as const,
      formatter: (params: Array<{ seriesName: string; value: string; axisValue: string }>) => {
        const year = params[0].axisValue;
        let html = `<strong>${year}年</strong><br/>`;
        params.forEach((p) => {
          html += `${p.seriesName}: ${p.value}%<br/>`;
        });
        return html;
      },
    },
    legend: { data: ["毛利率", "净利率"], top: 0, textStyle: { color: "#a0a0a0" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category" as const, data: reversed.map((d) => d.fiscalYear), axisLabel: { color: "#a0a0a0" } },
    yAxis: {
      type: "value" as const,
      axisLabel: { formatter: (val: number) => `${val}%`, color: "#a0a0a0" },
      splitLine: { lineStyle: { color: "#2a2a2a" } },
    },
    series: [
      {
        name: "毛利率",
        type: "line",
        data: grossMargins,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "#3b82f6" },
        lineStyle: { width: 2 },
      },
      {
        name: "净利率",
        type: "line",
        data: netMargins,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "#10b981" },
        lineStyle: { width: 2 },
      },
    ],
  };

  return (
    <div className="bg-[#141414] p-4 rounded-lg border border-[#2a2a2a]">
      <h3 className="text-sm font-medium text-gray-400 mb-2">利润率趋势</h3>
      <ReactECharts option={option} style={{ height: "280px" }} theme="dark" />
    </div>
  );
}
