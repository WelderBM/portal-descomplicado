// types/portal.ts - Sistema de Tipos Universal do Portal Descomplicado

export type VerticalType = "fipe" | "taco" | "medicamentos" | "calc_geral";

/**
 * Interface Base - O Coração do Portal
 * Toda calculadora/consulta deve seguir este contrato
 */
export interface BaseItem {
  id: string;
  slug: string; // URL amigável para SEO
  type: VerticalType;
  metadata: {
    title: string;
    description: string; // Para SEO Programático
    source: string; // Ex: "FIPE" ou "UNICAMP/TACO"
    updatedAt: string;
  };
  visuals: {
    layout: "bento" | "linear";
    accentColor: string; // Cor semântica (ex: verde para saudável)
  };
  insights: {
    summary: string; // O "Jornalismo Utilitário"
    highlights: string[]; // Pontos chave de decisão
  };
  affiliate?: {
    category: string;
    cta: string;
    url: string;
  };
}

/**
 * Vertical Automotiva (FIPE)
 * Focada em histórico de preços e custos acessórios
 */
export interface FipeItem extends BaseItem {
  type: "fipe";
  dataPoints: {
    currentPrice: number;
    priceHistory: { month: string; value: number }[]; // Para o gráfico de linha
    ipvaEstimated: number;
    depreciationInfo: {
      percentage: number;
      trend: "up" | "down" | "stable"; // Tendência de mercado
    };
  };
}

/**
 * Vertical de Nutrição (TACO)
 * Focada em densidade nutricional e micronutrientes
 */
export interface TacoItem extends BaseItem {
  type: "taco";
  dataPoints: {
    servingSize: string; // Ex: "100g"
    macros: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    micros: {
      name: string;
      value: number;
      unit: string;
      dailyValuePercentage: number; // A "tradução" para o usuário
    }[];
  };
}

/**
 * Vertical de Medicamentos (ANVISA)
 * Focada em comparação de preços (Genérico vs Referência) e economia
 */
export interface MedicamentoItem extends BaseItem {
  type: "medicamentos";
  dataPoints: {
    principioAtivo: string;
    laboratorio: string;
    registroAnvisa: string;
    classeTerapeutica: string;
    apresentacao: string; // Ex: "500mg - 30 comprimidos"
    tarja: "livre" | "amarela" | "vermelha" | "preta";
    prices: {
      referencia: number;
      genericoMedio: number;
      poupancaReal: number; // Valor economizado em R$
      poupancaPorcentagem: number; // % de economia
    };
  };
}

/**
 * Tipo Universal - O que o UniversalCalculator recebe
 * Usa Type Guards para decidir qual layout renderizar
 */
export type PortalItem = FipeItem | TacoItem | MedicamentoItem;

/**
 * Type Guards para segurança de tipos
 */
export function isFipeItem(item: PortalItem): item is FipeItem {
  return item.type === "fipe";
}

export function isTacoItem(item: PortalItem): item is TacoItem {
  return item.type === "taco";
}

export function isMedicamentoItem(item: PortalItem): item is MedicamentoItem {
  return item.type === "medicamentos";
}
