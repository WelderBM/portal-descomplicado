import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { HeaderTile } from "@/components/tiles/HeaderTile";
import { PriceTile } from "@/components/tiles/PriceTile";
import { NutritionTile } from "@/components/tiles/NutritionTile";

// ISR Time: 24h
export const revalidate = 86400;

// Gerar rotas estáticas para os itens mais populares (Top 100 de cada vertical)
// Isso garante performance instantânea para o que importa
export async function generateStaticParams() {
  const { data: items } = await supabase
    .from("portal_items")
    .select("slug, verticals!inner(slug)")
    .limit(100);

  if (!items) return [];

  return items.map((item: any) => ({
    vertical: item.verticals.slug,
    slug: item.slug,
  }));
}

interface PageProps {
  params: Promise<{
    vertical: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { vertical, slug } = await params;
  const { data: item } = await supabase
    .from("portal_items")
    .select("title, description")
    .eq("slug", slug)
    // Precisamos filtrar pela vertical também, conceitualmente, mas o slug é único por vertical no banco
    .single();

  if (!item) return {};

  return {
    title: `${item.title} | Portal Descomplicado`,
    description: item.description,
  };
}

export default async function UniversalItemPage({ params }: PageProps) {
  const { vertical, slug } = await params;

  // 1. Buscar dados universais
  const { data: item, error } = await supabase
    .from("portal_items")
    .select(
      `
      *,
      verticals (
        name,
        ui_config
      )
    `
    )
    .eq("verticals.slug", vertical) // Join implícito no Supabase Filter
    .eq("slug", slug)
    .single();

  if (error || !item) {
    notFound();
  }

  // 2. Trait System: Decidir o que renderizar
  // O campo 'verticals.ui_config' diz QUAIS tiles essa vertical suporta
  // O campo 'item.data' fornece os dados para esses tiles
  const supportedTiles = item.verticals.ui_config || [];

  // Data Extraction Helpers
  const priceData = item.data.price_info;
  const nutritionData = item.data.macros;
  const depreciationData = item.data.depreciation_info;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      {/* 1. Universal Header Tile */}
      <HeaderTile
        title={item.title}
        description={item.description}
        badge={item.verticals.name}
        updatedAt={item.updated_at}
        source="Dados Oficiais"
      />

      {/* 2. Dynamic Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PRICE TILE: Renderiza apenas se tiver preço E a vertical suportar */}
        {supportedTiles.includes("price_chart") && priceData && (
          <PriceTile data={priceData} depreciation={depreciationData} />
        )}

        {/* PRICE COMPARISON TILE (Medicamentos) - Reusando PriceTile por enquanto */}
        {supportedTiles.includes("price_comparison") && priceData && (
          <div className="md:col-span-1">
            <PriceTile
              data={{
                ...priceData,
                current_price: priceData.max_consumer_price,
              }}
              depreciation={{ trend: "down", percentage: 35 }} // Mock de economia
            />
          </div>
        )}

        {/* NUTRITION TILE: Renderiza apenas se tiver macros */}
        {supportedTiles.includes("nutrition_facts") && nutritionData && (
          <NutritionTile
            macros={nutritionData}
            servingSize={item.data.serving_size}
          />
        )}

        {/* FALLBACK INFO TILE (Para debug ou dados genéricos) */}
        <div className="col-span-1 md:col-span-2 p-6 rounded-lg border border-border bg-surface">
          <h3 className="font-semibold mb-4">Detalhes Técnicos</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(item.data).map(([key, value]) => {
              if (typeof value === "object" || key === "ui_traits") return null;
              return (
                <div key={key}>
                  <dt className="text-xs text-foreground-muted uppercase">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="font-medium text-foreground">
                    {String(value)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
}
