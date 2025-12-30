// app/fipe/page.tsx - Listagem de Veículos FIPE
import Link from "next/link";
import { getFipeItems } from "@/lib/data-provider";
import { Car, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const metadata = {
  title: "Tabela FIPE - Preços de Veículos | Portal Descomplicado",
  description:
    "Consulte preços de veículos da Tabela FIPE com histórico, tendências e estimativa de IPVA. Interface limpa e dados atualizados.",
};

export default function FipeListPage() {
  const fipeItems = getFipeItems();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm">
          <Car className="h-4 w-4 text-success" />
          <span className="text-foreground-muted">
            Tabela FIPE - Fundação Instituto de Pesquisas Econômicas
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Consulta de Veículos
            </h1>

            <p className="max-w-3xl text-lg text-foreground-muted">
              Consulte preços de mercado de veículos com histórico de
              valorização, tendências e estimativa de IPVA. Dados oficiais da
              Tabela FIPE.
            </p>
          </div>

          <Link
            href="/comparar/fipe"
            className="btn btn-primary flex items-center gap-2"
          >
            Comparar Veículos
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm text-foreground-muted">Total de Veículos</p>
          <p className="text-3xl font-bold">{fipeItems.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-foreground-muted">Em Valorização</p>
          <p className="text-3xl font-bold text-success">
            {
              fipeItems.filter(
                (item) => item.dataPoints.depreciationInfo.trend === "up"
              ).length
            }
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-foreground-muted">Em Depreciação</p>
          <p className="text-3xl font-bold text-danger">
            {
              fipeItems.filter(
                (item) => item.dataPoints.depreciationInfo.trend === "down"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fipeItems.map((item) => {
          const TrendIcon =
            item.dataPoints.depreciationInfo.trend === "up"
              ? TrendingUp
              : item.dataPoints.depreciationInfo.trend === "down"
              ? TrendingDown
              : Minus;

          const trendColor =
            item.dataPoints.depreciationInfo.trend === "up"
              ? "#10b981"
              : item.dataPoints.depreciationInfo.trend === "down"
              ? "#ef4444"
              : "#6b7280";

          return (
            <Link
              key={item.id}
              href={`/fipe/${item.slug}`}
              className="card group"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.visuals.accentColor }}
                  />
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                    FIPE
                  </span>
                </div>
                <TrendIcon className="h-5 w-5" style={{ color: trendColor }} />
              </div>

              {/* Title */}
              <h3 className="mb-2 text-lg font-semibold group-hover:text-success transition-colors">
                {item.metadata.title}
              </h3>

              {/* Price */}
              <div className="mb-3">
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.dataPoints.currentPrice)}
                </p>
                <p className="text-sm" style={{ color: trendColor }}>
                  {item.dataPoints.depreciationInfo.trend === "up"
                    ? "+"
                    : item.dataPoints.depreciationInfo.trend === "down"
                    ? "-"
                    : ""}
                  {Math.abs(item.dataPoints.depreciationInfo.percentage)}%{" "}
                  {item.dataPoints.depreciationInfo.trend === "up"
                    ? "valorização"
                    : item.dataPoints.depreciationInfo.trend === "down"
                    ? "depreciação"
                    : "estável"}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-1">
                {item.insights.highlights.slice(0, 2).map((highlight, idx) => (
                  <p key={idx} className="text-xs text-foreground-muted">
                    • {highlight}
                  </p>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center gap-2 text-xs text-foreground-muted">
                <span>{item.metadata.updatedAt}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
