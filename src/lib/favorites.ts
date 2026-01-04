// lib/favorites.ts - Sistema de Favoritos com localStorage
"use client";

import { PortalItem } from "@/types/portal";

const FAVORITES_KEY = "portal_descomplicado_favorites";

export interface FavoriteItem {
  id: string;
  slug: string;
  type: "fipe" | "taco" | "medicamentos";
  title: string;
  savedAt: string;
}

/**
 * Obtém favoritos por tipo (FIPE, TACO ou Medicamentos)
 */
export function getFavoritesByType(
  type: "fipe" | "taco" | "medicamentos"
): FavoriteItem[] {
  return getFavorites().filter((fav) => fav.type === type);
}

/**
 * Obtém todos os favoritos do localStorage
 */
export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
    return [];
  }
}

/**
 * Adiciona um item aos favoritos
 */
export function addFavorite(item: PortalItem): boolean {
  if (typeof window === "undefined") return false;

  try {
    const favorites = getFavorites();

    // Verifica se já existe
    if (favorites.some((fav) => fav.id === item.id)) {
      return false;
    }

    const newFavorite: FavoriteItem = {
      id: item.id,
      slug: item.slug,
      type: item.type,
      title: item.metadata.title,
      savedAt: new Date().toISOString(),
    };

    favorites.push(newFavorite);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    return false;
  }
}

/**
 * Remove um item dos favoritos
 */
export function removeFavorite(id: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const favorites = getFavorites();
    const filtered = favorites.filter((fav) => fav.id !== id);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    return false;
  }
}

/**
 * Verifica se um item está nos favoritos
 */
export function isFavorite(id: string): boolean {
  if (typeof window === "undefined") return false;

  const favorites = getFavorites();
  return favorites.some((fav) => fav.id === id);
}

/**
 * Limpa todos os favoritos
 */
export function clearFavorites(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(FAVORITES_KEY);
}

/**
 * Conta total de favoritos
 */
export function getFavoritesCount(): number {
  return getFavorites().length;
}
