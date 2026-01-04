// components/shared/Footer.tsx - Rodapé do Portal
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-success to-info">
                <span className="text-lg font-bold text-background">D</span>
              </div>
              <span className="text-lg font-bold">Portal Descomplicado</span>
            </div>
            <p className="text-sm text-foreground-muted max-w-md">
              Transformando dados complexos em decisões simples. Consultas
              oficiais de FIPE, TACO e calculadoras utilitárias em uma interface
              limpa e objetiva.
            </p>
          </div>

          {/* Links - Verticais */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Verticais</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/fipe"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  Tabela FIPE
                </Link>
              </li>
              <li>
                <Link
                  href="/nutricao"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  Nutrição TACO
                </Link>
              </li>
              <li>
                <Link
                  href="/calculadoras"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  Calculadoras
                </Link>
              </li>
            </ul>
          </div>

          {/* Links - Sobre */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Sobre</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sobre"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  Sobre o Projeto
                </Link>
              </li>
              <li>
                <Link
                  href="/fontes"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  Fontes de Dados
                </Link>
              </li>
              <li>
                <Link
                  href="/ofertas"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  Ofertas e Parcerias
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-foreground-muted">
            © {currentYear} Portal Descomplicado. Dados oficiais de fontes
            públicas brasileiras.
          </p>
        </div>
      </div>
    </footer>
  );
}
