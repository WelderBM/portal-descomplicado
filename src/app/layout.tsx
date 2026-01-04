import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { InstallPrompt } from "@/components/ui/InstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal Descomplicado - Dados Oficiais Simplificados",
  description:
    "Consulte FIPE, Tabela TACO e calculadoras utilitárias em uma interface limpa. Transformamos dados complexos em decisões simples.",
  keywords: [
    "FIPE",
    "Tabela FIPE",
    "TACO",
    "Nutrição",
    "Calculadoras",
    "IPVA",
    "Preço de Veículos",
  ],
  manifest: "/manifest.json",
  themeColor: "#0a0a0a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Descomplicado",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <InstallPrompt />
      </body>
    </html>
  );
}
