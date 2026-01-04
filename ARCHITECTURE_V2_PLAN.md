# Portal Descomplicado V2: Plano Diretor de Arquitetura & Escalabilidade

**Autor:** Equipe de Arquitetura & Design  
**Data:** 03 de Janeiro de 2026  
**Status:** Proposta de Refatoração (Draft)

---

## 1. Visão Executiva

O objetivo deste documento é traçar o caminho técnico para transformar o Portal Descomplicado de um "Agregador Estático" para um "Portal Engine" escalável. A meta é suportar volumes de dados na casa dos milhões (Big Data) e permitir a adição de novas verticais (ex: Energia, Impostos, Leis) puramente através de dados e configuração, sem necessidade de refatoração constante de código.

## 2. Arquitetura de Dados (Schema-Driven)

### Do Estático para o Dinâmico

Atualmente, usamos TypeScript Unions (`FipeItem | TacoItem`) que são rígidos. Para escalar, precisamos de um modelo agnóstico onde a estrutura do dado define a renderização.

#### Proposta de Modelagem (PostgreSQL / Supabase JSONB)

Em vez de tabelas separadas para cada vertical, utilizaremos uma abordagem híbrida Relacional + Documento:

```sql
-- Tabela Mestra de Verticais
CREATE TABLE verticals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, -- ex: 'fipe', 'medicamentos'
  name TEXT NOT NULL,

  -- Definição de quais "Tiles" (blocos de UI) essa vertical usa
  -- Ex: ['price_chart', 'nutritional_info', 'comparison_radar']
  ui_config JSONB NOT NULL DEFAULT '[]'
);

-- Tabela Mestra de Itens (Omnisearch Index)
CREATE TABLE portal_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vertical_id UUID REFERENCES verticals(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT, -- Para SEO e Busca

  -- Dados Específicos da Vertical (Schema-less)
  -- Aqui entra o payload variável: FIPE tem price_history, Medicamento tem anvisa_id
  data JSONB NOT NULL,

  -- Metadados de Indexação (para busca rápida sem abrir o JSONB)
  search_vectors TSVECTOR,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vertical_id, slug)
);
```

#### O "Contrato Universal" de Metadados

O frontend deixará de saber o que é um "Medicamento" e passará a saber o que é um "Item com Preço".
O campo `data` do JSONB seguirá "Traits" (Traços):

- **Trait `has_price`**: Se presente, renderiza o componente de preço.
- **Trait `has_chart`**: Se presente, renderiza gráfico.
- **Trait `has_ingredients`**: Se presente, renderiza lista de componentes.

## 3. UI/UX Escalável: O Conceito de "Information Tiles"

A interface deixará de ser desenhada página a página. Implementaremos um **Layout Engine** no frontend.

### Componentização Modular (Tiles)

Cada página de detalhe será um Grid (Bento) preenchido dinamicamente:

1.  **Header Tile**: Título, Badge da Vertical, Share button (Universal).
2.  **Price Tile**: Componente genérico que aceita `currentPrice`, `currency`, `history` e exibe o valor em destaque c/ variação.
3.  **Key-Value Tile**: Renderiza listas de propriedades (ex: "Princípio Ativo: X", "Marca: Y") baseado em configuração.
4.  **Radar Tile**: Para comparações (Nutrição ou specs técnicas).

**Lógica de Renderização (Pseudo-React):**

```tsx
// src/app/[vertical]/[slug]/page.tsx
export default async function UniversalPage({ params }) {
  const item = await db.getItem(params.vertical, params.slug);
  const verticalConfig = await db.getVerticalConfig(params.vertical);

  return (
    <BentoGrid>
      <HeaderTile title={item.title} badge={verticalConfig.name} />

      {verticalConfig.tiles.includes("price") && (
        <PriceTile data={item.data.price_info} />
      )}

      {verticalConfig.tiles.includes("nutrition") && (
        <NutritionTile data={item.data.macros} />
      )}

      {/* Fallback para dados genéricos */}
      <PropertiesTile data={item.data.properties} />
    </BentoGrid>
  );
}
```

### Federated Omnisearch (Cmd+K)

- **Frontend**: Um modal global invocado por `Cmd+K` ou ícone de lupa.
- **Backend**: TypeSense ou Meilisearch (Self-hosted ou Cloud).
- **UX**:
  - Digitar "Para" -> Sugere "Medicamentos > **Para**cetamol".
  - Digitar "Civic" -> Sugere "FIPE > Honda **Civic**".
- **Performance**: A busca retorna apenas o ID, Título, Slug e Tipo. O resto carrega on-demand.

## 4. Pipeline de Dados (ETL & Serverless)

Não rodaremos mais scripts na máquina local.

**Fluxo Automatizado:**

1.  **Trigger**: Cron Job (GitHub Actions ou Cloud Scheduler) dispara às 03:00 AM.
2.  **Extract (Scrapers)**: Scripts TypeScript isolados (Lambda Functions) buscam dados na fonte (API FIPE, CSV Anvisa, etc).
3.  **Transform (Normalizer)**:
    - Processo crucial: Converter o dado bruto no formato **JSONB Universal**.
    - Ex: Normalizar chaves `valor`, `price`, `preco` para `price_value`.
4.  **Load (Upsert)**: Inserir no Supabase/PostgreSQL.
5.  **Revalidate**: Chamar Webhook do Next.js para revalidar cache ISR das páginas afetadas.

## 5. SEO Programático & Performance

Como indexar 10 milhões de páginas sem estourar o build?

### Incremental Static Regeneration (ISR)

- **Build Time**: Geramos estaticamente apenas as Top 1000 páginas (Home + Mais acessados).
- **Runtime**: As outras 9.999.000 páginas são geradas na primeira requisição e cacheadas na Edge (Vercel CDN).
- **Revalidação**: Configurada com `revalidate: 86400` (24h) ou via Tag Revalidation (On-demand) quando o ETL rodar.
- **Sitemap**: Gerar sitemaps divididos (sitemap-fipe-1.xml, sitemap-med-1.xml) dinamicamente via rota de API, não arquivo estático.

## Roteiro de Implementação (Phased Rollout)

1.  **Fase 1: O "Cérebro" (Backend)**

    - Configurar Supabase.
    - Criar tabelas `verticals` e `portal_items`.
    - Migrar dados JSON atuais para o DB.

2.  **Fase 2: O "Motor" (Busca e API)**

    - Criar endpoints de busca otimizados no Next.js (Server Actions).
    - Substituir `data-provider.ts` local por chamadas ao DB.

3.  **Fase 3: A "Casca" (Frontend Dinâmico)**

    - Criar rota dinâmica `[vertical]/[slug]`.
    - Refatorar componentes para serem "Tiles" independentes.

4.  **Fase 4: A "Escala" (ETL e Automação)**
    - Mover scripts de scrape para GitHub Actions/Cron.
    - Implementar revalidação de cache.
