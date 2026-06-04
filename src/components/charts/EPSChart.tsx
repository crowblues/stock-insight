/**
 * EPS 每股收益趋势图（面积图）—— City Pop 配色
 */
"use client";

import ReactECharts from "echarts-for-react";

interface EPSChartProps {
  data: {
    fiscalYear: string;
    epsDiluted: number;
  }[];
}

export default function EPSChart({ data }: EPSChartProps) {
  const reversed = [...data].reverse();

  const option = {
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "#fdf6ec",
      borderColor: "#e8e0d4",
      textStyle: { color: "#2d2a26" },
      formatter: (params: Array<{ value: number; axisValue: string }>) => {
        return `<strong>${params[0].axisValue}年</strong><br/>EPS: $${params[0].value.toFixed(2)}`;
      },
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category" as const,
      data: reversed.map((d) => d.fiscalYear),
      axisLabel: { color: "#7a7067" },
      axisLine: { lineStyle: { color: "#e8e0d4" } },
    },
    yAxis: {
      type: "value" as const,
      axisLabel: { formatter: (val: number) => `$${val}`, color: "#7a7067" },
      splitLine: { lineStyle: { color: "#e8e0d4" } },
    },
    series: [
      {
        name: "EPS",
        type: "line",
        smooth: true,
        data: reversed.map((d) => d.epsDiluted),
        symbol: "circle",
        symbolSize: 7,
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(232, 120, 138, 0.35)" },
              { offset: 1, color: "rgba(232, 120, 138, 0.02)" },
            ],
          },
        },
        itemStyle: { color: "#e8788a" },
        lineStyle: { width: 3, color: "#e8788a" },
      },
    ],
  };

  return (
    <div className="rounded-xl border border-cp-line bg-cp-paper p-4">
      <h3 className="mb-2 text-sm font-medium text-cp-ink-soft">EPS 每股收益趋势</h3>
      <ReactECharts option={option} style={{ height: "280px" }} />
    </div>
  );
}
