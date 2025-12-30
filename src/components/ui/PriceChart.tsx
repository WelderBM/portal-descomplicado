// components/ui/PriceChart.tsx - Gráfico de Linha para Histórico de Preços
"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PriceDataPoint {
  month: string;
  value: number;
}

interface PriceChartProps {
  data: PriceDataPoint[];
  trend: "up" | "down" | "stable";
  accentColor?: string;
}

export function PriceChart({
  data,
  trend,
  accentColor = "#10b981",
}: PriceChartProps) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue;

  // Normaliza os valores para 0-100 para o gráfico
  const normalizedData = data.map((point) => ({
    ...point,
    normalized: range > 0 ? ((point.value - minValue) / range) * 100 : 50,
  }));

  // Gera o path do SVG
  const chartHeight = 120;
  const chartWidth = 100;
  const points = normalizedData.map((point, index) => {
    const x = (index / (normalizedData.length - 1)) * chartWidth;
    const y = chartHeight - (point.normalized / 100) * chartHeight;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#6b7280";

  return (
    <div className="space-y-4">
      {/* Trend Indicator */}
      <div className="flex items-center gap-2">
        <TrendIcon className="h-5 w-5" style={{ color: trendColor }} />
        <span className="text-sm font-medium" style={{ color: trendColor }}>
          {trend === "up"
            ? "Valorização"
            : trend === "down"
            ? "Depreciação"
            : "Estável"}
        </span>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          preserveAspectRatio="none"
        >
          {/* Grid Lines */}
          <line
            x1="0"
            y1={chartHeight / 2}
            x2={chartWidth}
            y2={chartHeight / 2}
            stroke="var(--border)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />

          {/* Area under the line */}
          <path
            d={`${pathData} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
            fill={accentColor}
            opacity="0.1"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {normalizedData.map((point, index) => {
            const x = (index / (normalizedData.length - 1)) * chartWidth;
            const y = chartHeight - (point.normalized / 100) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={accentColor}
                className="transition-all hover:r-3"
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs text-foreground-muted">
        <span>{data[0]?.month}</span>
        <span>{data[data.length - 1]?.month}</span>
      </div>
    </div>
  );
}
