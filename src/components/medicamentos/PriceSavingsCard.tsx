import { formatCurrency } from "@/lib/calculators";
import { TrendingDown, AlertCircle } from "lucide-react";

interface PriceSavingsCardProps {
  referencePrice: number;
  genericPrice: number;
  savings: number;
  savingsPercentage: number;
}

export function PriceSavingsCard({
  referencePrice,
  genericPrice,
  savings,
  savingsPercentage,
}: PriceSavingsCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
      <div className="border-b border-border p-4 bg-surface">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-success" />
          Análise de Economia
        </h3>
      </div>

      <div className="p-6 grid gap-6 md:grid-cols-3 items-center">
        {/* Referência */}
        <div className="space-y-1 text-center md:text-left">
          <p className="text-sm font-medium text-foreground-muted">
            Medicamento Referência
          </p>
          <p className="text-2xl font-bold text-foreground line-through opacity-70">
            {formatCurrency(referencePrice)}
          </p>
        </div>

        {/* Genérico */}
        <div className="space-y-1 text-center border-l border-r border-border px-4 py-2 md:py-0 border-l-0 border-r-0 md:border-l md:border-r">
          <p className="text-sm font-medium text-success">Genérico Médio</p>
          <p className="text-3xl font-bold text-success">
            {formatCurrency(genericPrice)}
          </p>
        </div>

        {/* Economia */}
        <div className="text-center md:text-right">
          <div className="inline-flex flex-col items-center md:items-end">
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success mb-2">
              Economia de {savingsPercentage}%
            </span>
            <p className="text-sm font-medium text-foreground-muted">
              Você economiza
            </p>
            <p className="text-3xl font-bold text-success">
              {formatCurrency(savings)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-surface-elevated/50 border-t border-border flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
        <p className="text-xs text-foreground-muted">
          * Os preços são valores médios de mercado baseados em dados públicos e
          podem variar por região e farmácia. Sempre consulte um médico ou
          farmacêutico antes de trocar a medicação.
        </p>
      </div>
    </div>
  );
}
