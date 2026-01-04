import { supabaseAdmin } from "./supabase-admin";
import slugify from "slugify";

/**
 * TACO Pipeline (Mock)
 * --------------------
 * Simula ingestão da tabela TACO (Nutrição)
 */

interface TacoRawItem {
  id: number;
  descricao: string; // "Arroz, integral, cozido"
  categoria: string; // "Cereais e derivados"
  calorias: number;
  proteina: number;
  carboidrato: number;
  lipideos: number; // Gordura
  fibra: number;
  unidade: string; // "100g"
}

// 1. Mock Fetcher
async function fetchTacoData(): Promise<TacoRawItem[]> {
  console.log("📡 Conectando à Base TACO Unicamp simulada...");

  return [
    {
      id: 1,
      descricao: "Arroz, integral, cozido",
      categoria: "Cereais e derivados",
      calorias: 112,
      proteina: 2.6,
      carboidrato: 25.8,
      lipideos: 1.0,
      fibra: 2.7,
      unidade: "100g",
    },
    {
      id: 2,
      descricao: "Feijão, carioca, cozido",
      categoria: "Leguminosas e derivados",
      calorias: 76,
      proteina: 4.8,
      carboidrato: 13.6,
      lipideos: 0.5,
      fibra: 8.5,
      unidade: "100g",
    },
    {
      id: 3,
      descricao: "Frango, peito, sem pele, grelhado",
      categoria: "Carnes e derivados",
      calorias: 163,
      proteina: 31.5,
      carboidrato: 0,
      lipideos: 3.2,
      fibra: 0,
      unidade: "100g",
    },
    {
      id: 4,
      descricao: "Ovo, de galinha, inteiro, cozido",
      categoria: "Ovos e derivados",
      calorias: 146,
      proteina: 13.3,
      carboidrato: 0.6,
      lipideos: 9.5,
      fibra: 0,
      unidade: "100g",
    },
  ];
}

// 2. Normalizer
function normalizeTacoItem(raw: TacoRawItem) {
  // Title cleaning: "Arroz, integral, cozido" -> "Arroz Integral Cozido" (opcional)
  const title = raw.descricao;
  const slug = slugify(raw.descricao, { lower: true, strict: true });

  return {
    slug,
    title,
    description: `${raw.categoria} (Porção: ${raw.unidade})`,

    // JSONB Payload
    data: {
      category: raw.categoria,
      serving_size: raw.unidade,

      // Nutrition Facts (Padronizado)
      macros: {
        calories: raw.calorias,
        protein: raw.proteina,
        carbs: raw.carboidrato,
        fat: raw.lipideos,
        fiber: raw.fibra,
      },

      // Micronutrients (Placeholder para exemplo)
      micros: [
        // Em um caso real, o CSV teria Colesterol, Sódio, Vitamina C...
      ],

      ui_traits: ["has_nutrition_facts", "has_macro_chart"],
    },
  };
}

// 3. Pipeline
async function runTacoPipeline() {
  console.log("🚀 Iniciando Pipeline ETL: TACO -> Portal Descomplicado");

  try {
    const rawData = await fetchTacoData();
    const cleanItems = rawData.map(normalizeTacoItem);

    // 1. Upsert Vertical
    const { data: verticalData, error: vError } = await supabaseAdmin
      .from("verticals")
      .upsert(
        {
          slug: "nutricao",
          name: "Tabela TACO",
          description:
            "Dados nutricionais da Tabela Brasileira de Composição de Alimentos",
          ui_config: ["nutrition_facts", "comparison_radar"],
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (vError) throw new Error(`Vertical Error: ${vError.message}`);

    // 2. Upsert Items
    const itemsToUpsert = cleanItems.map((item) => ({
      vertical_id: verticalData.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      data: item.data,
    }));

    const { error: upsertError } = await supabaseAdmin
      .from("portal_items")
      .upsert(itemsToUpsert, { onConflict: "vertical_id, slug" });

    if (upsertError) console.error("Upsert Error:", upsertError);
    else
      console.log(`✅ Sucesso! ${itemsToUpsert.length} alimentos atualizados.`);
  } catch (error) {
    console.error("Fatal:", error);
  }
}

runTacoPipeline();
