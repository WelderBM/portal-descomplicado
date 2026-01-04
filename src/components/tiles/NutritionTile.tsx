import { BentoCard } from "@/components/bento/BentoCard";

interface NutritionTileProps {
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  servingSize?: string;
}

export function NutritionTile({ macros, servingSize }: NutritionTileProps) {
  if (!macros) return null;

  return (
    <BentoCard
      title="Informação Nutricional"
      description={servingSize ? `Porção de ${servingSize}` : "Por 100g"}
      className="col-span-1 md:col-span-2"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <div className="flex flex-col p-3 bg-surface-elevated rounded-lg">
          <span className="text-xs text-foreground-muted uppercase">
            Calorias
          </span>
          <span className="text-2xl font-bold">{macros.calories}</span>
          <span className="text-xs text-foreground-muted">kcal</span>
        </div>
        <div className="flex flex-col p-3 bg-surface-elevated rounded-lg">
          <span className="text-xs text-foreground-muted uppercase">
            Proteína
          </span>
          <span className="text-2xl font-bold text-blue-500">
            {macros.protein}g
          </span>
        </div>
        <div className="flex flex-col p-3 bg-surface-elevated rounded-lg">
          <span className="text-xs text-foreground-muted uppercase">
            Carbos
          </span>
          <span className="text-2xl font-bold text-yellow-500">
            {macros.carbs}g
          </span>
        </div>
        <div className="flex flex-col p-3 bg-surface-elevated rounded-lg">
          <span className="text-xs text-foreground-muted uppercase">
            Gorduras
          </span>
          <span className="text-2xl font-bold text-red-500">{macros.fat}g</span>
        </div>
      </div>
    </BentoCard>
  );
}
