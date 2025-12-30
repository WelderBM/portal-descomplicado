// components/shared/Navbar.tsx - Navegação Principal
"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-success to-info">
              <span className="text-lg font-bold text-background">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Portal <span className="text-success">Descomplicado</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                placeholder="Buscar veículos, alimentos, calculadoras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-elevated py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground-muted focus:border-border-hover focus:outline-none focus:ring-2 focus:ring-success/20"
              />
            </div>
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
              href="/calculadoras"
              className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              Calculadoras
            </Link>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-elevated py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground-muted focus:border-border-hover focus:outline-none focus:ring-2 focus:ring-success/20"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
