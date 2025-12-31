// scripts/scrape-taco.ts - Script de Conversão TACO (Excel/PDF para JSON)
import xlsx from "xlsx";
import slugify from "slugify";
import fs from "fs";
import path from "path";
import { TacoItem } from "../src/types/portal.js";

/**
 * Tabela TACO - UNICAMP
 * Fonte: http://www.nepa.unicamp.br/taco/
 *
 * Este script converte o arquivo Excel da TACO para nosso formato JSON
 */

interface TacoRawData {
  Número: number;
  Alimento: string;
  "Energia (kcal)": number;
  "Proteína (g)": number;
  "Lipídeos (g)": number;
  "Carboidrato (g)": number;
  "Fibra Alimentar (g)": number;
  "Cálcio (mg)": number;
  "Magnésio (mg)": number;
  "Ferro (mg)": number;
  "Sódio (mg)": number;
  "Potássio (mg)": number;
  "Zinco (mg)": number;
  "Vitamina C (mg)": number;
  "Vitamina B6 (mg)": number;
  "Vitamina A (mcg)": number;
}

/**
 * Valores Diários de Referência (VD) - Anvisa
 */
const DAILY_VALUES = {
  calcium: 1000, // mg
  magnesium: 260, // mg
  iron: 14, // mg
  sodium: 2400, // mg
  potassium: 3500, // mg
  zinc: 7, // mg
  vitaminC: 45, // mg
  vitaminB6: 1.3, // mg
  vitaminA: 600, // mcg
  fiber: 25, // g
};

/**
 * Gera ID único e consistente
 */
function generateId(numero: number): string {
  return `taco-${String(numero).padStart(4, "0")}`;
}

/**
 * Gera slug SEO-friendly
 */
function generateSlug(alimento: string): string {
  return slugify(alimento, {
    lower: true,
    strict: true,
    locale: "pt",
  });
}

/**
 * Calcula percentual do Valor Diário
 */
function calculateDailyValue(value: number, dailyValue: number): number {
  return Math.round((value / dailyValue) * 100);
}

/**
 * Determina cor de destaque baseada nos macros
 */
function getAccentColor(protein: number, carbs: number, fat: number): string {
  // Alto em proteína
  if (protein > 15) return "#10b981"; // Verde
  // Alto em carboidratos
  if (carbs > 30) return "#f59e0b"; // Amarelo
  // Alto em gordura
  if (fat > 10) return "#ef4444"; // Vermelho
  // Balanceado
  return "#3b82f6"; // Azul
}

/**
 * Gera insights baseados nos valores nutricionais
 */
function generateInsights(data: TacoRawData): {
  summary: string;
  highlights: string[];
} {
  const highlights: string[] = [];

  // Proteína
  if (data["Proteína (g)"] > 20) {
    highlights.push("Excelente fonte de proteínas");
  } else if (data["Proteína (g)"] > 10) {
    highlights.push("Boa fonte de proteínas");
  }

  // Carboidratos
  if (data["Carboidrato (g)"] < 5) {
    highlights.push("Baixo em carboidratos (Low Carb)");
  } else if (data["Carboidrato (g)"] > 30) {
    highlights.push("Alto em carboidratos (energia rápida)");
  }

  // Fibras
  if (data["Fibra Alimentar (g)"] > 5) {
    highlights.push("Rico em fibras");
  }

  // Vitaminas e Minerais
  if (data["Potássio (mg)"] > 400) {
    highlights.push("Excelente fonte de potássio");
  }
  if (data["Vitamina C (mg)"] > 20) {
    highlights.push("Rico em vitamina C");
  }
  if (data["Cálcio (mg)"] > 200) {
    highlights.push("Boa fonte de cálcio");
  }
  if (data["Ferro (mg)"] > 3) {
    highlights.push("Rico em ferro");
  }

  // Calorias
  let calorieLevel = "";
  if (data["Energia (kcal)"] < 50) {
    calorieLevel = "muito baixo";
  } else if (data["Energia (kcal)"] < 150) {
    calorieLevel = "baixo";
  } else if (data["Energia (kcal)"] < 300) {
    calorieLevel = "moderado";
  } else {
    calorieLevel = "alto";
  }

  const summary = `${data.Alimento} possui ${calorieLevel} valor calórico (${
    data["Energia (kcal)"]
  } kcal por 100g) e é ${
    highlights.length > 0
      ? highlights[0].toLowerCase()
      : "um alimento nutritivo"
  }.`;

  return { summary, highlights: highlights.slice(0, 4) };
}

/**
 * Converte linha do Excel para nosso formato JSON
 */
