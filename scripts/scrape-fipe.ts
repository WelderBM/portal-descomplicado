// scripts/scrape-fipe.ts - Script de Scraping da Tabela FIPE
import axios from "axios";
import slugify from "slugify";
import fs from "fs";
import path from "path";
import { FipeItem } from "../src/types/portal.js";

/**
 * API FIPE Paralela (Gratuita)
 * Documentação: https://deividfortuna.github.io/fipe/
 */

const FIPE_API_BASE = "https://parallelum.com.br/fipe/api/v1";

interface FipeBrand {
  codigo: string;
  nome: string;
}

interface FipeModel {
  codigo: number;
  nome: string;
}

interface FipeYear {
  codigo: string;
  nome: string;
}

interface FipeVehicle {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

/**
 * Gera ID único e consistente baseado no código FIPE
 */
function generateId(codigoFipe: string): string {
  return `fipe-${codigoFipe.replace(/[^0-9]/g, "")}`;
}

/**
 * Gera slug SEO-friendly
 */
function generateSlug(marca: string, modelo: string, ano: number): string {
  const text = `${marca} ${modelo} ${ano}`;
  return slugify(text, {
    lower: true,
    strict: true,
    locale: "pt",
  });
}

/**
 * Converte valor FIPE (string) para número
 */
function parsePrice(valor: string): number {
  return Number(valor.replace(/[^0-9,]/g, "").replace(",", ".")) * 1000;
}

/**
 * Calcula IPVA estimado (4% para SP)
 */
function calculateIPVA(price: number): number {
  return Math.round(price * 0.04);
}

/**
 * Gera histórico de preços simulado (em produção, seria histórico real)
 */
function generatePriceHistory(currentPrice: number) {
  const history = [];
  const months = [
    "2025-01",
    "2024-12",
    "2024-11",
    "2024-10",
    "2024-09",
    "2024-08",
    "2024-07",
    "2024-06",
    "2024-05",
    "2024-04",
    "2024-03",
    "2024-02",
  ];

  // Simula variação de -5% a +5% ao mês
  let price = currentPrice;
  for (const month of months) {
    history.push({ month, value: Math.round(price) });
    const variation = (Math.random() - 0.5) * 0.1; // -5% a +5%
    price = price * (1 + variation);
  }

  return history.reverse();
}

/**
 * Calcula tendência baseada no histórico
 */
function calculateTrend(
  history: Array<{ month: string; value: number }>
): "up" | "down" | "stable" {
  const first = history[0].value;
  const last = history[history.length - 1].value;
  const change = ((last - first) / first) * 100;

  if (change > 2) return "up";
  if (change < -2) return "down";
  return "stable";
}

/**
 * Busca marcas de carros
 */
async function getBrands(): Promise<FipeBrand[]> {
  const response = await axios.get(`${FIPE_API_BASE}/carros/marcas`);
  return response.data;
}

/**
 * Busca modelos de uma marca
 */
async function getModels(brandCode: string): Promise<FipeModel[]> {
  const response = await axios.get(
    `${FIPE_API_BASE}/carros/marcas/${brandCode}/modelos`
  );
  return response.data.modelos;
}

/**
 * Busca anos de um modelo
 */
async function getYears(
  brandCode: string,
  modelCode: number
): Promise<FipeYear[]> {
  const response = await axios.get(
    `${FIPE_API_BASE}/carros/marcas/${brandCode}/modelos/${modelCode}/anos`
  );
  return response.data;
}

/**
 * Busca detalhes de um veículo específico
 */
async function getVehicleDetails(
  brandCode: string,
  modelCode: number,
  yearCode: string
): Promise<FipeVehicle> {
  const response = await axios.get(
    `${FIPE_API_BASE}/carros/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`
  );
  return response.data;
}

/**
 * Converte dados da API FIPE para nosso formato JSON
 */
function convertToFipeItem(vehicle: FipeVehicle): FipeItem {
  const currentPrice = parsePrice(vehicle.Valor);
  const priceHistory = generatePriceHistory(currentPrice);
  const trend = calculateTrend(priceHistory);
  const depreciation =
    ((priceHistory[priceHistory.length - 1].value - priceHistory[0].value) /
      priceHistory[0].value) *
    100;

  return {
    id: generateId(vehicle.CodigoFipe),
    slug: generateSlug(vehicle.Marca, vehicle.Modelo, vehicle.AnoModelo),
    type: "fipe",
    metadata: {
      title: `${vehicle.Marca} ${vehicle.Modelo} ${vehicle.AnoModelo}`,
      description: `Consulta FIPE completa do ${vehicle.Marca} ${vehicle.Modelo} ${vehicle.AnoModelo} com histórico de preços, tendência de mercado e estimativa de IPVA`,
      source: "Tabela FIPE - Fundação Instituto de Pesquisas Econômicas",
      updatedAt: new Date().toISOString().split("T")[0],
    },
    visuals: {
      layout: "bento",
      accentColor:
        trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#6b7280",
    },
    insights: {
      summary: `O ${vehicle.Marca} ${vehicle.Modelo} ${
        vehicle.AnoModelo
      } apresenta ${
        trend === "up"
          ? `valorização de ${Math.abs(depreciation).toFixed(1)}%`
          : trend === "down"
          ? `depreciação de ${Math.abs(depreciation).toFixed(1)}%`
          : "estabilidade de preço"
      } nos últimos 12 meses. ${vehicle.Combustivel}.`,
      highlights: [
        `${
          trend === "up"
            ? "Valorização"
            : trend === "down"
            ? "Depreciação"
            : "Variação"
        } de ${Math.abs(depreciation).toFixed(1)}% em 12 meses`,
        `Combustível: ${vehicle.Combustivel}`,
        `IPVA estimado: ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(calculateIPVA(currentPrice))}/ano`,
        `Código FIPE: ${vehicle.CodigoFipe}`,
      ],
    },
    dataPoints: {
      currentPrice,
      priceHistory,
      ipvaEstimated: calculateIPVA(currentPrice),
      depreciationInfo: {
        percentage: Number(depreciation.toFixed(2)),
        trend,
      },
    },
    affiliate: {
      category: "seguro-auto",
      cta: "Cotar Seguro com Desconto",
      url: "https://exemplo.com/seguro-auto",
    },
  };
}

/**
 * Script principal de scraping
 */
async function scrapeFipe(
  maxBrands: number = 3,
  maxModelsPerBrand: number = 2
) {
  console.log("🚗 Iniciando scraping da Tabela FIPE...\n");

  const allVehicles: FipeItem[] = [];

  try {
    // 1. Busca marcas
    console.log("📋 Buscando marcas...");
    const brands = await getBrands();
    console.log(`✅ ${brands.length} marcas encontradas\n`);

    // Limita número de marcas para teste
    const selectedBrands = brands.slice(0, maxBrands);

    for (const brand of selectedBrands) {
      console.log(`🔍 Processando marca: ${brand.nome}`);

      // 2. Busca modelos da marca
      const models = await getModels(brand.codigo);
      const selectedModels = models.slice(0, maxModelsPerBrand);

      for (const model of selectedModels) {
        console.log(`  📦 Modelo: ${model.nome}`);

        // 3. Busca anos do modelo
        const years = await getYears(brand.codigo, model.codigo);

        // Pega apenas o ano mais recente
        const latestYear = years[0];

        if (latestYear) {
          // 4. Busca detalhes do veículo
          const vehicle = await getVehicleDetails(
            brand.codigo,
            model.codigo,
            latestYear.codigo
          );

          // 5. Converte para nosso formato
          const fipeItem = convertToFipeItem(vehicle);
          allVehicles.push(fipeItem);

          console.log(
            `    ✅ ${vehicle.Marca} ${vehicle.Modelo} ${vehicle.AnoModelo} - ${vehicle.Valor}`
          );
        }

        // Delay para não sobrecarregar a API
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      console.log("");
    }

    // 6. Salva no arquivo JSON
    const outputPath = path.join(__dirname, "../src/data/fipe-scraped.json");
    fs.writeFileSync(outputPath, JSON.stringify(allVehicles, null, 2), "utf-8");

    console.log(`\n✅ Scraping concluído!`);
    console.log(`📁 ${allVehicles.length} veículos salvos em: ${outputPath}`);
  } catch (error) {
    console.error("❌ Erro durante o scraping:", error);
    throw error;
  }
}

// Executa o script
if (require.main === module) {
  scrapeFipe(3, 2)
    .then(() => {
      console.log("\n🎉 Script finalizado com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Erro fatal:", error);
      process.exit(1);
    });
}

export { scrapeFipe };
