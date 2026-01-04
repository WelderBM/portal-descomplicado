import { supabaseAdmin } from "./supabase-admin";
import slugify from "slugify";

/**
 * ACL (Anti-Corruption Layer) Pattern
 * -----------------------------------
 * O objetivo deste script é demonstrar como ingerir "DADOS REAIS" e convertê-los
 * para o formato limpo do Portal.
 *
 * Cenário Real:
 * A Anvisa disponibiliza um CSV gigante (Dados Abertos) com colunas confusas:
 * "NO_RAZAO_SOCIAL", "NU_REGISTRO", "VL_PRECO_FABRICA", etc.
 *
 * Este Pipeline:
 * 1. Simula a leitura desse CSV (RAW DATA)
 * 2. Normaliza para o nosso Schema (CLEAN DATA)
 * 3. Salva no Supabase (PERSISTENCE)
 */

// 1. Definição do Dado "Sujo" (Como ele vem do Governo)
interface AnvisaRawItem {
  NO_RAZAO_SOCIAL: string; // Laboratório
  NU_REGISTRO: string; // Registro Anvisa
  NO_PRODUTO: string; // Nome comercial
  DS_SUBSTANCIA: string; // Princípio Ativo
  DS_APRESENTACAO: string; // Ex: "500MG COM CX 20"
  TP_PRODUTO: string; // "1 - Medicamento Novo", "5 - Genérico"
  VL_PRECO_FABRICA: string; // Vem como string "12,99"
  VL_PRECO_MAXIMO: string; // Vem como string "20,50"
}

// 2. Mock de Função que baixaria o CSV oficial
// Em produção, isso seria um fetch('https://dados.gov.br/...') e um parse de CSV
async function fetchOfficialData(): Promise<AnvisaRawItem[]> {
  console.log("📡 Conectando ao 'Data Lake' simulado (Gov.br)...");

  // Simulando dados reais e complexos
  return [
    {
      NO_RAZAO_SOCIAL: "EMS S/A",
      NU_REGISTRO: "1023500290021",
      NO_PRODUTO: "DIPIRONA SÓDICA",
      DS_SUBSTANCIA: "DIPIRONA MONOIDRATADA",
      DS_APRESENTACAO: "500 MG COMP CX 4 BL X 5",
      TP_PRODUTO: "5 - Genérico",
      VL_PRECO_FABRICA: "8,50",
      VL_PRECO_MAXIMO: "12,90",
    },
    {
      NO_RAZAO_SOCIAL: "SANOFI MEDLEY",
      NU_REGISTRO: "1130000580041",
      NO_PRODUTO: "NOVALGINA",
      DS_SUBSTANCIA: "DIPIRONA MONOIDRATADA",
      DS_APRESENTACAO: "1 G COMP EFERV CX 10",
      TP_PRODUTO: "1 - Medicamento Novo",
      VL_PRECO_FABRICA: "22,10",
      VL_PRECO_MAXIMO: "35,40",
    },
    {
      NO_RAZAO_SOCIAL: "ACHÉ LABORATÓRIOS",
      NU_REGISTRO: "1057303100015",
      NO_PRODUTO: "TORSILAX",
      DS_SUBSTANCIA: "CAFEÍNA;CARISOPRODOL;DICLOFENACO SÓDICO;PARACETAMOL",
      DS_APRESENTACAO: "COMP CX 3 BL X 10",
      TP_PRODUTO: "4 - Similar",
      VL_PRECO_FABRICA: "18,90",
      VL_PRECO_MAXIMO: "28,50",
    },
  ];
}

// 3. Normalizador (O Cérebro da Operação)
function normalizeMedicamento(raw: AnvisaRawItem) {
  // Tratamento de Números (R$ 12,90 -> 12.90)
  const parsePrice = (val: string) => parseFloat(val.replace(",", "."));

  // Tratamento de Strings
  const isGeneric = raw.TP_PRODUTO.includes("Genérico");
  const title = isGeneric
    ? `${raw.DS_SUBSTANCIA} (${raw.NO_RAZAO_SOCIAL})` // Ex: Dipirona (EMS)
    : raw.NO_PRODUTO; // Ex: Novalgina

  // Geração do Payload JSONB (Nosso Formato Limpo)
  return {
    slug: slugify(
      title.toLowerCase() + "-" + raw.DS_APRESENTACAO.split(" ")[0],
      { strict: true }
    ),
    title: title,
    description: `${raw.DS_APRESENTACAO} - Registro: ${raw.NU_REGISTRO}`,

    // Schema-less data (Aqui o JSONB brilha!)
    data: {
      anvisa_id: raw.NU_REGISTRO,
      active_ingredient: raw.DS_SUBSTANCIA,
      laboratory: raw.NO_RAZAO_SOCIAL,
      is_generic: isGeneric,
      dosage: raw.DS_APRESENTACAO,
      regulatory_type: raw.TP_PRODUTO,

      // Padronização de Preço (O "Price Tile" do frontend vai ler isso aqui)
      price_info: {
        factory_price: parsePrice(raw.VL_PRECO_FABRICA),
        max_consumer_price: parsePrice(raw.VL_PRECO_MAXIMO),
        currency: "BRL",
        last_updated: new Date().toISOString(),
      },

      // Trait para identificar UI
      ui_traits: ["has_price", "has_anvisa_details"],
    },
  };
}

// 4. Função Principal (Pipeline)
async function runPipeline() {
  console.log(
    "🚀 Iniciando Pipeline ETL: Medicamentos Gov -> Portal Descomplicado"
  );

  try {
    // A. Extração
    const rawData = await fetchOfficialData();
    console.log(`📦 Extraído: ${rawData.length} itens brutos.`);

    // B. Transformação
    const cleanItems = rawData.map(normalizeMedicamento);
    console.log("✨ Dados normalizados com sucesso!");

    // C. Carregamento (Load)
    // Primeiro, garantir que a vertical existe
    const { data: verticalData, error: vError } = await supabaseAdmin
      .from("verticals")
      .upsert(
        {
          slug: "medicamentos",
          name: "Medicamentos & Farmácia",
          ui_config: ["price_comparison", "active_ingredient_badge"],
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (vError) throw new Error(`Erro ao criar vertical: ${vError.message}`);

    const verticalId = verticalData.id;

    // Inserir Itens em Batch
    const itemsToUpsert = cleanItems.map((item) => ({
      vertical_id: verticalId,
      slug: item.slug,
      title: item.title,
      description: item.description,
      data: item.data,
    }));

    const { error: upsertError } = await supabaseAdmin
      .from("portal_items")
      .upsert(itemsToUpsert, { onConflict: "vertical_id, slug" });

    if (upsertError) {
      console.error("❌ Erro no Upsert:", upsertError);
    } else {
      console.log("✅ Sucesso! Dados carregados no Supabase.");
      console.log("🔍 Verifique a tabela 'portal_items' no seu dashboard.");
    }
  } catch (error) {
    console.error("💥 Falha fatal no pipeline:", error);
  }
}

// Executar
runPipeline();
