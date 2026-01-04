import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllItems,
  getItemBySlug,
  getMedicamentoItems,
} from "@/lib/data-provider";
import { UniversalCalculator } from "@/components/UniversalCalculator";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = getMedicamentoItems();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const item = getItemBySlug(slug);

  if (!item) {
    return {
      title: "Medicamento não encontrado",
    };
  }

  return {
    title: `${item.metadata.title} - Comparação de Preços | Portal Descomplicado`,
    description: item.metadata.description,
  };
}

export default async function MedicamentoPage({ params }: PageProps) {
  const slug = (await params).slug;
  const item = getItemBySlug(slug);

  if (!item || item.type !== "medicamentos") {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <UniversalCalculator item={item} />
    </div>
  );
}
