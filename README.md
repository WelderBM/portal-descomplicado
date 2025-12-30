# 🚀 Portal Descomplicado

**Hub de Decisão Brasileiro** focado em utilitários digitais de alta performance e UX extrema. Transformamos dados complexos e oficiais em decisões simples através de uma interface linear e minimalista.

## 🎯 Diferencial Estratégico

Ao contrário dos concorrentes nacionais que operam como "Ad Farms" (sites poluídos de anúncios), o **Portal Descomplicado** adota:

- ✅ **Interface Linear e Minimalista** - Inspirada no benchmark global Omni Calculator
- ✅ **SEO Programático** - Milhares de páginas estáticas otimizadas
- ✅ **SSG (Static Site Generation)** - Performance máxima com Next.js
- ✅ **Monetização Contextual** - Afiliados de alto valor, sem poluição visual

## 🛠️ Stack Técnica

```
Framework:     Next.js 14+ (App Router)
Linguagem:     TypeScript
Estilização:   Tailwind CSS v4
Ícones:        Lucide React
Arquitetura:   Data-driven (JSON-first)
```

## 📁 Estrutura do Projeto

```
portal-descomplicado/
├── src/
│   ├── app/                    # Rotas Next.js
│   │   ├── page.tsx           # Landing page
│   │   ├── fipe/[slug]/       # Rotas dinâmicas FIPE
│   │   └── nutricao/[slug]/   # Rotas dinâmicas TACO
│   ├── components/
│   │   ├── UniversalCalculator.tsx  # Motor de renderização
│   │   ├── shared/            # Navbar, Footer
│   │   ├── bento/             # Cards modulares
│   │   └── ui/                # Componentes visuais
│   ├── data/
│   │   ├── fipe.json          # Dados automotivos
│   │   └── taco.json          # Dados nutricionais
│   ├── lib/
│   │   ├── calculators.ts     # Fórmulas compartilhadas
│   │   └── data-provider.ts   # Provedor de dados
│   └── types/
│       └── portal.ts          # Sistema de tipos universal
```

## 🎨 Design System

### Cores Semânticas

```css
--success: #10b981   /* Verde - Valorização, Saudável */
--danger: #ef4444    /* Vermelho - Depreciação, Alerta */
--warning: #f59e0b   /* Amarelo - Atenção */
--info: #3b82f6      /* Azul - Informação */
--neutral: #6b7280   /* Cinza - Estável */
```

### Tema

- **Dark Mode Nativo** por padrão
- **Tipografia Clara** com hierarquia visual forte
- **Layout Bento Grid** para organização modular
- **Micro-animações** para feedback visual

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

Acesse: `http://localhost:3000`

## 📊 Verticais Implementadas

### 1. Tabela FIPE (Automotiva)

- ✅ Histórico de preços (12 meses)
- ✅ Gráfico de tendência
- ✅ Estimativa de IPVA
- ✅ Análise de depreciação
- ✅ Widget de afiliado (Seguro Auto)

### 2. Tabela TACO (Nutrição)

- ✅ Macronutrientes (Calorias, Proteínas, Carboidratos, Gorduras)
- ✅ Micronutrientes com % Valor Diário
- ✅ Visualização em barras de progresso
- ✅ Insights de "Jornalismo Utilitário"
- ✅ Widget de afiliado (Suplementos)

## 🧩 Motor de Renderização (UniversalCalculator)

O componente `UniversalCalculator` é o coração do portal. Ele:

1. **Recebe um objeto JSON** (FipeItem ou TacoItem)
2. **Usa Type Guards** para identificar o tipo de dado
3. **Renderiza o layout apropriado**:
   - FIPE → Gráfico de preços + IPVA + Tendência
   - TACO → Macros + Radar de nutrientes + % VD

```typescript
// Exemplo de uso
<UniversalCalculator item={portalItem} />
```

## 🎯 SEO Programático

Cada item gera automaticamente:

- ✅ Meta tags otimizadas
- ✅ Título único e descritivo
- ✅ URL amigável (slug)
- ✅ Structured data (futuro)
- ✅ Sitemap dinâmico (futuro)

## 📈 Próximos Passos

### Fase 2 - Expansão de Dados

- [ ] Integração com API FIPE oficial
- [ ] Expandir base TACO (500+ alimentos)
- [ ] Adicionar vertical de Medicamentos
- [ ] Calculadoras interativas (IMC, IPVA, etc.)

### Fase 3 - Features Avançadas

- [ ] Busca semântica com Fuse.js
- [ ] Comparador de veículos/alimentos
- [ ] Sistema de favoritos (localStorage)
- [ ] PWA (Progressive Web App)

### Fase 4 - Monetização

- [ ] Integração com afiliados de seguros
- [ ] Parcerias com e-commerces de suplementos
- [ ] Google AdSense contextual (não invasivo)

## 🏆 Diferenciais Técnicos

1. **Data-First Architecture**: Escalar é apenas "jogar mais JSONs"
2. **Type Safety**: TypeScript garante consistência
3. **Performance**: SSG = páginas instantâneas
4. **SEO Nativo**: Cada dado vira uma página indexável
5. **Design Premium**: Foge do padrão "Ad Farm" brasileiro

## 📝 Licença

Este projeto é privado e proprietário.

---

**Desenvolvido com ❤️ para descomplicar dados complexos**
