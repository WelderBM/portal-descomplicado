// components/ui/NutrientRadar.tsx - Visualização de Nutrientes
"use client";

interface Nutrient {
  name: string;
  value: number;
  unit: string;
  dailyValuePercentage: number;
}

interface NutrientRadarProps {
  nutrients: Nutrient[];
  accentColor?: string;
}

export function NutrientRadar({
  nutrients,
  accentColor = "#10b981",
}: NutrientRadarProps) {
  if (!nutrients || nutrients.length === 0) return null;

  return (
    <div className="space-y-3">
      {nutrients.map((nutrient, index) => {
        const percentage = Math.min(nutrient.dailyValuePercentage, 100);
        const isHigh = percentage >= 20;

        return (
          <div key={index} className="space-y-1">
            {/* Label */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{nutrient.name}</span>
              <span className="text-foreground-muted">
                {nutrient.value}
                {nutrient.unit} ({percentage}% VD)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: isHigh ? accentColor : "#6b7280",
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="mt-4 rounded-lg bg-surface-elevated p-3">
        <p className="text-xs text-foreground-muted">
          <strong>VD:</strong> Valor Diário de referência baseado em uma dieta
          de 2.000 kcal
        </p>
      </div>
    </div>
  );
}
