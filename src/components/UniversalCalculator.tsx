// components/UniversalCalculator.tsx - Motor de Renderização Universal
"use client";

import { PortalItem, isFipeItem, isTacoItem } from "@/types/portal";
import { BentoCard } from "./bento/BentoCard";
import { PriceChart } from "./ui/PriceChart";
import { NutrientRadar } from "./ui/NutrientRadar";
import { formatCurrency } from "@/lib/calculators";
import { ExternalLink, TrendingUp, Info } from "lucide-react";

interface UniversalCalculatorProps {
  item: PortalItem;
}

export function UniversalCalculator({ item }: UniversalCalculatorProps) {
  const { metadata, visuals, insights, affiliate } = item;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <span className="rounded-full bg-surface-elevated px-3 py-1">
            {metadata.source}
          </span>
          <span>•</span>
          <span>Atualizado em {metadata.updatedAt}</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">{metadata.title}</h1>

        <p className="text-lg text-foreground-muted max-w-3xl">
          {metadata.description}
        </p>
      </div>

      {/* Insights Summary */}
      <div className="rounded-xl border border-border bg-surface-elevated p-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-info mt-1 flex-shrink-0" />
          <div className="space-y-3">
            <p className="text-foreground">{insights.summary}</p>
            <ul className="space-y-2">
              {insights.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-foreground-muted"
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: visuals.accentColor }}
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bento Grid - Renderização Condicional */}
      <div className="bento-grid">
        {/* FIPE Specific Components */}
        {isFipeItem(item) && (
          <>
            {/* Current Price Card */}
            <BentoCard
              title="Preço Atual"
              description="Valor de mercado segundo FIPE"
              accentColor={visuals.accentColor}
            >
              <div className="space-y-2">
                <p className="text-3xl font-bold">
                  {formatCurrency(item.dataPoints.currentPrice)}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp
                    className="h-4 w-4"
                    style={{
                      color:
                        item.dataPoints.depreciationInfo.trend === "up"
                          ? "#10b981"
                          : item.dataPoints.depreciationInfo.trend === "down"
                          ? "#ef4444"
                          : "#6b7280",
                    }}
                  />
                  <span
                    style={{
                      color:
                        item.dataPoints.depreciationInfo.trend === "up"
                          ? "#10b981"
                          : item.dataPoints.depreciationInfo.trend === "down"
                          ? "#ef4444"
                          : "#6b7280",
                    }}
                  >
                    {Math.abs(item.dataPoints.depreciationInfo.percentage)}%{" "}
                    {item.dataPoints.depreciationInfo.trend === "up"
                      ? "de valorização"
                      : item.dataPoints.depreciationInfo.trend === "down"
                      ? "de depreciação"
                      : "estável"}
                  </span>
                </div>
              </div>
            </BentoCard>

            {/* IPVA Card */}
            <BentoCard
              title="IPVA Estimado"
              description="Valor anual aproximado (SP)"
              accentColor={visuals.accentColor}
            >
              <p className="text-3xl font-bold">
                {formatCurrency(item.dataPoints.ipvaEstimated)}
              </p>
              <p className="mt-2 text-sm text-foreground-muted">
                Baseado em alíquota de 4% (SP)
              </p>
            </BentoCard>

            {/* Price History Chart */}
            <BentoCard
              title="Histórico de Preços"
              description="Últimos 12 meses"
              accentColor={visuals.accentColor}
              className="md:col-span-2"
            >
              <PriceChart
                data={item.dataPoints.priceHistory}
                trend={item.dataPoints.depreciationInfo.trend}
                accentColor={visuals.accentColor}
              />
            </BentoCard>
          </>
        )}

        {/* TACO Specific Components */}
        {isTacoItem(item) && (
          <>
            {/* Macros Card */}
            <BentoCard
              title="Macronutrientes"
              description={`Por ${item.dataPoints.servingSize}`}
              accentColor={visuals.accentColor}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-foreground-muted">Calorias</p>
                  <p className="text-2xl font-bold">
                    {item.dataPoints.macros.calories}
                  </p>
                  <p className="text-xs text-foreground-muted">kcal</p>
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Proteínas</p>
                  <p className="text-2xl font-bold">
                    {item.dataPoints.macros.protein}
                  </p>
                  <p className="text-xs text-foreground-muted">g</p>
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Carboidratos</p>
                  <p className="text-2xl font-bold">
                    {item.dataPoints.macros.carbs}
                  </p>
                  <p className="text-xs text-foreground-muted">g</p>
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Gorduras</p>
                  <p className="text-2xl font-bold">
                    {item.dataPoints.macros.fat}
                  </p>
                  <p className="text-xs text-foreground-muted">g</p>
                </div>
              </div>
            </BentoCard>

            {/* Micronutrients Card */}
            <BentoCard
              title="Micronutrientes"
              description="Vitaminas e minerais essenciais"
              accentColor={visuals.accentColor}
              className="md:col-span-2"
            >
              <NutrientRadar
                nutrients={item.dataPoints.micros}
                accentColor={visuals.accentColor}
              />
            </BentoCard>
          </>
        )}
      </div>

      {/* Affiliate Widget (Contextual) */}
      {affiliate && (
        <div className="rounded-xl border border-border bg-gradient-to-br from-surface to-surface-elevated p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{affiliate.cta}</h3>
              <p className="mt-1 text-sm text-foreground-muted">
                Parceiros selecionados com ofertas exclusivas
              </p>
            </div>
            <a
              href={affiliate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex items-center gap-2"
            >
              Ver Ofertas
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* Source Citation */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-xs text-foreground-muted">
          <strong>Fonte:</strong> {metadata.source} • Os dados apresentados são
          de fontes oficiais e públicas. Este portal não se responsabiliza por
          decisões tomadas com base nas informações fornecidas.
        </p>
      </div>
    </div>
  );
}
