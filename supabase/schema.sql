-- Enable UUID extension for unique identifiers
create extension if not exists "uuid-ossp";

-- Enable Full Text Search extension
create extension if not exists "pg_trgm";

--------------------------------------------------------------
-- 1. Tabela de Verticais (Meta-configuração)
-- Define quais tipos de dados o portal suporta e como exibi-los
--------------------------------------------------------------
create table verticals (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,          -- ex: 'fipe', 'medicamentos', 'nutricao'
  name text not null,                 -- ex: 'Tabela FIPE', 'Medicamentos'
  description text,                   
  
  -- Configuração de UI: Define quais "Tiles" essa vertical usa
  -- Ex: ['price_chart', 'nutrition_facts', 'comparison_radar']
  ui_config jsonb not null default '[]',
  
  created_at timestamp with time zone default now()
);

--------------------------------------------------------------
-- 2. Tabela de Itens do Portal (Omnisearch Index)
-- O coração do sistema: armazena todos os itens de todas as verticais
--------------------------------------------------------------
create table portal_items (
  id uuid primary key default uuid_generate_v4(),
  vertical_id uuid references verticals(id) on delete cascade,
  
  -- Identificadores Básicos
  slug text not null,                 -- URL amigável (parte final)
  title text not null,                -- Título principal para busca
  description text,                   -- Subtítulo/Resumo para SEO e cards
  
  -- Payload Flexível (Schema-less)
  -- Aqui reside a mágica: guarda qualquer estrutura de dado específica
  -- FIPE: { "price_history": [...], "fuel": "Gasolina" }
  -- MEDS: { "anvisa_id": "...", "substance": "Dipirona" }
  data jsonb not null default '{}',
  
  -- Campos de Busca e Indexação
  -- search_vectors será populado via trigger para busca full-text rápida
  search_vectors tsvector,
  
  updated_at timestamp with time zone default now(),
  
  -- Garante que não existam dois itens com mesmo slug na mesma vertical
  unique(vertical_id, slug)
);

--------------------------------------------------------------
-- 3. Índices de Performance
--------------------------------------------------------------
-- Índice GIN para busca full-text rápida no título e descrição
create index portal_items_search_idx on portal_items using gin(to_tsvector('portuguese', title || ' ' || coalesce(description, '')));
-- Índice para busca rápida dentro do JSONB (caso precise filtrar por campos específicos)
create index portal_items_data_gin_idx on portal_items using gin(data);

--------------------------------------------------------------
-- 4. Função para Atualizar Search Vectors Automaticamente
--------------------------------------------------------------
create function portal_items_search_trigger() returns trigger as $$
begin
  new.search_vectors :=
    setweight(to_tsvector('portuguese', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(new.description, '')), 'B');
  return new;
end
$$ language plpgsql;

create trigger tsvectorupdate before insert or update
on portal_items for each row execute procedure portal_items_search_trigger();

--------------------------------------------------------------
-- 5. Dados Iniciais (Seed das Verticais)
--------------------------------------------------------------
insert into verticals (slug, name, description, ui_config) values
('fipe', 'Tabela FIPE', 'Consulta de preços de veículos', '["price_chart", "depreciation_badge", "history_list"]'),
('nutricao', 'Tabela TACO', 'Dados nutricionais de alimentos', '["nutrition_facts", "macros_pie_chart", "comparison_radar"]'),
('medicamentos', 'Medicamentos', 'Consulta de preços e genéricos', '["price_comparison", "active_ingredient_badge", "generics_list"]');
