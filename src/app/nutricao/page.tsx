// app/nutricao/page.tsx - Listagem de Alimentos TACO
import Link from "next/link";
import { getTacoItems } from "@/lib/data-provider";
import { Apple } from "lucide-react";

export const metadata = {
  title: "Tabela TACO - Nutrição de Alimentos | Portal Descomplicado",
  description:
    "Consulte informações nutricionais completas da Tabela TACO UNICAMP. Macros, micronutrientes e valores diários de referência.",
};

export default function NutricaoListPage() {
  const tacoItems = getTacoItems();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm">
          <Apple className="h-4 w-4 text-info" />
          <span className="text-foreground-muted">
            TACO - Tabela Brasileira de Composição de Alimentos (UNICAMP)
          </span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Informações Nutricionais
        </h1>

        <p className="max-w-3xl text-lg text-foreground-muted">
          Consulte a composição nutricional completa de alimentos brasileiros
          com base na Tabela TACO da UNICAMP. Macros, micronutrientes e valores
          diários.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm text-foreground-muted">Total de Alimentos</p>
          <p className="text-3xl font-bold">{tacoItems.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-foreground-muted">Média de Calorias</p>
          <p className="text-3xl font-bold">
            {Math.round(
              tacoItems.reduce(
                (acc, item) => acc + item.dataPoints.macros.calories,
                0
              ) / tacoItems.length
            )}
            <span className="text-sm font-normal text-foreground-muted ml-1">
              kcal
            </span>
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-foreground-muted">Média de Proteínas</p>
          <p className="text-3xl font-bold">
            {(
              tacoItems.reduce(
                (acc, item) => acc + item.dataPoints.macros.protein,
                0
              ) / tacoItems.length
            ).toFixed(1)}
            <span className="text-sm font-normal text-foreground-muted ml-1">
              g
            </span>
          </p>
        </div>
      </div>

      {/* Food List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tacoItems.map((item) => (
          <Link
            key={item.id}
            href={`/nutricao/${item.slug}`}
            className="card group"
          >
            {/* Header */}
            <div className="mb-4 flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.visuals.accentColor }}
              />
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                TACO
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-3 text-lg font-semibold group-hover:text-info transition-colors">
              {item.metadata.title}
            </h3>

            {/* Macros Grid */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-foreground-muted">Calorias</p>
                <p className="text-lg font-bold">
                  {item.dataPoints.macros.calories}
                  <span className="text-xs font-normal text-foreground-muted ml-1">
                    kcal
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted">Proteínas</p>
                <p className="text-lg font-bold">
                  {item.dataPoints.macros.protein}
                  <span className="text-xs font-normal text-foreground-muted ml-1">
                    g
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted">Carboidratos</p>
                <p className="text-lg font-bold">
                  {item.dataPoints.macros.carbs}
                  <span className="text-xs font-normal text-foreground-muted ml-1">
                    g
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted">Gorduras</p>
                <p className="text-lg font-bold">
                  {item.dataPoints.macros.fat}
                  <span className="text-xs font-normal text-foreground-muted ml-1">
                    g
                  </span>
                </p>
              </div>
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
              <span>Por {item.dataPoints.servingSize}</span>
              <span>•</span>
              <span>{item.metadata.updatedAt}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
