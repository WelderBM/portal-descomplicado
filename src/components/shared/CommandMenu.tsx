"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Car,
  Pill,
  Apple,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { omnisearch } from "@/lib/omnisearch";
import { useRouter } from "next/navigation";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  // Toggle com Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Busca Debounced
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const data = await omnisearch(query);
      setResults(data);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  const VerticalIcon = ({ slug }: { slug: string }) => {
    switch (slug) {
      case "fipe":
        return <Car className="mr-2 h-4 w-4" />;
      case "medicamentos":
        return <Pill className="mr-2 h-4 w-4" />;
      case "nutricao":
        return <Apple className="mr-2 h-4 w-4" />;
      default:
        return <Search className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Botão Trigger (Pode ser colocado no Navbar) */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="inline-flex lg:hidden">
          <Search className="h-4 w-4" />
        </span>
        <span className="hidden lg:inline-flex text-muted-foreground font-normal">
          Buscar veículos, alimentos...
        </span>
        <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Digite para buscar..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          {query.length === 0 && (
            <CommandGroup heading="Sugestões">
              <CommandItem onSelect={() => handleSelect("/fipe")}>
                <Car className="mr-2 h-4 w-4" />
                <span>Consultar FIPE</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/medicamentos")}>
                <Pill className="mr-2 h-4 w-4" />
                <span>Pesquisar Medicamentos</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/nutricao")}>
                <Apple className="mr-2 h-4 w-4" />
                <span>Tabela Nutricional</span>
              </CommandItem>
            </CommandGroup>
          )}

          {results.length > 0 && (
            <CommandGroup heading="Resultados">
              {results.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() =>
                    handleSelect(`/${item.verticalSlug}/${item.slug}`)
                  }
                >
                  <VerticalIcon slug={item.verticalSlug} />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
