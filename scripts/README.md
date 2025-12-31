# 🤖 Scripts de Automação de Dados

Este diretório contém scripts para automatizar a coleta e atualização de dados do Portal Descomplicado.

## 📋 Scripts Disponíveis

### 1. `scrape-fipe.ts` - Scraping da Tabela FIPE

**Descrição:** Coleta dados atualizados da API FIPE Paralela (gratuita).

**Uso:**

```bash
npm run scrape:fipe
```

**Funcionalidades:**

- ✅ Busca marcas, modelos e anos de veículos
- ✅ Gera IDs únicos baseados no código FIPE
- ✅ Cria slugs SEO-friendly
- ✅ Calcula IPVA estimado (4% SP)
- ✅ Gera histórico de preços simulado
- ✅ Determina tendência (up/down/stable)
- ✅ Salva em `src/data/fipe-scraped.json`

**Configuração:**

```typescript
// Limitar número de marcas e modelos
scrapeFipe(maxBrands: 3, maxModelsPerBrand: 2)
```

---

### 2. `scrape-taco.ts` - Conversão de Dados TACO

**Descrição:** Converte arquivo Excel da Tabela TACO (UNICAMP) para JSON.

**Pré-requisito:**

1. Baixar arquivo Excel da TACO: http://www.nepa.unicamp.br/taco/
2. Salvar em: `data-sources/taco.xlsx`

**Uso:**

```bash
npm run scrape:taco
```

**Funcionalidades:**

- ✅ Lê arquivo Excel (.xlsx)
- ✅ Gera IDs únicos (taco-0001, taco-0002, etc.)
- ✅ Cria slugs SEO-friendly
- ✅ Calcula % Valor Diário (VD) de nutrientes
- ✅ Gera insights automáticos baseados em macros
- ✅ Determina cor de destaque (proteína/carbo/gordura)
- ✅ Salva em `src/data/taco-scraped.json`

**Valores Diários de Referência (Anvisa):**

- Cálcio: 1000mg
- Magnésio: 260mg
- Ferro: 14mg
- Sódio: 2400mg
- Potássio: 3500mg
- Zinco: 7mg
- Vitamina C: 45mg
- Vitamina B6: 1.3mg
- Vitamina A: 600mcg
- Fibras: 25g

---

### 3. `merge-data.ts` - Merge com Consistência de SEO

**Descrição:** Faz merge de dados novos com existentes, preservando IDs e slugs.

**Uso:**

```bash
npm run merge:data
```

**Estratégia de Merge:**

1. **Mantém IDs originais** - Não quebra links internos
2. **Preserva slugs** - Mantém URLs para SEO
3. **Atualiza dados** - Preço, nutrientes, etc.
4. **Adiciona novos itens** - Com IDs/slugs únicos
5. **Evita duplicatas** - Verifica slugs existentes

**Resultado:**

```
📊 Resultado do merge FIPE:
  ✅ Mantidos: 2
  🔄 Atualizados: 1
  ➕ Adicionados: 3
  📦 Total: 6
```

---

## 🔄 Workflow Completo

### Atualização Manual

```bash
# 1. Scraping FIPE
npm run scrape:fipe

# 2. Merge de dados
npm run merge:data

# 3. Rebuild do site
npm run build
```

### Atualização Automática (Tudo de uma vez)

```bash
npm run update:all
```

---

## 🤖 GitHub Actions

O workflow `.github/workflows/update-data.yml` automatiza a atualização:

**Agenda:**

- ⏰ Toda segunda-feira às 3h da manhã (UTC)
- 🖱️ Execução manual via GitHub UI

**Fluxo:**

1. Executa `scrape-fipe.ts`
2. Executa `merge-data.ts`
3. Commita alterações
4. Rebuild do site
5. Deploy automático

**Configuração:**

```yaml
on:
  schedule:
    - cron: "0 3 * * 1" # Segunda-feira 3h UTC
  workflow_dispatch: # Execução manual
```

---

## 🔒 Garantias de Consistência

### IDs

- **FIPE:** `fipe-{codigo_fipe_numerico}`
- **TACO:** `taco-{numero_padded_4_digitos}`

**Exemplo:**

```typescript
generateId("012345-6"); // → "fipe-0123456"
generateId(42); // → "taco-0042"
```

### Slugs

- **Formato:** `marca-modelo-ano` ou `nome-alimento`
- **Normalização:** lowercase, sem acentos, hífens
- **Unicidade:** Adiciona sufixo numérico se duplicado

**Exemplo:**

```typescript
generateSlug("Fiat", "Uno Vivace 1.0", 2020);
// → "fiat-uno-vivace-1-0-2020"

generateSlug("Arroz Integral Cozido");
// → "arroz-integral-cozido"
```

---

## 📊 Estrutura de Dados

### FIPE Item

```json
{
  "id": "fipe-0123456",
  "slug": "fiat-uno-vivace-1-0-2020",
  "type": "fipe",
  "metadata": { ... },
  "dataPoints": {
    "currentPrice": 42500,
    "priceHistory": [...],
    "ipvaEstimated": 1700,
    "depreciationInfo": {
      "percentage": 8.5,
      "trend": "up"
    }
  }
}
```

### TACO Item

```json
{
  "id": "taco-0042",
  "slug": "banana-prata",
  "type": "taco",
  "metadata": { ... },
  "dataPoints": {
    "servingSize": "100g",
    "macros": {
      "calories": 98,
      "protein": 1.3,
      "carbs": 26,
      "fat": 0.1
    },
    "micros": [
      {
        "name": "Potássio",
        "value": 358,
        "unit": "mg",
        "dailyValuePercentage": 10
      }
    ]
  }
}
```

---

## 🛠️ Troubleshooting

### Erro: "API FIPE não responde"

```bash
# Verificar status da API
curl https://parallelum.com.br/fipe/api/v1/carros/marcas

# Aumentar delay entre requisições
await new Promise(resolve => setTimeout(resolve, 1000));
```

### Erro: "Arquivo TACO não encontrado"

```bash
# Baixar arquivo Excel da TACO
mkdir -p data-sources
cd data-sources
# Baixar de: http://www.nepa.unicamp.br/taco/
```

### Erro: "Slug duplicado"

O script adiciona sufixo automático:

```
arroz-integral-cozido
arroz-integral-cozido-1
arroz-integral-cozido-2
```

---

## 📚 Referências

- **API FIPE:** https://deividfortuna.github.io/fipe/
- **Tabela TACO:** http://www.nepa.unicamp.br/taco/
- **Slugify:** https://github.com/simov/slugify
- **XLSX:** https://docs.sheetjs.com/

---

**Última Atualização:** 30/12/2025  
**Versão:** 1.0.0
