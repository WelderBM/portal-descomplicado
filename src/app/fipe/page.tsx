// app/fipe/page.tsx - Listagem de Veículos FIPE
import Link from "next/link";
import { Car, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Tabela FIPE - Preços de Veículos | Portal Descomplicado",
  description:
    "Consulte preços de veículos da Tabela FIPE com histórico, tendências e estimativa de IPVA. Interface limpa e dados atualizados.",
};

export const revalidate = 86400; // 24h ISR

async function getFipeItemsFromDB() {
  const { data: vertical } = await supabase
    .from('verticals')
    .select('id')
    .eq('slug', 'fipe')
    .single();

  if (!vertical) return [];

  const { data: items } = await supabase
    .from('portal_items')
    .select('*')
    .eq('vertical_id', vertical.id)
    .order('title', { ascending: true })
    .limit(50);

  return items || [];
}

export default async function FipeListPage() {
  const fipeItems = await getFipeItemsFromDB();

  // Stats Counters
  const totalItems = fipeItems.length;
  const upTrendCount = fipeItems.filter(i => i.data?.depreciation_info?.trend === 'up').length;
  const downTrendCount = fipeItems.filter(i => i.data?.depreciation_info?.trend === 'down').length;

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
              Tabela FIPE, atualizados.
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
          <p className="text-3xl font-bold">{totalItems}</p>
        </div>
        <div className="card">
          <p className="text-sm text-foreground-muted">Em Valorização</p>
          <p className="text-3xl font-bold text-success">
            {upTrendCount}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-foreground-muted">Em Depreciação</p>
          <p className="text-3xl font-bold text-danger">
            {downTrendCount}
          </p>
        </div>
      </div>

      {/* Vehicle List */}
      {fipeItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center col-span-full">
            <p className="text-foreground-muted">Nenhum veículo encontrado no banco de dados.</p>
            <p className="text-xs text-foreground-muted mt-2">Dica: Rode o script de ETL (fipe-pipeline.ts) para popular os dados.</p>
          </div>
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fipeItems.map((item) => {
          const depreciation = item.data.depreciation_info || { trend: 'stable', percentage: 0 };
          
          const TrendIcon =
            depreciation.trend === "up"
              ? TrendingUp
              : depreciation.trend === "down"
              ? TrendingDown
              : Minus;

          const trendColor =
            depreciation.trend === "up"
              ? "#10b981"
              : depreciation.trend === "down"
              ? "#ef4444"
              : "#6b7280";

          return (
            <Link
              key={item.id}
              href={"/fipe/" + item.slug}
              className="card group"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: '#10b981' }} // FIPE default green
                  />
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                    FIPE
                  </span>
                </div>
                <TrendIcon className="h-5 w-5" style={{ color: trendColor }} />
              </div>

              {/* Title */}
              <h3 className="mb-2 text-lg font-semibold group-hover:text-success transition-colors">
                {item.title}
              </h3>

              {/* Price */}
              <div className="mb-3">
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.data.price_info?.current_price || 0)}
                </p>
                <p className="text-sm" style={{ color: trendColor }}>
                  {depreciation.trend === "up"
                    ? "+"
                    : depreciation.trend === "down"
                    ? "-"
                    : ""}
                  {Math.abs(depreciation.percentage)}%{" "}
                  {depreciation.trend === "up"
                    ? "valorização"
                    : depreciation.trend === "down"
                    ? "depreciação"
                    : "estável"}
                </p>
              </div>

              {/* Highlights (Quick Specs from Data) */}
              <div className="space-y-1">
                 <p className="text-xs text-foreground-muted">• Combustível: {item.data.fuel}</p>
                 <p className="text-xs text-foreground-muted">• Ano: {item.data.year}</p>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center gap-2 text-xs text-foreground-muted">
                <span>Ref: {item.data.reference_month}</span>
              </div>
            </Link>
          );
        })}
      </div>
      )}
    </div>
  );
}
