import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { BentoCard } from "@/components/bento/BentoCard";

interface PriceTileProps {
  data: {
    current_price: number;
    history?: { month: string; value: number }[];
    currency?: string;
  };
  depreciation?: {
    trend: "up" | "down" | "stable";
    percentage: number;
  };
}

export function PriceTile({ data, depreciation }: PriceTileProps) {
  if (!data?.current_price) return null;

  const trendColor =
    depreciation?.trend === "up"
      ? "#10b981"
      : depreciation?.trend === "down"
      ? "#ef4444"
      : "#6b7280";

  const TrendIcon =
    depreciation?.trend === "up"
      ? TrendingUp
      : depreciation?.trend === "down"
      ? TrendingDown
      : Minus;

  return (
    <BentoCard title="Preço de Mercado" description="Referência Atualizada">
      <div className="flex flex-col gap-2">
        <span className="text-4xl font-bold tracking-tight">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: data.currency || "BRL",
          }).format(data.current_price)}
        </span>

        {depreciation && (
          <div
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: trendColor }}
          >
            <TrendIcon className="h-4 w-4" />
            <span>
              {depreciation.trend === "up" ? "Valorização" : "Depreciação"} de{" "}
              {Math.abs(depreciation.percentage)}%
            </span>
          </div>
        )}

        {/* Mini Chart Placeholder (seria um Recharts aqui) */}
        {data.history && (
          <div className="mt-4 h-16 w-full flex items-end gap-1 opacity-50">
            {data.history.map((h, i) => (
              <div
                key={i}
                className="bg-primary flex-1 rounded-t-sm"
                style={{ height: `${(h.value / data.current_price) * 50}%` }}
                title={`${h.month}: ${h.value}`}
              />
            ))}
          </div>
        )}
      </div>
    </BentoCard>
  );
}
