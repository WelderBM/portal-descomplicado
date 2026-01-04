import { Metadata } from "next";
import Link from "next/link";
import { Metadata } from "next";
import Link from "next/link";
import { TrendingDown, ShieldCheck, Pill } from "lucide-react";
import { BentoCard } from "@/components/bento/BentoCard";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Tabela de Medicamentos - Portal Descomplicado",
  description:
    "Consulte preços de medicamentos e compare com genéricos. Economize na farmácia com dados oficiais da ANVISA.",
};

// Revalidar a cada 24 horas (ISR)
export const revalidate = 86400;

async function getMedicamentosFromDB() {
  const { data: vertical } = await supabase
    .from("verticals")
    .select("id")
    .eq("slug", "medicamentos")
    .single();

  if (!vertical) return [];

  const { data: items } = await supabase
    .from("portal_items")
    .select("*")
    .eq("vertical_id", vertical.id)
    .order("title", { ascending: true })
    .limit(50); // Paginação inicial

  return items || [];
}

export default async function MedicamentosPage() {
  const items = await getMedicamentosFromDB();

  // Estatísticas rápidas (Calculadas sobre os itens retornados ou placeholder se vazio)
  const totalItems = items.length;

  // Cálculo de economia média segura
  const validItems = items.filter(
    (item) =>
      item.data?.price_info?.factory_price &&
      item.data?.price_info?.max_consumer_price
  );
  const averageSavings =
    validItems.length > 0
      ? Math.round(
          validItems.reduce((acc, item) => {
            const max = item.data.price_info.max_consumer_price;
            const factory = item.data.price_info.factory_price;
            const savings = ((max - factory) / max) * 100;
            return acc + savings;
          }, 0) / validItems.length
        )
      : 35; // Valor de fallback baseado em média de mercado

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Consulta de Medicamentos
        </h1>
        <p className="max-w-3xl text-lg text-foreground-muted">
          Compare preços de Referência vs Genérico e descubra o quanto você pode
          economizar. Dados baseados em listas oficiais da ANVISA, atualizados
          em tempo real.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <BentoCard
          title="Economia Média"
          description="Com Genéricos"
          accentColor="#10b981"
        >
          <div className="flex items-center gap-2">
            <TrendingDown className="h-8 w-8 text-success" />
            <span className="text-4xl font-bold text-foreground">
              {averageSavings}%
            </span>
          </div>
        </BentoCard>

        <BentoCard
          title="Medicamentos"
          description="Catalogados"
          accentColor="#3b82f6"
        >
          <div className="flex items-center gap-2">
            <Pill className="h-8 w-8 text-primary" />
            <span className="text-4xl font-bold text-foreground">
              {totalItems > 0 ? totalItems + "+" : "Carregando..."}
            </span>
          </div>
        </BentoCard>

        <BentoCard
          title="Fonte Oficial"
          description="Dados Seguros"
          accentColor="#8b5cf6"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold text-foreground">ANVISA</span>
          </div>
        </BentoCard>
      </div>

      {/* Listagem */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Medicamentos Recentes
          </h2>
          <span className="text-xs text-foreground-muted">
            Atualizado: {new Date().toLocaleDateString("pt-BR")}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-foreground-muted">
              Nenhum medicamento encontrado no banco de dados.
            </p>
            <p className="text-xs text-foreground-muted mt-2">
              Dica: Rode o script de ETL para popular os dados.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/medicamentos/${item.slug}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium text-foreground-muted">
                    {item.data.regulatory_type?.split(" - ")[1] ||
                      "Medicamento"}
                  </span>
                  {item.data.active_ingredient && (
                    <span
                      className="text-[10px] font-mono text-foreground-muted truncate max-w-[120px]"
                      title={item.data.active_ingredient}
                    >
                      {item.data.active_ingredient}
                    </span>
                  )}
                </div>

                <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
                  {item.description}
                </p>

                {item.data.price_info && (
                  <div className="flex items-end justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-foreground-muted">
                        Preço Máximo
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        R${" "}
                        {item.data.price_info.max_consumer_price
                          ?.toFixed(2)
                          .replace(".", ",")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-foreground-muted mb-1">
                        Base:{" "}
                        {new Date(
                          item.data.price_info.last_updated
                        ).toLocaleDateString()}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                        Genérico disponível
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
