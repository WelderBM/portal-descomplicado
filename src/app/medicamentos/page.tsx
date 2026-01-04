import { Metadata } from "next";
import Link from "next/link";
import { getMedicamentoItems } from "@/lib/data-provider";
import { TrendingDown, ShieldCheck, Pill } from "lucide-react";
import { BentoCard } from "@/components/bento/BentoCard";

export const metadata: Metadata = {
  title: "Tabela de Medicamentos - Portal Descomplicado",
  description:
    "Consulte preços de medicamentos e compare com genéricos. Economize na farmácia com dados oficiais da ANVISA.",
};

export default function MedicamentosPage() {
  const items = getMedicamentoItems();

  // Estatísticas rápidas
  const totalItems = items.length;
  const averageSavings = Math.round(
    items.reduce(
      (acc, item) => acc + item.dataPoints.prices.poupancaPorcentagem,
      0
    ) / totalItems
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Consulta de Medicamentos
        </h1>
        <p className="max-w-3xl text-lg text-foreground-muted">
          Compare preços de Referência vs Genérico e descubra o quanto você pode
          economizar. Dados baseados em listas oficiais da ANVISA.
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
              {totalItems}
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
        <h2 className="text-2xl font-bold text-foreground">
          Medicamentos Populares
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/medicamentos/${item.slug}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium text-foreground-muted">
                  {item.dataPoints.classeTerapeutica}
                </span>
                <span
                  className="text-xs font-bold uppercase"
                  style={{
                    color:
                      item.dataPoints.tarja === "vermelha"
                        ? "#ef4444"
                        : item.dataPoints.tarja === "livre"
                        ? "#10b981"
                        : "#f59e0b",
                  }}
                >
                  Tarja {item.dataPoints.tarja}
                </span>
              </div>

              <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary">
                {item.dataPoints.principioAtivo}
              </h3>
              <p className="text-sm text-foreground-muted mb-4">
                {item.dataPoints.apresentacao}
              </p>

              <div className="flex items-end justify-between border-t border-border pt-4">
                <div>
                  <p className="text-xs text-foreground-muted">
                    Genérico Médio
                  </p>
                  <p className="text-lg font-bold text-success">
                    R${" "}
                    {item.dataPoints.prices.genericoMedio
                      .toFixed(2)
                      .replace(".", ",")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                    -{item.dataPoints.prices.poupancaPorcentagem}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
