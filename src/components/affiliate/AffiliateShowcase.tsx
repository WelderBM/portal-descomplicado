// components/affiliate/AffiliateShowcase.tsx - Showcase de Ofertas de Afiliados
"use client";

import { AffiliateOffer, AffiliateCategory } from "./AffiliateOffer";

interface AffiliateShowcaseProps {
  primaryCategory: AffiliateCategory;
  secondaryCategories?: AffiliateCategory[];
  itemValue?: number;
  itemName?: string;
  isLowCarb?: boolean;
}

export function AffiliateShowcase({
  primaryCategory,
  secondaryCategories = [],
  itemValue,
  itemName,
  isLowCarb,
}: AffiliateShowcaseProps) {
  const allCategories = [primaryCategory, ...secondaryCategories];

  return (
    <div className="space-y-4">
      {/* Título da Seção */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Ofertas Recomendadas</h2>
        <p className="mt-2 text-foreground-muted">
          Produtos e serviços selecionados para você
        </p>
      </div>

      {/* Grid de Ofertas */}
      <div className="grid gap-6 md:grid-cols-2">
        {allCategories.map((category, index) => (
          <AffiliateOffer
            key={category}
            category={category}
            itemValue={itemValue}
            itemName={itemName}
            isLowCarb={isLowCarb}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-lg border border-border bg-surface-elevated p-4">
        <p className="text-xs text-foreground-muted">
          <strong>Transparência:</strong> Este portal pode receber comissões por
          compras realizadas através dos links de afiliados. Isso não afeta o
          preço que você paga e nos ajuda a manter o portal gratuito e
          atualizado.
        </p>
      </div>
    </div>
  );
}
