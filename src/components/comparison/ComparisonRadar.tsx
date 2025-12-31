// components/comparison/ComparisonRadar.tsx - Gráfico Radar para Comparação
"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface RadarDataPoint {
  metric: string;
  item1: number;
  item2: number;
  fullMark: number;
}

interface ComparisonRadarProps {
  item1Name: string;
  item2Name: string;
  data: RadarDataPoint[];
  item1Color?: string;
  item2Color?: string;
}

export function ComparisonRadar({
  item1Name,
  item2Name,
  data,
  item1Color = "#10b981",
  item2Color = "#3b82f6",
}: ComparisonRadarProps) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#9ca3af", fontSize: 10 }}
          />
          <Radar
            name={item1Name}
            dataKey="item1"
            stroke={item1Color}
            fill={item1Color}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name={item2Name}
            dataKey="item2"
            stroke={item2Color}
            fill={item2Color}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
            iconType="circle"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
            }}
            labelStyle={{ color: "#f3f4f6" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Normaliza valores para escala 0-100 para o radar
 */
export function normalizeValue(
  value: number,
  min: number,
  max: number
): number {
  if (max === min) return 50;
  return Math.round(((value - min) / (max - min)) * 100);
}

/**
 * Prepara dados de veículos FIPE para o radar
 */
export function prepareFipeRadarData(
  vehicle1: {
    price: number;
    ipva: number;
    depreciation: number;
  },
  vehicle2: {
    price: number;
    ipva: number;
    depreciation: number;
  }
): RadarDataPoint[] {
  // Encontra min/max para normalização
  const prices = [vehicle1.price, vehicle2.price];
  const ipvas = [vehicle1.ipva, vehicle2.ipva];
  const depreciations = [
    Math.abs(vehicle1.depreciation),
    Math.abs(vehicle2.depreciation),
  ];

  const priceMin = Math.min(...prices);
  const priceMax = Math.max(...prices);
  const ipvaMin = Math.min(...ipvas);
  const ipvaMax = Math.max(...ipvas);
  const depMin = Math.min(...depreciations);
  const depMax = Math.max(...depreciations);

  return [
    {
      metric: "Valor",
      item1: normalizeValue(vehicle1.price, priceMin, priceMax),
      item2: normalizeValue(vehicle2.price, priceMin, priceMax),
      fullMark: 100,
    },
    {
      metric: "IPVA",
      item1: 100 - normalizeValue(vehicle1.ipva, ipvaMin, ipvaMax), // Invertido (menor é melhor)
      item2: 100 - normalizeValue(vehicle2.ipva, ipvaMin, ipvaMax),
      fullMark: 100,
    },
    {
      metric: "Valorização",
      item1:
        vehicle1.depreciation > 0
          ? normalizeValue(vehicle1.depreciation, 0, Math.max(...depreciations))
          : 0,
      item2:
        vehicle2.depreciation > 0
          ? normalizeValue(vehicle2.depreciation, 0, Math.max(...depreciations))
          : 0,
      fullMark: 100,
    },
    {
      metric: "Custo-Benefício",
      item1: Math.round(
        (100 -
          normalizeValue(vehicle1.price, priceMin, priceMax) +
          (100 - normalizeValue(vehicle1.ipva, ipvaMin, ipvaMax))) /
          2
      ),
      item2: Math.round(
        (100 -
          normalizeValue(vehicle2.price, priceMin, priceMax) +
          (100 - normalizeValue(vehicle2.ipva, ipvaMin, ipvaMax))) /
          2
      ),
      fullMark: 100,
    },
  ];
}

/**
 * Prepara dados de alimentos TACO para o radar
 */
export function prepareTacoRadarData(
  food1: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    calories: number;
  },
  food2: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    calories: number;
  }
): RadarDataPoint[] {
  const proteins = [food1.protein, food2.protein];
  const carbs = [food1.carbs, food2.carbs];
  const fats = [food1.fat, food2.fat];
  const fibers = [food1.fiber, food2.fiber];
  const calories = [food1.calories, food2.calories];

  const proteinMin = Math.min(...proteins);
  const proteinMax = Math.max(...proteins);
  const carbMin = Math.min(...carbs);
  const carbMax = Math.max(...carbs);
  const fatMin = Math.min(...fats);
  const fatMax = Math.max(...fats);
  const fiberMin = Math.min(...fibers);
  const fiberMax = Math.max(...fibers);
  const calMin = Math.min(...calories);
  const calMax = Math.max(...calories);

  return [
    {
      metric: "Proteínas",
      item1: normalizeValue(food1.protein, proteinMin, proteinMax),
      item2: normalizeValue(food2.protein, proteinMin, proteinMax),
      fullMark: 100,
    },
    {
      metric: "Carboidratos",
      item1: normalizeValue(food1.carbs, carbMin, carbMax),
      item2: normalizeValue(food2.carbs, carbMin, carbMax),
      fullMark: 100,
    },
    {
      metric: "Gorduras",
      item1: normalizeValue(food1.fat, fatMin, fatMax),
      item2: normalizeValue(food2.fat, fatMin, fatMax),
      fullMark: 100,
    },
    {
      metric: "Fibras",
      item1: normalizeValue(food1.fiber, fiberMin, fiberMax),
      item2: normalizeValue(food2.fiber, fiberMin, fiberMax),
      fullMark: 100,
    },
    {
      metric: "Calorias",
      item1: normalizeValue(food1.calories, calMin, calMax),
      item2: normalizeValue(food2.calories, calMin, calMax),
      fullMark: 100,
    },
  ];
}
