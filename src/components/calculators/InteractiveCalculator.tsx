// components/calculators/InteractiveCalculator.tsx - Calculadoras Multi-Input
"use client";

import { useState } from "react";
import { Calculator, Car, Apple } from "lucide-react";
import { formatCurrency } from "@/lib/calculators";

interface TripCalculatorProps {
  fuelPrice?: number;
  vehicleName?: string;
}

export function TripCalculator({
  fuelPrice = 6.0,
  vehicleName = "Veículo",
}: TripCalculatorProps) {
  const [distance, setDistance] = useState<number>(100);
  const [consumption, setConsumption] = useState<number>(12);
  const [customFuelPrice, setCustomFuelPrice] = useState<number>(fuelPrice);

  const litersNeeded = distance / consumption;
  const totalCost = litersNeeded * customFuelPrice;

  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2">
        <Car className="h-5 w-5 text-success" />
        <h3 className="text-lg font-semibold">Calculadora de Viagem</h3>
      </div>

      <p className="mb-4 text-sm text-foreground-muted">
        Calcule o custo estimado de uma viagem com {vehicleName}
      </p>

      <div className="space-y-4">
        {/* Distância */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Distância (km)</span>
            <span className="text-success">{distance} km</span>
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-success"
          />
        </div>

        {/* Consumo */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Consumo Médio (km/l)</span>
            <span className="text-success">{consumption} km/l</span>
          </label>
          <input
            type="range"
            min="5"
            max="20"
            step="0.5"
            value={consumption}
            onChange={(e) => setConsumption(Number(e.target.value))}
            className="w-full accent-success"
          />
        </div>

        {/* Preço do Combustível */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Preço do Combustível (R$/l)</span>
            <span className="text-success">
              {formatCurrency(customFuelPrice)}
            </span>
          </label>
          <input
            type="range"
            min="4"
            max="8"
            step="0.1"
            value={customFuelPrice}
            onChange={(e) => setCustomFuelPrice(Number(e.target.value))}
            className="w-full accent-success"
          />
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Resultados */}
        <div className="space-y-3 rounded-lg bg-surface-elevated p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground-muted">
              Litros Necessários
            </span>
            <span className="text-lg font-bold">
              {litersNeeded.toFixed(2)} L
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground-muted">Custo Total</span>
            <span className="text-2xl font-bold text-success">
              {formatCurrency(totalCost)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MealSimulatorProps {
  foodName?: string;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
}

export function MealSimulator({
  foodName = "Alimento",
  baseCalories,
  baseProtein,
  baseCarbs,
  baseFat,
}: MealSimulatorProps) {
  const [grams, setGrams] = useState<number>(100);

  const multiplier = grams / 100;
  const calories = Math.round(baseCalories * multiplier);
  const protein = (baseProtein * multiplier).toFixed(1);
  const carbs = (baseCarbs * multiplier).toFixed(1);
  const fat = (baseFat * multiplier).toFixed(1);

  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2">
        <Apple className="h-5 w-5 text-info" />
        <h3 className="text-lg font-semibold">Simulador de Refeição</h3>
      </div>

      <p className="mb-4 text-sm text-foreground-muted">
        Ajuste a quantidade de {foodName} e veja os macros em tempo real
      </p>

      <div className="space-y-4">
        {/* Quantidade */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Quantidade</span>
            <span className="text-info">{grams}g</span>
          </label>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={grams}
            onChange={(e) => setGrams(Number(e.target.value))}
            className="w-full accent-info"
          />
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Resultados */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-surface-elevated p-4">
            <p className="text-xs text-foreground-muted">Calorias</p>
            <p className="text-2xl font-bold">{calories}</p>
            <p className="text-xs text-foreground-muted">kcal</p>
          </div>
          <div className="rounded-lg bg-surface-elevated p-4">
            <p className="text-xs text-foreground-muted">Proteínas</p>
            <p className="text-2xl font-bold">{protein}</p>
            <p className="text-xs text-foreground-muted">g</p>
          </div>
          <div className="rounded-lg bg-surface-elevated p-4">
            <p className="text-xs text-foreground-muted">Carboidratos</p>
            <p className="text-2xl font-bold">{carbs}</p>
            <p className="text-xs text-foreground-muted">g</p>
          </div>
          <div className="rounded-lg bg-surface-elevated p-4">
            <p className="text-xs text-foreground-muted">Gorduras</p>
            <p className="text-2xl font-bold">{fat}</p>
            <p className="text-xs text-foreground-muted">g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
