import { supabase } from "@/lib/supabase";

export async function omnisearch(query: string) {
  if (!query || query.length < 2) return [];

  // Busca Full-Text diretamente no Supabase com configuração em português
  const { data, error } = await supabase
    .from("portal_items")
    .select(
      `
      id,
      title,
      slug,
      description,
      verticals (
        slug,
        name
      )
    `
    )
    .textSearch("search_vectors", query, {
      config: "portuguese",
      type: "websearch",
    })
    .limit(10);

  if (error) {
    console.error("Omnisearch Error:", error);
    return [];
  }

  // Mapper
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    slug: item.slug,
    verticalSlug: item.verticals?.slug,
    verticalName: item.verticals?.name,
  }));
}
