// app/fipe/[slug]/page.tsx - Página Dinâmica FIPE
import { notFound } from "next/navigation";
import { getItemBySlug, getAllSlugs } from "@/lib/data-provider";
import { UniversalCalculator } from "@/components/UniversalCalculator";
import { isFipeItem } from "@/types/portal";

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

  if (!item || !isFipeItem(item)) {
    return {
      title: "Veículo não encontrado",
    };
  }

  return {
    title: `${item.metadata.title} - Tabela FIPE | Portal Descomplicado`,
    description: item.metadata.description,
    keywords: [
      "FIPE",
      item.metadata.title,
      "preço",
      "veículo",
      "IPVA",
      "depreciação",
    ],
  };
}

export default async function FipePage({ params }: PageProps) {
  const { slug } = await params;
  const item = getItemBySlug(slug);

  // Verifica se o item existe e é do tipo FIPE
  if (!item || !isFipeItem(item)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <UniversalCalculator item={item} />
    </div>
  );
}
