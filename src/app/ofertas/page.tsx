// app/ofertas/page.tsx - Página de Ofertas de Afiliados
import { AffiliateShowcase } from "@/components/affiliate/AffiliateShowcase";
import { ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Ofertas e Parcerias | Portal Descomplicado",
  description:
    "Produtos e serviços selecionados com ofertas exclusivas. Seguros, suplementos e muito mais.",
};

export default function OfertasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm">
          <ShoppingBag className="h-4 w-4 text-success" />
          <span className="text-foreground-muted">
            Ofertas e Parcerias Selecionadas
          </span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Ofertas Exclusivas
        </h1>

        <p className="max-w-3xl text-lg text-foreground-muted">
          Produtos e serviços cuidadosamente selecionados para complementar sua
          experiência no Portal Descomplicado.
        </p>
      </div>

      {/* Seção Automotiva */}
      <div className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Automotivo</h2>
        <AffiliateShowcase
          primaryCategory="seguro-auto"
          secondaryCategories={["seguro-auto-premium"]}
        />
      </div>

      {/* Seção Nutrição */}
      <div className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Nutrição e Saúde</h2>
        <AffiliateShowcase
          primaryCategory="suplementos"
          secondaryCategories={["dieta-cetogenica", "produtos-naturais"]}
        />
      </div>

      {/* Benefícios */}
      <div className="rounded-xl border border-border bg-surface-elevated p-8">
        <h3 className="mb-4 text-xl font-bold">
          Por que confiar em nossas recomendações?
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <span className="text-xl">✓</span>
            </div>
            <h4 className="mb-2 font-semibold">Seleção Criteriosa</h4>
            <p className="text-sm text-foreground-muted">
              Analisamos reputação, preços e qualidade antes de recomendar
            </p>
          </div>
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <span className="text-xl">🔒</span>
            </div>
            <h4 className="mb-2 font-semibold">Segurança Garantida</h4>
            <p className="text-sm text-foreground-muted">
              Todos os parceiros são empresas estabelecidas e confiáveis
            </p>
          </div>
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <span className="text-xl">💰</span>
            </div>
            <h4 className="mb-2 font-semibold">Ofertas Exclusivas</h4>
            <p className="text-sm text-foreground-muted">
              Descontos e condições especiais para usuários do portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
