// app/meu-diario/page.tsx - Página de Favoritos TACO
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFavoritesByType, removeFavorite } from "@/lib/favorites";
import { Apple, Trash2, ArrowLeft } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

export default function MeuDiarioPage() {
  const [favorites, setFavorites] = useState<
    Array<{ id: string; slug: string; title: string; savedAt: string }>
  >([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setFavorites(getFavoritesByType("taco"));
  }, []);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavoritesByType("taco"));
    setShowToast(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Home
        </Link>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm">
          <Apple className="h-4 w-4 text-info" />
          <span className="text-foreground-muted">
            Meus Alimentos Favoritos
          </span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">Meu Diário</h1>

        <p className="text-lg text-foreground-muted">
          Alimentos que você salvou para consultar depois
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <div className="card">
          <p className="text-sm text-foreground-muted">Total de Alimentos</p>
          <p className="text-3xl font-bold">{favorites.length}</p>
        </div>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="card text-center py-12">
          <Apple className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Seu diário está vazio</h3>
          <p className="text-foreground-muted mb-4">
            Adicione alimentos aos favoritos para consultá-los rapidamente
          </p>
          <Link
            href="/nutricao"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Apple className="h-4 w-4" />
            Explorar Alimentos
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div key={fav.id} className="card group">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{fav.title}</h3>
                  <p className="text-xs text-foreground-muted">
                    Salvo em {new Date(fav.savedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(fav.id)}
                  className="text-foreground-muted hover:text-danger transition-colors"
                  title="Remover do diário"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <Link
                href={`/nutricao/${fav.slug}`}
                className="btn btn-primary w-full"
              >
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <Toast
          message="Alimento removido do diário"
          type="info"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
