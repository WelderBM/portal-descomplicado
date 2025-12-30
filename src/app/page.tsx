import Link from "next/link";
import { Search, Car, Apple, Calculator, TrendingUp } from "lucide-react";
import { getAllItems } from "@/lib/data-provider";

export default function Home() {
  const allItems = getAllItems();
  const featuredItems = allItems.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-foreground-muted">
            Dados oficiais atualizados diariamente
          </span>
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
          Dados Complexos,
          <br />
          <span className="bg-gradient-to-r from-success to-info bg-clip-text text-transparent">
            Decisões Simples
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground-muted">
          Consulte FIPE, Tabela TACO e calculadoras utilitárias em uma interface
          limpa e objetiva. Sem anúncios invasivos, sem complexidade.
        </p>

        {/* Search Bar */}
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              placeholder="Buscar veículos, alimentos, calculadoras..."
              className="w-full rounded-xl border border-border bg-surface py-4 pl-12 pr-4 text-foreground placeholder:text-foreground-muted focus:border-success focus:outline-none focus:ring-2 focus:ring-success/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Verticais - Cards com Gradiente */}
      <div className="mb-16">
        <h2 className="mb-8 text-2xl font-bold">Explore por Vertical</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* FIPE Card */}
          <Link
            href="/fipe"
            className="group relative overflow-hidden rounded-xl border border-border bg-surface p-8 transition-all hover:border-success hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Car className="h-6 w-6 text-success" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Tabela FIPE</h3>
              <p className="text-sm text-foreground-muted">
                Consulte preços de veículos com histórico, tendências e
                estimativa de IPVA
              </p>
            </div>
          </Link>

          {/* TACO Card */}
          <Link
            href="/nutricao"
            className="group relative overflow-hidden rounded-xl border border-border bg-surface p-8 transition-all hover:border-info hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-info/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                <Apple className="h-6 w-6 text-info" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Nutrição TACO</h3>
              <p className="text-sm text-foreground-muted">
                Informações nutricionais completas da base UNICAMP com
                micronutrientes
              </p>
            </div>
          </Link>

          {/* Calculadoras Card */}
          <Link
            href="/calculadoras"
            className="group relative overflow-hidden rounded-xl border border-border bg-surface p-8 transition-all hover:border-warning hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Calculator className="h-6 w-6 text-warning" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Calculadoras</h3>
              <p className="text-sm text-foreground-muted">
                Ferramentas utilitárias para IPVA, IMC, calorias e muito mais
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Items */}
      <div>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Consultas em Destaque</h2>
          <Link
            href="/explorar"
            className="text-sm font-medium text-success hover:underline"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item) => (
            <Link
              key={item.id}
              href={`/${item.type === "fipe" ? "fipe" : "nutricao"}/${
                item.slug
              }`}
              className="card group"
            >
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.visuals.accentColor }}
                />
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                  {item.type === "fipe" ? "FIPE" : "TACO"}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-semibold group-hover:text-success transition-colors">
                {item.metadata.title}
              </h3>

              <p className="text-sm text-foreground-muted line-clamp-2">
                {item.metadata.description}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-foreground-muted">
                <span>{item.metadata.source}</span>
                <span>•</span>
                <span>{item.metadata.updatedAt}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-elevated p-12 text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Por que Portal Descomplicado?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-foreground-muted">
          Diferente dos portais tradicionais cheios de anúncios, focamos em uma
          experiência limpa e objetiva. Dados oficiais, interface moderna, zero
          distrações.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="rounded-lg bg-surface px-6 py-3">
            <p className="text-sm font-medium">✓ Interface Linear</p>
          </div>
          <div className="rounded-lg bg-surface px-6 py-3">
            <p className="text-sm font-medium">✓ Dados Oficiais</p>
          </div>
          <div className="rounded-lg bg-surface px-6 py-3">
            <p className="text-sm font-medium">✓ SEO Otimizado</p>
          </div>
          <div className="rounded-lg bg-surface px-6 py-3">
            <p className="text-sm font-medium">✓ Zero Anúncios Invasivos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
