import { supabaseAdmin } from "./supabase-admin";
import slugify from "slugify";

/**
 * FIPE Pipeline (Mock)
 * --------------------
 * Simula a extração de dados da Tabela FIPE e transformação para o formato Portal Item.
 */

// 1. Raw Data Structure (Como vem da API FIPE)
interface FipeRawItem {
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Valor: string; // "R$ 100.000,00"
}

// 2. Mock Fetcher
async function fetchFipeData(): Promise<FipeRawItem[]> {
  console.log("📡 Conectando à API FIPE simulada...");

  // Simulando alguns carros populares
  return [
    {
      CodigoFipe: "004381-8",
      MesReferencia: "janeiro de 2026",
      TipoVeiculo: 1,
      SiglaCombustivel: "G",
      Marca: "Chevrolet",
      Modelo: "Onix Hatch LT 1.0 12V Flex 5p Mec.",
      AnoModelo: 2024,
      Valor: "R$ 78.500,00",
    },
    {
      CodigoFipe: "003444-4",
      MesReferencia: "janeiro de 2026",
      TipoVeiculo: 1,
      SiglaCombustivel: "G",
      Marca: "Honda",
      Modelo: "Civic Sedan EX 2.0 Flex 16V Aut.",
      AnoModelo: 2025,
      Valor: "R$ 145.200,00",
    },
    {
      CodigoFipe: "005399-6",
      MesReferencia: "janeiro de 2026",
      TipoVeiculo: 1,
      SiglaCombustivel: "G",
      Marca: "Volkswagen",
      Modelo: "Polo Highline 1.0 TSI Total Flex Aut.",
      AnoModelo: 2024,
      Valor: "R$ 112.900,00",
    },
  ];
}

// 3. Normalizer
function normalizeFipeItem(raw: FipeRawItem) {
  // Parse Price: "R$ 78.500,00" -> 78500
  const priceString = raw.Valor.replace("R$ ", "")
    .replace(".", "")
    .replace(",", ".");
  const price = parseFloat(priceString);

  const title = `${raw.Marca} ${raw.Modelo} ${raw.AnoModelo}`;
  const slug = slugify(`${raw.Marca}-${raw.Modelo}-${raw.AnoModelo}`, {
    lower: true,
    strict: true,
  });

  // Simulando histórico de preços (já que não temos histórico real neste mock)
  const history = [
    { month: "Jan/26", value: price },
    { month: "Dez/25", value: price * 1.01 }, // Era 1% mais caro
    { month: "Nov/25", value: price * 1.02 }, // Era 2% mais caro
  ];

  // Calculando tendência
  const trend = price > history[1].value ? "up" : "down";
  const variation = ((price - history[1].value) / history[1].value) * 100;

  return {
    slug,
    title,
    description: `Preço Tabela FIPE ${raw.MesReferencia} - Código: ${raw.CodigoFipe}`,

    // JSONB Payload
    data: {
      fipe_code: raw.CodigoFipe,
      brand: raw.Marca,
      model: raw.Modelo,
      year: raw.AnoModelo,
      fuel: raw.SiglaCombustivel,
      reference_month: raw.MesReferencia,

      price_info: {
        current_price: price,
        currency: "BRL",
        history: history,
        last_updated: new Date().toISOString(),
      },

      depreciation_info: {
        trend: trend,
        percentage: Number(variation.toFixed(2)),
      },

      ipva_info: {
        estimated_value: price * 0.04, // 4% padrao SP
        base_rate: 0.04,
      },

      ui_traits: ["has_price_chart", "has_ipva_calc"],
    },
  };
}

// 4. Pipeline
async function runFipePipeline() {
  console.log("🚀 Iniciando Pipeline ETL: FIPE -> Portal Descomplicado");

  try {
    const rawData = await fetchFipeData();
    const cleanItems = rawData.map(normalizeFipeItem);

    // 1. Upsert Vertical
    const { data: verticalData, error: vError } = await supabaseAdmin
      .from("verticals")
      .upsert(
        {
          slug: "fipe",
          name: "Tabela FIPE",
          description: "Consulta de preços de veículos novos e usados",
          ui_config: ["price_chart", "depreciation_badge"], // Tiles usados
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
      console.log(`✅ Sucesso! ${itemsToUpsert.length} veículos atualizados.`);
  } catch (error) {
    console.error("Fatal:", error);
  }
}

runFipePipeline();
