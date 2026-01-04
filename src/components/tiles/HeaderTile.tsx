import { Share2 } from "lucide-react";

interface HeaderTileProps {
  title: string;
  badge: string;
  description?: string;
  source?: string;
  updatedAt?: string;
}

export function HeaderTile({
  title,
  badge,
  description,
  source,
  updatedAt,
}: HeaderTileProps) {
  return (
    <div className="col-span-full mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-semibold uppercase text-foreground-muted">
          {badge}
        </span>
        {updatedAt && (
          <span className="text-xs text-foreground-muted">
            • Atualizado em {new Date(updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-foreground-muted max-w-2xl">
              {description}
            </p>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md bg-surface border border-border p-2 hover:bg-surface-elevated transition-colors"
          title="Compartilhar"
        >
          <Share2 className="h-5 w-5 text-foreground-muted" />
        </button>
      </div>

      {source && (
        <p className="mt-4 text-xs text-foreground-muted uppercase tracking-wider">
          Fonte: {source}
        </p>
      )}
    </div>
  );
}
