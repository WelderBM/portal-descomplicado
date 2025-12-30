// app/nutricao/[slug]/page.tsx - Página Dinâmica TACO
import { notFound } from "next/navigation";
import { getItemBySlug, getAllSlugs } from "@/lib/data-provider";
import { UniversalCalculator } from "@/components/UniversalCalculator";
import { isTacoItem } from "@/types/portal";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Geração Estática de Páginas (SSG)
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Metadados Dinâmicos para SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = getItemBySlug(slug);

  if (!item || !isTacoItem(item)) {
    return {
      title: "Alimento não encontrado",
    };
  }

  return {
    title: `${item.metadata.title} - Tabela TACO | Portal Descomplicado`,
    description: item.metadata.description,
    keywords: [
      "TACO",
      "UNICAMP",
      item.metadata.title,
      "nutrição",
      "calorias",
      "proteínas",
      "micronutrientes",
    ],
  };
}

export default async function NutricaoPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getItemBySlug(slug);

  // Verifica se o item existe e é do tipo TACO
  if (!item || !isTacoItem(item)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <UniversalCalculator item={item} />
    </div>
  );
}
