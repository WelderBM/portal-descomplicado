// app/comparar/[tipo]/page.tsx - Sistema de Comparação
"use client";

import { use, useState } from "react";
import { getFipeItems, getTacoItems } from "@/lib/data-provider";
import { FipeItem, TacoItem } from "@/types/portal";
import { formatCurrency } from "@/lib/calculators";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    tipo: string;
  }>;
}

export default function ComparePage({ params }: PageProps) {
  const { tipo } = use(params);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Busca itens baseado no tipo
  const items =
    tipo === "fipe"
      ? (getFipeItems() as (FipeItem | TacoItem)[])
      : tipo === "taco"
      ? (getTacoItems() as (FipeItem | TacoItem)[])
      : [];

  const isFipe = tipo === "fipe";

  // Seleciona/deseleciona item
  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else if (selectedItems.length < 2) {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Itens selecionados para comparação
  const item1 = items.find((i) => i.id === selectedItems[0]);
  const item2 = items.find((i) => i.id === selectedItems[1]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${tipo}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para {isFipe ? "FIPE" : "Nutrição"}
        </Link>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Comparar {isFipe ? "Veículos" : "Alimentos"}
        </h1>

        <p className="text-lg text-foreground-muted">
          Selecione até 2 itens para comparar lado a lado
        </p>
      </div>

      {/* Selection Grid */}
      {selectedItems.length < 2 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">
            Selecione os itens ({selectedItems.length}/2)
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`card text-left transition-all ${
                  selectedItems.includes(item.id)
                    ? "border-success bg-success/10"
                    : "hover:border-border-hover"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    {item.metadata.title}
                  </h3>
                  {selectedItems.includes(item.id) && (
                    <Check className="h-5 w-5 text-success" />
                  )}
                </div>
                <p className="text-sm text-foreground-muted line-clamp-2">
                  {item.metadata.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {item1 && item2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Comparação</h2>
            <button
              onClick={() => setSelectedItems([])}
              className="text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              Limpar seleção
            </button>
          </div>

          {/* FIPE Comparison */}
          {isFipe && item1.type === "fipe" && item2.type === "fipe" && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-sm font-medium text-foreground-muted">
                      Característica
                    </th>
                    <th className="p-4 text-center">
                      <div className="font-semibold text-lg">
                        {item1.metadata.title}
                      </div>
                    </th>
                    <th className="p-4 text-center">
                      <div className="font-semibold text-lg">
                        {item2.metadata.title}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Preço Atual */}
                  <tr className="border-b border-border hover:bg-surface-elevated transition-colors">
                    <td className="p-4 font-medium">Preço Atual</td>
                    <td className="p-4 text-center">
                      <span className="text-lg font-bold">
                        {formatCurrency(item1.dataPoints.currentPrice)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-lg font-bold">
                        {formatCurrency(item2.dataPoints.currentPrice)}
                      </span>
                    </td>
                  </tr>

                  {/* Tendência */}
                  <tr className="border-b border-border hover:bg-surface-elevated transition-colors">
                    <td className="p-4 font-medium">Tendência</td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        {item1.dataPoints.depreciationInfo.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : item1.dataPoints.depreciationInfo.trend ===
                          "down" ? (
                          <TrendingDown className="h-4 w-4 text-danger" />
                        ) : (
                          <Minus className="h-4 w-4 text-neutral" />
                        )}
                        <span>
                          {Math.abs(
                            item1.dataPoints.depreciationInfo.percentage
                          )}
                          %
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        {item2.dataPoints.depreciationInfo.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : item2.dataPoints.depreciationInfo.trend ===
                          "down" ? (
                          <TrendingDown className="h-4 w-4 text-danger" />
                        ) : (
                          <Minus className="h-4 w-4 text-neutral" />
                        )}
                        <span>
                          {Math.abs(
                            item2.dataPoints.depreciationInfo.percentage
                          )}
                          %
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* IPVA */}
                  <tr className="border-b border-border hover:bg-surface-elevated transition-colors">
                    <td className="p-4 font-medium">IPVA Estimado (SP)</td>
                    <td className="p-4 text-center">
                      {formatCurrency(item1.dataPoints.ipvaEstimated)}
                    </td>
                    <td className="p-4 text-center">
                      {formatCurrency(item2.dataPoints.ipvaEstimated)}
                    </td>
                  </tr>

                  {/* Vencedor */}
                  <tr className="bg-surface-elevated">
                    <td className="p-4 font-medium">Melhor Custo-Benefício</td>
                    <td className="p-4 text-center">
                      {item1.dataPoints.currentPrice <
                        item2.dataPoints.currentPrice &&
                      item1.dataPoints.depreciationInfo.trend !== "down" ? (
                        <Check className="h-6 w-6 text-success mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-foreground-muted mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {item2.dataPoints.currentPrice <
                        item1.dataPoints.currentPrice &&
                      item2.dataPoints.depreciationInfo.trend !== "down" ? (
                        <Check className="h-6 w-6 text-success mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-foreground-muted mx-auto" />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TACO Comparison */}
          {!isFipe && item1.type === "taco" && item2.type === "taco" && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-sm font-medium text-foreground-muted">
                      Nutriente
                    </th>
                    <th className="p-4 text-center">
                      <div className="font-semibold text-lg">
                        {item1.metadata.title}
                      </div>
                      <div className="text-xs text-foreground-muted">
                        {item1.dataPoints.servingSize}
                      </div>
                    </th>
                    <th className="p-4 text-center">
                      <div className="font-semibold text-lg">
                        {item2.metadata.title}
                      </div>
                      <div className="text-xs text-foreground-muted">
                        {item2.dataPoints.servingSize}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Calorias */}
                  <tr className="border-b border-border hover:bg-surface-elevated transition-colors">
                    <td className="p-4 font-medium">Calorias</td>
                    <td className="p-4 text-center">
                      <span className="text-lg font-bold">
                        {item1.dataPoints.macros.calories}
                      </span>
                      <span className="text-sm text-foreground-muted ml-1">
                        kcal
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-lg font-bold">
                        {item2.dataPoints.macros.calories}
                      </span>
                      <span className="text-sm text-foreground-muted ml-1">
                        kcal
                      </span>
                    </td>
                  </tr>

                  {/* Proteínas */}
                  <tr className="border-b border-border hover:bg-surface-elevated transition-colors">
                    <td className="p-4 font-medium">Proteínas</td>
                    <td className="p-4 text-center">
                      <span className="text-lg font-bold">
                        {item1.dataPoints.macros.protein}g
                      </span>
                      {item1.dataPoints.macros.protein >
                        item2.dataPoints.macros.protein && (
                        <Check className="inline h-4 w-4 text-success ml-2" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-lg font-bold">
                        {item2.dataPoints.macros.protein}g
                      </span>
                      {item2.dataPoints.macros.protein >
                        item1.dataPoints.macros.protein && (
                        <Check className="inline h-4 w-4 text-success ml-2" />
                      )}
                    </td>
                  </tr>

                  {/* Carboidratos */}
                  <tr className="border-b border-border hover:bg-surface-elevated transition-colors">
                    <td className="p-4 font-medium">Carboidratos</td>
                    <td className="p-4 text-center">
                      {item1.dataPoints.macros.carbs}g
                    </td>
                    <td className="p-4 text-center">
                      {item2.dataPoints.macros.carbs}g
                    </td>
                  </tr>

                  {/* Gorduras */}
                  <tr className="border-b border-border hover:bg-surface-elevated transition-colors">
                    <td className="p-4 font-medium">Gorduras</td>
                    <td className="p-4 text-center">
                      {item1.dataPoints.macros.fat}g
                    </td>
                    <td className="p-4 text-center">
                      {item2.dataPoints.macros.fat}g
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
