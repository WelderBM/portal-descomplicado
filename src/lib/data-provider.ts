// lib/data-provider.ts - Provedor de Dados do Portal

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
 * Busca semântica simples (pode ser expandida com Fuse.js no futuro)
 */
export function searchItems(query: string): PortalItem[] {
  const allItems = getAllItems();
  const lowerQuery = query.toLowerCase();

  return allItems.filter(
    (item) =>
      item.metadata.title.toLowerCase().includes(lowerQuery) ||
      item.metadata.description.toLowerCase().includes(lowerQuery) ||
      item.slug.toLowerCase().includes(lowerQuery)
  );
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
