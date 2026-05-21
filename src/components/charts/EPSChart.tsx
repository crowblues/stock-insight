/**
 * EPS 每股收益趋势图（面积图）
 * 
 * X轴：年份
 * Y轴：美元
 * 蓝色渐变填充的面积图
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
  // 反转顺序：最旧在左
  const reversed = [...data].reverse();

  const option = {
    tooltip: {
      trigger: "axis" as const,
      formatter: (params: Array<{ value: number; axisValue: string }>) => {
        return `<strong>${params[0].axisValue}年</strong><br/>EPS: $${params[0].value.toFixed(2)}`;
      },
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category" as const, data: reversed.map((d) => d.fiscalYear) },
    yAxis: {
      type: "value" as const,
      axisLabel: { formatter: (val: number) => `$${val}` },
    },
    series: [
      {
        name: "EPS",
        type: "line",
        data: reversed.map((d) => d.epsDiluted),
        symbol: "circle",
        symbolSize: 6,
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
              { offset: 1, color: "rgba(59, 130, 246, 0.02)" },
            ],
          },
        },
        itemStyle: { color: "#3b82f6" },
        lineStyle: { width: 2, color: "#3b82f6" },
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-2">EPS 每股收益趋势</h3>
      <ReactECharts option={option} style={{ height: "280px" }} />
    </div>
  );
}
