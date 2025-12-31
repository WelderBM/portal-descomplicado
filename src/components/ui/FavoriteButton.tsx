// components/ui/FavoriteButton.tsx - Botão de Favoritar
"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { PortalItem } from "@/types/portal";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/favorites";

interface FavoriteButtonProps {
  item: PortalItem;
  onToggle?: (isFavorited: boolean) => void;
}

export function FavoriteButton({ item, onToggle }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(item.id));
  }, [item.id]);

  const handleToggle = () => {
    const newState = !favorited;

    if (newState) {
      const success = addFavorite(item);
      if (success) {
        setFavorited(true);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
        onToggle?.(true);
      }
    } else {
      const success = removeFavorite(item.id);
      if (success) {
        setFavorited(false);
        onToggle?.(false);
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`group relative flex items-center gap-2 rounded-lg border px-4 py-2 transition-all ${
        favorited
          ? "border-danger bg-danger/10 text-danger"
          : "border-border bg-surface hover:border-border-hover"
      }`}
      title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        className={`h-5 w-5 transition-all ${favorited ? "fill-current" : ""} ${
          isAnimating ? "scale-125" : "scale-100"
        }`}
      />
      <span className="text-sm font-medium">
        {favorited ? "Favoritado" : "Favoritar"}
      </span>

      {/* Animação de partículas */}
      {isAnimating && (
        <>
          <div className="absolute inset-0 animate-ping rounded-lg bg-danger/20" />
          <div className="absolute -top-1 -right-1 h-3 w-3 animate-bounce rounded-full bg-danger" />
        </>
      )}
    </button>
  );
}
