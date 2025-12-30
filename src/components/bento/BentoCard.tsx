// components/bento/BentoCard.tsx - Card Base para Bento Grid
import { ReactNode } from "react";

interface BentoCardProps {
  title: string;
  description?: string;
  accentColor?: string;
  children: ReactNode;
  className?: string;
}

export function BentoCard({
  title,
  description,
  accentColor = "#6b7280",
  children,
  className = "",
}: BentoCardProps) {
  return (
    <div
      className={`card group relative overflow-hidden ${className}`}
      style={
        {
          "--accent-color": accentColor,
        } as React.CSSProperties
      }
    >
      {/* Accent Border Top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
