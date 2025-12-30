// components/shared/SearchBar.tsx - Busca Avançada com Fuse.js
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { searchItems } from "@/lib/data-provider";
import { PortalItem } from "@/types/portal";
import Link from "next/link";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Buscar veículos, alimentos, calculadoras...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PortalItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Busca com debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      const searchResults = searchItems(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
    }, 300); // 300ms de debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleSelectItem = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface-elevated py-2 pl-10 pr-10 text-sm text-foreground placeholder:text-foreground-muted focus:border-success focus:outline-none focus:ring-2 focus:ring-success/20 transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto rounded-lg border border-border bg-surface shadow-xl z-50">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-foreground-muted">
              {results.length} resultado{results.length !== 1 ? "s" : ""}{" "}
              encontrado{results.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-1">
              {results.slice(0, 8).map((item) => (
                <Link
                  key={item.id}
                  href={`/${item.type === "fipe" ? "fipe" : "nutricao"}/${
                    item.slug
                  }`}
                  onClick={handleSelectItem}
                  className="flex items-start gap-3 rounded-lg p-3 hover:bg-surface-elevated transition-colors"
                >
                  {/* Type Badge */}
                  <div
                    className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: item.visuals.accentColor }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                        {item.type === "fipe" ? "FIPE" : "TACO"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.metadata.title}
                    </p>
                    <p className="text-xs text-foreground-muted line-clamp-1">
                      {item.metadata.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {results.length > 8 && (
              <p className="px-3 py-2 text-xs text-center text-foreground-muted">
                + {results.length - 8} resultado
                {results.length - 8 !== 1 ? "s" : ""} não exibido
                {results.length - 8 !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-surface shadow-xl z-50">
          <div className="p-4 text-center">
            <p className="text-sm text-foreground-muted">
              Nenhum resultado encontrado para "{query}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
