// components/shared/Navbar.tsx - Navegação Principal
"use client";

import Link from "next/link";
import { CommandMenu } from "./CommandMenu";
import { Car, Apple } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-success to-info">
              <span className="text-lg font-bold text-background">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Portal <span className="text-success">Descomplicado</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <CommandMenu />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/fipe"
              className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              FIPE
            </Link>
            <Link
              href="/nutricao"
              className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              Nutrição
            </Link>
            <Link
              href="/medicamentos"
              className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              Medicamentos
            </Link>
            <div className="h-4 w-px bg-border" />
            <Link
              href="/minha-garagem"
              className="flex items-center gap-1.5 text-sm font-medium text-foreground-muted transition-colors hover:text-success"
              title="Minha Garagem"
            >
              <Car className="h-4 w-4" />
              <span className="hidden lg:inline">Garagem</span>
            </Link>
            <Link
              href="/meu-diario"
              className="flex items-center gap-1.5 text-sm font-medium text-foreground-muted transition-colors hover:text-info"
              title="Meu Diário"
            >
              <Apple className="h-4 w-4" />
              <span className="hidden lg:inline">Diário</span>
            </Link>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <CommandMenu />
        </div>
      </div>
    </nav>
  );
}
