// scripts/merge-data.ts - Script de Merge com Consistência de IDs/Slugs
import fs from "fs";
import path from "path";
import { PortalItem } from "../src/types/portal.js";

/**
 * Garante consistência de IDs e Slugs para não quebrar SEO
 *
 * Estratégia:
 * 1. Lê dados existentes (fipe.json, taco.json)
 * 2. Lê dados novos (fipe-scraped.json, taco-scraped.json)
 * 3. Faz merge mantendo IDs/slugs existentes
 * 4. Adiciona apenas novos itens com IDs/slugs únicos
 */

interface MergeResult {
  kept: number;
  updated: number;
  added: number;
  total: number;
}

/**
 * Faz merge de dados mantendo IDs consistentes
 */
function mergeData(
  existing: PortalItem[],
  scraped: PortalItem[]
): { merged: PortalItem[]; result: MergeResult } {
  const result: MergeResult = {
    kept: 0,
    updated: 0,
    added: 0,
    total: 0,
  };

  // Cria mapa de itens existentes por ID
  const existingMap = new Map<string, PortalItem>();
  existing.forEach((item) => existingMap.set(item.id, item));

  // Cria mapa de slugs existentes para evitar duplicatas
  const existingSlugs = new Set(existing.map((item) => item.slug));

  const merged: PortalItem[] = [];

  // 1. Processa itens existentes
  for (const existingItem of existing) {
    // Busca atualização nos dados scraped
    const scrapedItem = scraped.find((s) => s.id === existingItem.id);

    if (scrapedItem) {
      // Atualiza dados mantendo ID e slug originais
      merged.push({
        ...scrapedItem,
        id: existingItem.id, // Mantém ID original
        slug: existingItem.slug, // Mantém slug original (SEO)
      });
      result.updated++;
    } else {
      // Mantém item existente
      merged.push(existingItem);
      result.kept++;
    }
  }

  // 2. Adiciona novos itens (que não existiam antes)
  for (const scrapedItem of scraped) {
    if (!existingMap.has(scrapedItem.id)) {
      // Verifica se o slug já existe
      let finalSlug = scrapedItem.slug;
      let counter = 1;

      while (existingSlugs.has(finalSlug)) {
        finalSlug = `${scrapedItem.slug}-${counter}`;
        counter++;
      }

      merged.push({
        ...scrapedItem,
        slug: finalSlug,
      });

      existingSlugs.add(finalSlug);
      result.added++;
    }
  }

  result.total = merged.length;

  return { merged, result };
}

/**
 * Executa merge de FIPE
 */
function mergeFipe() {
  console.log("🚗 Fazendo merge de dados FIPE...\n");

  const existingPath = path.join(__dirname, "../src/data/fipe.json");
  const scrapedPath = path.join(__dirname, "../src/data/fipe-scraped.json");

  // Lê dados
  const existing: PortalItem[] = fs.existsSync(existingPath)
    ? JSON.parse(fs.readFileSync(existingPath, "utf-8"))
    : [];

  if (!fs.existsSync(scrapedPath)) {
    console.log("⚠️  Arquivo fipe-scraped.json não encontrado. Pulando...");
    return;
  }

  const scraped: PortalItem[] = JSON.parse(
    fs.readFileSync(scrapedPath, "utf-8")
  );

  // Faz merge
  const { merged, result } = mergeData(existing, scraped);

  // Salva resultado
  fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2), "utf-8");

  console.log("📊 Resultado do merge FIPE:");
  console.log(`  ✅ Mantidos: ${result.kept}`);
  console.log(`  🔄 Atualizados: ${result.updated}`);
  console.log(`  ➕ Adicionados: ${result.added}`);
  console.log(`  📦 Total: ${result.total}\n`);
}

/**
 * Executa merge de TACO
 */
function mergeTaco() {
  console.log("🍎 Fazendo merge de dados TACO...\n");

  const existingPath = path.join(__dirname, "../src/data/taco.json");
  const scrapedPath = path.join(__dirname, "../src/data/taco-scraped.json");

  // Lê dados
  const existing: PortalItem[] = fs.existsSync(existingPath)
    ? JSON.parse(fs.readFileSync(existingPath, "utf-8"))
    : [];

  if (!fs.existsSync(scrapedPath)) {
    console.log("⚠️  Arquivo taco-scraped.json não encontrado. Pulando...");
    return;
  }

  const scraped: PortalItem[] = JSON.parse(
    fs.readFileSync(scrapedPath, "utf-8")
  );

  // Faz merge
  const { merged, result } = mergeData(existing, scraped);

  // Salva resultado
  fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2), "utf-8");

  console.log("📊 Resultado do merge TACO:");
  console.log(`  ✅ Mantidos: ${result.kept}`);
  console.log(`  🔄 Atualizados: ${result.updated}`);
  console.log(`  ➕ Adicionados: ${result.added}`);
  console.log(`  📦 Total: ${result.total}\n`);
}

/**
 * Script principal
 */
function main() {
  console.log("🔄 Iniciando merge de dados...\n");

  try {
    mergeFipe();
    mergeTaco();

    console.log("✅ Merge concluído com sucesso!");
    console.log("🔒 IDs e slugs mantidos para preservar SEO\n");
  } catch (error) {
    console.error("❌ Erro durante o merge:", error);
    throw error;
  }
}

// Executa o script
if (require.main === module) {
  main()
    .then(() => {
      console.log("🎉 Script finalizado!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erro fatal:", error);
      process.exit(1);
    });
}

export { mergeData, mergeFipe, mergeTaco };
