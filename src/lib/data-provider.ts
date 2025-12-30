// lib/data-provider.ts - Provedor de Dados do Portal

import Fuse from "fuse.js";
import { PortalItem, FipeItem, TacoItem } from "@/types/portal";
import fipeData from "@/data/fipe.json";
import tacoData from "@/data/taco.json";

/**
 * Obtém todos os itens de todas as verticais
 */
export function getAllItems(): PortalItem[] {
  return [...fipeData, ...tacoData] as PortalItem[];
}

/**
 * Obtém um item específico pelo slug
 */
export function getItemBySlug(slug: string): PortalItem | null {
  const allItems = getAllItems();
  return allItems.find((item) => item.slug === slug) || null;
}

/**
 * Obtém todos os itens FIPE
 */
export function getFipeItems(): FipeItem[] {
  return fipeData as FipeItem[];
}

/**
 * Obtém todos os itens TACO
 */
export function getTacoItems(): TacoItem[] {
  return tacoData as TacoItem[];
}

/**
 * Busca avançada com Fuse.js (Fuzzy Search)
 * Permite encontrar itens mesmo com erros de digitação
 */
export function searchItems(query: string): PortalItem[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const allItems = getAllItems();

  // Configuração do Fuse.js para busca fuzzy
  const fuse = new Fuse(allItems, {
    keys: [
      { name: "metadata.title", weight: 2 }, // Prioriza título
      { name: "metadata.description", weight: 1.5 },
      { name: "slug", weight: 1.2 },
      { name: "type", weight: 1 }, // Categoria
      { name: "insights.summary", weight: 0.8 },
      { name: "insights.highlights", weight: 0.5 },
    ],
    threshold: 0.4, // 0 = match exato, 1 = match qualquer coisa
    includeScore: true,
    minMatchCharLength: 2,
  });

  const results = fuse.search(query);
  return results.map((result) => result.item);
}

/**
 * Obtém itens relacionados baseado no tipo
 */
export function getRelatedItems(
  currentItem: PortalItem,
  limit: number = 3
): PortalItem[] {
  const allItems = getAllItems();

  return allItems
    .filter(
      (item) => item.type === currentItem.type && item.id !== currentItem.id
    )
    .slice(0, limit);
}

/**
 * Gera todos os slugs para geração estática de páginas
 */
export function getAllSlugs(): string[] {
  return getAllItems().map((item) => item.slug);
}
