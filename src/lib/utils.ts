// lib/utils.ts - Utilitários Gerais

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes CSS com suporte a Tailwind
 * Útil para componentes condicionais
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
