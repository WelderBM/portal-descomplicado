// app/minha-garagem/page.tsx - Página de Favoritos FIPE
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFavoritesByType, removeFavorite } from "@/lib/favorites";
import { Car, Trash2, ArrowLeft } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

export default function MinhaGaragemPage() {
  const [favorites, setFavorites] = useState<
    Array<{ id: string; slug: string; title: string; savedAt: string }>
  >([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setFavorites(getFavoritesByType("fipe"));
  }, []);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavoritesByType("fipe"));
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
          <Car className="h-4 w-4 text-success" />
          <span className="text-foreground-muted">Meus Veículos Favoritos</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Minha Garagem
        </h1>

        <p className="text-lg text-foreground-muted">
          Veículos que você salvou para consultar depois
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <div className="card">
          <p className="text-sm text-foreground-muted">Total de Veículos</p>
          <p className="text-3xl font-bold">{favorites.length}</p>
        </div>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="card text-center py-12">
          <Car className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sua garagem está vazia</h3>
          <p className="text-foreground-muted mb-4">
            Adicione veículos aos favoritos para consultá-los rapidamente
          </p>
          <Link
            href="/fipe"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Car className="h-4 w-4" />
            Explorar Veículos
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
                  title="Remover da garagem"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <Link
                href={`/fipe/${fav.slug}`}
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
          message="Veículo removido da garagem"
          type="info"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