function convertToTacoItem(data: TacoRawData): TacoItem {
  const insights = generateInsights(data);
  const accentColor = getAccentColor(
    data["Proteína (g)"],
    data["Carboidrato (g)"],
    data["Lipídeos (g)"]
  );

  return {
    id: generateId(data["Número"]),
    slug: generateSlug(data.Alimento),
    type: "taco",
    metadata: {
      title: data.Alimento,
      description: `Informações nutricionais completas de ${data.Alimento} segundo a Tabela TACO UNICAMP. Calorias, macros, vitaminas e minerais.`,
      source: "TACO - Tabela Brasileira de Composição de Alimentos (UNICAMP)",
      updatedAt: new Date().toISOString().split("T")[0],
    },
    visuals: {
      layout: "bento",
      accentColor,
    },
    insights,
    dataPoints: {
      servingSize: "100g",
      macros: {
        calories: data["Energia (kcal)"],
        protein: data["Proteína (g)"],
        carbs: data["Carboidrato (g)"],
        fat: data["Lipídeos (g)"],
        fiber: data["Fibra Alimentar (g)"],
      },
      micros: [
        {
          name: "Cálcio",
          value: data["Cálcio (mg)"],
          unit: "mg",
          dailyValuePercentage: calculateDailyValue(
            data["Cálcio (mg)"],
            DAILY_VALUES.calcium
          ),
        },
        {
          name: "Magnésio",
          value: data["Magnésio (mg)"],
          unit: "mg",
          dailyValuePercentage: calculateDailyValue(
            data["Magnésio (mg)"],
            DAILY_VALUES.magnesium
          ),
        },
        {
          name: "Ferro",
          value: data["Ferro (mg)"],
          unit: "mg",
          dailyValuePercentage: calculateDailyValue(
            data["Ferro (mg)"],
            DAILY_VALUES.iron
          ),
        },
        {
          name: "Sódio",
          value: data["Sódio (mg)"],
          unit: "mg",
          dailyValuePercentage: calculateDailyValue(
            data["Sódio (mg)"],
            DAILY_VALUES.sodium
          ),
        },
        {
          name: "Potássio",
          value: data["Potássio (mg)"],
          unit: "mg",
          dailyValuePercentage: calculateDailyValue(
            data["Potássio (mg)"],
            DAILY_VALUES.potassium
          ),
        },
        {
          name: "Zinco",
          value: data["Zinco (mg)"],
          unit: "mg",
          dailyValuePercentage: calculateDailyValue(
            data["Zinco (mg)"],
            DAILY_VALUES.zinc
          ),
        },
        {
          name: "Vitamina C",
          value: data["Vitamina C (mg)"],
          unit: "mg",
          dailyValuePercentage: calculateDailyValue(
            data["Vitamina C (mg)"],
            DAILY_VALUES.vitaminC
          ),
        },
        {
          name: "Vitamina B6",
          value: data["Vitamina B6 (mg)"],
          unit: "mg",
          dailyValuePercentage: calculateDailyValue(
            data["Vitamina B6 (mg)"],
            DAILY_VALUES.vitaminB6
          ),
        },
        {
          name: "Vitamina A",
          value: data["Vitamina A (mcg)"],
          unit: "mcg",
          dailyValuePercentage: calculateDailyValue(
            data["Vitamina A (mcg)"],
            DAILY_VALUES.vitaminA
          ),
        },
      ],
    },
    affiliate: {
      category:
        data["Carboidrato (g)"] < 5 ? "dieta-cetogenica" : "suplementos",
      cta:
        data["Carboidrato (g)"] < 5
          ? "Ver Produtos Low Carb"
          : "Ver Suplementos Nutricionais",
      url: "https://exemplo.com/suplementos",
    },
  };
}

/**
 * Processa arquivo Excel da TACO
 */
function scrapeTaco(excelPath: string, maxItems: number = 10) {
  console.log("🍎 Iniciando conversão da Tabela TACO...\n");

  try {
    // 1. Lê o arquivo Excel
    console.log(`📂 Lendo arquivo: ${excelPath}`);
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 2. Converte para JSON
    const rawData: TacoRawData[] = xlsx.utils.sheet_to_json(worksheet);
    console.log(`✅ ${rawData.length} alimentos encontrados\n`);

    // 3. Converte para nosso formato
    const tacoItems: TacoItem[] = rawData.slice(0, maxItems).map((data) => {
      console.log(`🔄 Processando: ${data.Alimento}`);
      return convertToTacoItem(data);
    });

    // 4. Salva no arquivo JSON
    const outputPath = path.join(__dirname, "../src/data/taco-scraped.json");
    fs.writeFileSync(outputPath, JSON.stringify(tacoItems, null, 2), "utf-8");

    console.log(`\n✅ Conversão concluída!`);
    console.log(`📁 ${tacoItems.length} alimentos salvos em: ${outputPath}`);
  } catch (error) {
    console.error("❌ Erro durante a conversão:", error);
    throw error;
  }
}

// Executa o script
if (require.main === module) {
  // Caminho para o arquivo Excel da TACO
  // Baixe de: http://www.nepa.unicamp.br/taco/
  const excelPath = path.join(__dirname, "../data-sources/taco.xlsx");

  if (!fs.existsSync(excelPath)) {
    console.error(
      `❌ Arquivo não encontrado: ${excelPath}\n` +
        `📥 Baixe a Tabela TACO em: http://www.nepa.unicamp.br/taco/`
    );
    process.exit(1);
  }

  scrapeTaco(excelPath, 10)
    .then(() => {
      console.log("\n🎉 Script finalizado com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Erro fatal:", error);
      process.exit(1);
    });
}

export { scrapeTaco };
