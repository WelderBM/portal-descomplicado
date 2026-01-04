// components/affiliate/AffiliateOffer.tsx - Widget de Afiliados Inteligente
"use client";

import { ExternalLink, Shield, ShoppingCart, Zap, Star } from "lucide-react";

export type AffiliateCategory =
  | "seguro-auto"
  | "seguro-auto-premium"
  | "suplementos"
  | "dieta-cetogenica"
  | "produtos-naturais"
  | "farmacia";

export interface AffiliateOfferProps {
  category: AffiliateCategory;
  itemValue?: number; // Valor do item (para carros)
  itemName?: string; // Nome do item
  isLowCarb?: boolean; // Para alimentos low-carb
}

interface OfferConfig {
  title: string;
  description: string;
  cta: string;
  url: string;
  icon: typeof Shield;
  badge?: string;
  accentColor: string;
  features: string[];
}

const OFFER_CONFIGS: Record<AffiliateCategory, OfferConfig> = {
  "seguro-auto": {
    title: "Seguro Auto com Desconto",
    description: "Compare cotações de seguradoras e economize até 30%",
    cta: "Cotar Agora",
    url: "https://exemplo.com/seguro-auto",
    icon: Shield,
    accentColor: "#3b82f6",
    features: [
      "Comparação de 10+ seguradoras",
      "Cotação em 2 minutos",
      "Desconto exclusivo para novos clientes",
    ],
  },
  "seguro-auto-premium": {
    title: "Seguro Premium para Veículos de Luxo",
    description:
      "Proteção especializada para veículos acima de R$ 100.000 com cobertura completa",
    cta: "Solicitar Cotação Premium",
    url: "https://exemplo.com/seguro-premium",
    icon: Shield,
    badge: "Premium",
    accentColor: "#f59e0b",
    features: [
      "Cobertura internacional",
      "Assistência 24h especializada",
      "Carro reserva de luxo",
      "Proteção de vidros e faróis",
    ],
  },
  suplementos: {
    title: "Suplementos Nutricionais",
    description: "Potencialize sua dieta com suplementos de qualidade",
    cta: "Ver Produtos",
    url: "https://exemplo.com/suplementos",
    icon: Zap,
    accentColor: "#10b981",
    features: [
      "Whey Protein isolado",
      "Multivitamínicos premium",
      "Frete grátis acima de R$ 99",
    ],
  },
  "dieta-cetogenica": {
    title: "Produtos Low Carb e Keto",
    description: "Alimentos e suplementos para dieta cetogênica e low carb",
    cta: "Explorar Produtos Keto",
    url: "https://exemplo.com/keto",
    icon: ShoppingCart,
    badge: "Keto",
    accentColor: "#8b5cf6",
    features: [
      "MCT Oil e Óleo de Coco",
      "Snacks zero açúcar",
      "Farinhas low carb",
      "Adoçantes naturais",
    ],
  },
  "produtos-naturais": {
    title: "Alimentos Naturais e Orgânicos",
    description: "Produtos orgânicos certificados direto do produtor",
    cta: "Ver Produtos Naturais",
    url: "https://exemplo.com/organicos",
    icon: Star,
    accentColor: "#10b981",
    features: ["Certificação orgânica", "Sem agrotóxicos", "Entrega semanal"],
  },
  farmacia: {
    title: "Ofertas em Farmácias Online",
    description:
      "Encontre o melhor preço para seus medicamentos e produtos de saúde",
    cta: "Ver Ofertas",
    url: "https://exemplo.com/farmacia",
    icon: ShoppingCart,
    accentColor: "#06b6d4", // Cyan
    features: [
      "Entrega rápida para todo Brasil",
      "Descontos exclusivos online",
      "Parcele suas compras",
    ],
  },
};

export function AffiliateOffer({
  category,
  itemValue,
  itemName,
  isLowCarb,
}: AffiliateOfferProps) {
  const config = OFFER_CONFIGS[category];
  const Icon = config.icon;

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border bg-linear-to-br from-surface to-surface-elevated p-6"
      style={{
        borderColor: `${config.accentColor}33`,
      }}
    >
      {/* Badge Premium */}
      {config.badge && (
        <div className="absolute top-4 right-4">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
            style={{
              backgroundColor: `${config.accentColor}22`,
              color: config.accentColor,
            }}
          >
            {config.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${config.accentColor}22` }}
        >
          <Icon className="h-6 w-6" style={{ color: config.accentColor }} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{config.title}</h3>
          <p className="mt-1 text-sm text-foreground-muted">
            {config.description}
          </p>
        </div>
      </div>

      {/* Features */}
      <ul className="mb-6 space-y-2">
        {config.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm text-foreground-muted"
          >
            <div
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: config.accentColor }}
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <a
        href={config.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-all hover:scale-105"
        style={{ backgroundColor: config.accentColor }}
      >
        {config.cta}
        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </a>

      {/* Disclaimer */}
      <p className="mt-4 text-center text-xs text-foreground-muted">
        Link de afiliado • Podemos receber comissão
      </p>
    </div>
  );
}

/**
 * Determina categoria de afiliado baseada no contexto
 */
export function getAffiliateCategory(
  type: "fipe" | "taco" | "medicamentos" | string,
  itemValue?: number,
  carbs?: number
): AffiliateCategory {
  if (type === "fipe") {
    // Carros acima de R$ 100k = seguro premium
    if (itemValue && itemValue > 100000) {
      return "seguro-auto-premium";
    }
    return "seguro-auto";
  }

  if (type === "medicamentos") {
    return "farmacia";
  }

  // TACO - Nutrição
  if (carbs !== undefined && carbs < 5) {
    return "dieta-cetogenica"; // Low carb
  }

  return "suplementos";
}
