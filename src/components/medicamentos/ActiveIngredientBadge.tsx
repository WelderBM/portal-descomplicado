import { Beaker } from "lucide-react";

interface ActiveIngredientBadgeProps {
  ingredient: string;
}

export function ActiveIngredientBadge({
  ingredient,
}: ActiveIngredientBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-info/20 bg-info/10 px-3 py-1 text-sm font-medium text-info">
      <Beaker className="h-4 w-4" />
      <span>Princípio Ativo: {ingredient}</span>
    </div>
  );
}
