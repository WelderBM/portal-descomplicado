// components/shared/Navbar.tsx - Navegação Principal
"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";

export function Navbar() {
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
            <SearchBar />
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
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
