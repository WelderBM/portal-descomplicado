// lib/calculators.ts - Funções de Cálculo Compartilhadas

/**
 * Calcula IPVA baseado no valor do veículo
 * @param vehicleValue Valor do veículo em reais
 * @param state Estado (alíquota varia por estado)
 * @returns Valor estimado do IPVA
 */
export function calculateIPVA(
  vehicleValue: number,
  state: string = "SP"
): number {
  // Alíquotas por estado (exemplo simplificado)
  const rates: Record<string, number> = {
    SP: 0.04, // 4%
    RJ: 0.04, // 4%
    MG: 0.04, // 4%
    RS: 0.03, // 3%
    PR: 0.035, // 3.5%
  };

  const rate = rates[state] || 0.04;
  return Math.round(vehicleValue * rate);
}

/**
 * Calcula a depreciação percentual entre dois valores
 */
export function calculateDepreciation(
  oldValue: number,
  newValue: number
): number {
  return Number((((newValue - oldValue) / oldValue) * 100).toFixed(2));
}

/**
 * Calcula IMC (Índice de Massa Corporal)
 */
export function calculateIMC(weight: number, height: number): number {
  return Number((weight / (height * height)).toFixed(2));
}

/**
 * Calcula gasto calórico basal (TMB - Taxa Metabólica Basal)
 * Fórmula de Harris-Benedict
 */
export function calculateTMB(
  weight: number,
  height: number,
  age: number,
  gender: "M" | "F"
): number {
  if (gender === "M") {
    return Math.round(
      88.362 + 13.397 * weight + 4.799 * height * 100 - 5.677 * age
    );
  } else {
    return Math.round(
      447.593 + 9.247 * weight + 3.098 * height * 100 - 4.33 * age
    );
  }
}

/**
 * Calcula necessidade calórica total baseada no nível de atividade
 */
export function calculateTotalCalories(
  tmb: number,
  activityLevel: string
): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(tmb * (multipliers[activityLevel] || 1.2));
}

/**
 * Formata valores monetários em Real Brasileiro
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata números com separadores de milhar
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

/**
 * Calcula a tendência de uma série temporal
 * Retorna 'up', 'down' ou 'stable'
 */
export function calculateTrend(values: number[]): "up" | "down" | "stable" {
  if (values.length < 2) return "stable";

  const first = values[0];
  const last = values[values.length - 1];
  const change = ((last - first) / first) * 100;

  if (change > 2) return "up";
  if (change < -2) return "down";
  return "stable";
}
