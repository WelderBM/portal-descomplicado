# 📱 Implementação PWA - Portal Descomplicado

## Visão Geral

Implementamos o suporte a Progressive Web App (PWA) permitindo que o Portal Descomplicado seja instalado em dispositivos móveis e desktop, com suporte a funcionamento offline.

> **Nota Técnica:** Devido a incompatibilidades entre o plugin `@ducanh2912/next-pwa` e o Next.js 16.1.1 (erros de build "WorkerError"), optamos por uma implementação manual robusta do Service Worker.

---

## 🛠️ Componentes

### 1. Manifesto (`public/manifest.json`)

Define a identidade do aplicativo quando instalado.

- **Nome:** Portal Descomplicado
- **Cor Tema:** #0a0a0a (Dark Mode)
- **Atalhos:** Acesso rápido para FIPE, Nutrição e Garagem.

### 2. Service Worker (`public/sw.js`)

Script executado em segundo plano que gerencia o cache.

- **Estratégia:** Cache First para assets estáticos, Network First para dados.
- **Cache:** Páginas principais (`/`, `/fipe`, `/nutricao`), ícones e manifesto.
- **Offline:** Permite navegação básica sem internet após a primeira visita.

### 3. Install Prompt (`src/components/ui/InstallPrompt.tsx`)

Componente React que gerencia a experiência de instalação.

- **Auto-registro:** Registra o `sw.js` automaticamente ao carregar.
- **UX:** Aparece após 10s de navegação para não ser intrusivo.
- **Persistência:** Lembra se o usuário fechou o aviso (localStorage).
- **Animação:** Usa `framer-motion` para entrada suave.

---

## 🚀 Como Testar

1. Acesse o portal em um navegador (Chrome/Edge/Safari).
2. Navegue por alguns segundos.
3. O prompt "Instalar Aplicativo" aparecerá no rodapé.
4. Clique em "Instalar" para adicionar à tela inicial.
5. Desligue a internet e recarregue a página para testar o modo offline.

## 🔧 Manutenção

Para atualizar o cache do Service Worker, altere a constante `CACHE_NAME` em `public/sw.js` (ex: de `v1` para `v2`). Isso forçará os navegadores a baixarem a nova versão dos arquivos.
