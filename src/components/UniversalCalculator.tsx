// components/UniversalCalculator.tsx - Motor de Renderização Universal
"use client";

import { useState } from "react";
import { PriceSavingsCard } from "./medicamentos/PriceSavingsCard";
import { ActiveIngredientBadge } from "./medicamentos/ActiveIngredientBadge";
import {
  PortalItem,
  isFipeItem,
  isTacoItem,
  isMedicamentoItem,
} from "@/types/portal";

import { BentoCard } from "./bento/BentoCard";
import { PriceChart } from "./ui/PriceChart";
import { NutrientRadar } from "./ui/NutrientRadar";
import { FavoriteButton } from "./ui/FavoriteButton";
import { Toast } from "./ui/Toast";
import {
  AffiliateOffer,
  getAffiliateCategory,
} from "./affiliate/AffiliateOffer";
import {
  TripCalculator,
  MealSimulator,
} from "./calculators/InteractiveCalculator";
import { formatCurrency } from "@/lib/calculators";
import { ExternalLink, TrendingUp, Info } from "lucide-react";

interface UniversalCalculatorProps {
  item: PortalItem;
}

export function UniversalCalculator({ item }: UniversalCalculatorProps) {
  const { metadata, visuals, insights, affiliate } = item;
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const handleFavoriteToggle = (isFavorited: boolean) => {
    const garageName = item.type === "fipe" ? "Minha Garagem" : "Meu Diário";
    setToastMessage(
      isFavorited ? `Adicionado a ${garageName}!` : `Removido de ${garageName}`
    );
    setToastType(isFavorited ? "success" : "info");
    setShowToast(true);
  };

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

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight">
              {metadata.title}
            </h1>

            <p className="mt-4 text-lg text-foreground-muted max-w-3xl">
              {metadata.description}
            </p>
          </div>

          <FavoriteButton item={item} onToggle={handleFavoriteToggle} />
        </div>
      </div>

      {/* Insights Summary */}
      <div className="rounded-xl border border-border bg-surface-elevated p-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-info mt-1 shrink-0" />
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

            {/* Trip Calculator - Interactive */}
            <div className="md:col-span-2">
              <TripCalculator fuelPrice={6.0} vehicleName={metadata.title} />
            </div>
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

            {/* Meal Simulator - Interactive */}
            <div className="md:col-span-2">
              <MealSimulator
                foodName={metadata.title}
                baseCalories={item.dataPoints.macros.calories}
                baseProtein={item.dataPoints.macros.protein}
                baseCarbs={item.dataPoints.macros.carbs}
                baseFat={item.dataPoints.macros.fat}
              />
            </div>
          </>
        )}
      </div>

      {/* Affiliate Widget (Contextual Inteligente) */}
      <AffiliateOffer
        category={getAffiliateCategory(
          item.type,
          isFipeItem(item) ? item.dataPoints.currentPrice : undefined,
          isTacoItem(item) ? item.dataPoints.macros.carbs : undefined
        )}
        itemValue={isFipeItem(item) ? item.dataPoints.currentPrice : undefined}
        itemName={metadata.title}
        isLowCarb={isTacoItem(item) && item.dataPoints.macros.carbs < 5}
      />

      {/* Source Citation */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-xs text-foreground-muted">
          <strong>Fonte:</strong> {metadata.source} • Os dados apresentados são
          de fontes oficiais e públicas. Este portal não se responsabiliza por
          decisões tomadas com base nas informações fornecidas.
        </p>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
