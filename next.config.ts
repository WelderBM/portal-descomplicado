import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Suprime avisos de hidratação causados por extensões do navegador
    suppressHydrationWarning: true,
  },
};

export default nextConfig;
