import Link from "next/link";
import { Apple } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Tabela TACO - Nutrição de Alimentos | Portal Descomplicado",
  description:
    "Consulte informações nutricionais completas da Tabela TACO UNICAMP. Macros, micronutrientes e valores diários de referência.",
};

export const revalidate = 86400; // 24h ISR

async function getTacoItemsFromDB() {
  const { data: vertical } = await supabase
    .from("verticals")
    .select("id")
    .eq("slug", "nutricao")
    .single();

  if (!vertical) return [];

  const { data: items } = await supabase
    .from("portal_items")
    .select("*")
    .eq("vertical_id", vertical.id)
    .order("title", { ascending: true })
    .limit(50);

  return items || [];
}

export default async function NutricaoListPage() {
  const tacoItems = await getTacoItemsFromDB();

  // Helper Stats
  const totalItems = tacoItems.length;

  // Safe Reduce Helper
  const safeReduce = (field: string) => {
    if (totalItems === 0) return 0;
    const sum = tacoItems.reduce(
      (acc, item) => acc + (item.data?.macros?.[field] || 0),
      0
    );
    return Math.round(sum / totalItems);
  };

  const avgCalories = safeReduce("calories");
  const avgProtein = safeReduce("protein");

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
          <p className="text-3xl font-bold">{totalItems}</p>
        </div>
        <div className="card">
          <p className="text-sm text-foreground-muted">Média de Calorias</p>
          <p className="text-3xl font-bold">
            {avgCalories}
            <span className="text-sm font-normal text-foreground-muted ml-1">
              kcal
            </span>
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-foreground-muted">Média de Proteínas</p>
          <p className="text-3xl font-bold">
            {avgProtein}
            <span className="text-sm font-normal text-foreground-muted ml-1">
              g
            </span>
          </p>
        </div>
      </div>

      {/* Food List */}
      {tacoItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center col-span-full">
          <p className="text-foreground-muted">
            Nenhum alimento encontrado no banco de dados.
          </p>
          <p className="text-xs text-foreground-muted mt-2">
            Dica: Rode o script de ETL (taco-pipeline.ts) para popular os dados.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tacoItems.map((item) => {
            const macros = item.data.macros || {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
            };

            return (
              <Link
                key={item.id}
                href={`/nutricao/${item.slug}`}
                className="card group"
              >
                {/* Header */}
                <div className="mb-4 flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#22d3ee" }} // Cyan for TACO
                  />
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                    TACO
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-lg font-semibold group-hover:text-info transition-colors line-clamp-1">
                  {item.title}
                </h3>

                {/* Macros Grid */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-foreground-muted">Calorias</p>
                    <p className="text-lg font-bold">
                      {macros.calories}
                      <span className="text-xs font-normal text-foreground-muted ml-1">
                        kcal
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted">Proteínas</p>
                    <p className="text-lg font-bold">
                      {macros.protein}
                      <span className="text-xs font-normal text-foreground-muted ml-1">
                        g
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted">
                      Carboidratos
                    </p>
                    <p className="text-lg font-bold">
                      {macros.carbs}
                      <span className="text-xs font-normal text-foreground-muted ml-1">
                        g
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted">Gorduras</p>
                    <p className="text-lg font-bold">
                      {macros.fat}
                      <span className="text-xs font-normal text-foreground-muted ml-1">
                        g
                      </span>
                    </p>
                  </div>
                </div>

                {/* Highlights (Category) */}
                <div className="space-y-1">
                  <p className="text-xs text-foreground-muted">
                    • {item.data.category}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center gap-2 text-xs text-foreground-muted">
                  <span>Por {item.data.serving_size}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
