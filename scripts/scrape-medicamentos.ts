import fs from "fs";
import path from "path";
import slugify from "slugify";
import { MedicamentoItem } from "../src/types/portal";

/**
 * Script de Simulação de Dados de Medicamentos
 * Gera um JSON com dados mockados seguindo a estrutura MedicamentoItem
 */

const MEDICAMENTOS_MOCK = [
  {
    principioAtivo: "Dipirona Sódica",
    nomesComerciais: ["Novalgina", "Anador"],
    apresentacoes: [
      "500mg - 10 comprimidos",
      "1g - 10 comprimidos",
      "500mg/ml - Gotas 20ml",
    ],
    classeTerapeutica: "Analgésico e Antipirético",
    tarja: "livre",
  },
  {
    principioAtivo: "Paracetamol",
    nomesComerciais: ["Tylenol"],
    apresentacoes: ["750mg - 20 comprimidos", "500mg - 20 comprimidos"],
    classeTerapeutica: "Analgésico e Antipirético",
    tarja: "livre",
  },
  {
    principioAtivo: "Amoxicilina",
    nomesComerciais: ["Amoxil"],
    apresentacoes: ["500mg - 21 cápsulas", "875mg - 14 comprimidos"],
    classeTerapeutica: "Antibiótico",
    tarja: "vermelha",
  },
  {
    principioAtivo: "Losartana Potássica",
    nomesComerciais: ["Cozaar"],
    apresentacoes: ["50mg - 30 comprimidos"],
    classeTerapeutica: "Anti-hipertensivo",
    tarja: "vermelha",
  },
  {
    principioAtivo: "Sildenafila",
    nomesComerciais: ["Viagra"],
    apresentacoes: ["50mg - 4 comprimidos"],
    classeTerapeutica: "Disfunção Erétil",
    tarja: "vermelha",
  },
  {
    principioAtivo: "Omeprazol",
    nomesComerciais: ["Losec"],
    apresentacoes: ["20mg - 28 cápsulas"],
    classeTerapeutica: "Antiulceroso",
    tarja: "vermelha",
  },
  {
    principioAtivo: "Ibuprofeno",
    nomesComerciais: ["Advil", "Alivium"],
    apresentacoes: ["400mg - 10 cápsulas", "600mg - 20 comprimidos"],
    classeTerapeutica: "Anti-inflamatório",
    tarja: "livre",
  },
];

function generateId(index: number): string {
  return `med-${String(index + 1).padStart(4, "0")}`;
}

function generateRandomPrice(base: number, variance: number): number {
  return Number((base + (Math.random() * variance * 2 - variance)).toFixed(2));
}

function processMedicamentos(): MedicamentoItem[] {
  const items: MedicamentoItem[] = [];
  let idCounter = 0;

  MEDICAMENTOS_MOCK.forEach((med) => {
    med.apresentacoes.forEach((apresentacao) => {
      idCounter++;
      const id = generateId(idCounter);

      // Simula preços
      const precoReferencia = generateRandomPrice(Math.random() * 50 + 20, 5); // Entre 20 e 70
      const descontoGenerico = 0.35 + Math.random() * 0.3; // 35% a 65% de desconto
      const precoGenerico = Number(
        (precoReferencia * (1 - descontoGenerico)).toFixed(2)
      );
      const poupancaReal = Number((precoReferencia - precoGenerico).toFixed(2));
      const poupancaPorcentagem = Math.round(
        (poupancaReal / precoReferencia) * 100
      );

      // Título amigável
      const title = `${med.principioAtivo} ${apresentacao}`;

      items.push({
        id,
        slug: slugify(title, { lower: true, strict: true, locale: "pt" }),
        type: "medicamentos",
        metadata: {
          title: title,
          description: `Compare preços de ${title}. O genérico custa em média R$ ${precoGenerico}, uma economia de ${poupancaPorcentagem}% em relação ao referência.`,
          source: "ANVISA - Agência Nacional de Vigilância Sanitária",
          updatedAt: new Date().toISOString().split("T")[0],
        },
        visuals: {
          layout: "bento",
          accentColor:
            med.tarja === "vermelha"
              ? "#ef4444"
              : med.tarja === "livre"
              ? "#10b981"
              : "#f59e0b",
        },
        insights: {
          summary: `Economize R$ ${poupancaReal} optando pelo genérico de ${med.principioAtivo}.`,
          highlights: [
            `Princípio Ativo: ${med.principioAtivo}`,
            `Referência: ${med.nomesComerciais.join(" / ")}`,
            `Classe: ${med.classeTerapeutica}`,
            `Economia média de ${poupancaPorcentagem}%`,
          ],
        },
        dataPoints: {
          principioAtivo: med.principioAtivo,
          laboratorio: "Genérico",
          registroAnvisa: `1.${Math.floor(Math.random() * 9000) + 1000}.${
            Math.floor(Math.random() * 900) + 100
          }.${Math.floor(Math.random() * 90) + 10}`,
          classeTerapeutica: med.classeTerapeutica,
          apresentacao: apresentacao,
          tarja: med.tarja as any,
          prices: {
            referencia: precoReferencia,
            genericoMedio: precoGenerico,
            poupancaReal: poupancaReal,
            poupancaPorcentagem: poupancaPorcentagem,
          },
        },
        affiliate: {
          category: "medicamentos",
          cta: "Ver ofertas em farmácias",
          url: "https://exemplo.com/medicamentos",
        },
      });
    });
  });

  return items;
}

// Executa e salva
const medicamentos = processMedicamentos();
const outputPath = path.join(__dirname, "../src/data/medicamentos.json");

// Garante que o diretório data existe (caso path absoluto diferencie em dev) - mas aqui usarei o diretório conhecido
if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(medicamentos, null, 2));

console.log(`✅ Gerados ${medicamentos.length} medicamentos em ${outputPath}`);
