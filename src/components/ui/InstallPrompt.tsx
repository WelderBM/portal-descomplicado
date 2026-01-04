"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Registrar Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registrado com sucesso"))
        .catch((err) =>
          console.error("Falha ao registrar Service Worker:", err)
        );
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Previne o prompt padrão do Chrome
      e.preventDefault();
      // Salva o evento para acionar depois
      setDeferredPrompt(e);

      // Verifica se já foi descartado recentemente
      const hasDismissed = localStorage.getItem("pwa-prompt-dismissed");
      if (!hasDismissed) {
        // Mostra o prompt após 10 segundos de navegação
        setTimeout(() => setIsVisible(true), 10000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostra o prompt nativo
    deferredPrompt.prompt();

    // Aguarda a escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Não mostrar novamente por 7 dias (simulado aqui apenas salvando flag)
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
      >
        <div className="flex items-start gap-4 rounded-xl border border-success/30 bg-surface-elevated p-4 shadow-2xl backdrop-blur-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-success to-info">
            <span className="font-bold text-white">D</span>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              Instalar Aplicativo
            </h3>
            <p className="mt-1 text-sm text-foreground-muted">
              Instale o Portal Descomplicado para acesso rápido e modo offline.
            </p>
            <div className="mt-3 flex gap-3">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success-hover"
              >
                <Download className="h-4 w-4" />
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground-muted hover:bg-surface hover:text-foreground transition-colors"
              >
                Agora não
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-foreground-muted hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
