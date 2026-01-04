# 📱 Ícones PWA - Instruções

Este projeto requer ícones PWA para funcionar corretamente como Progressive Web App.

## Ícones Necessários

Você precisa criar os seguintes ícones na pasta `public/`:

- `icon-192x192.png` - Ícone 192x192 pixels
- `icon-512x512.png` - Ícone 512x512 pixels

## Especificações

- **Formato:** PNG
- **Tamanhos:** 192x192px e 512x512px
- **Cor de fundo:** #0a0a0a (preto)
- **Design:** Baseado no logo "D" do Portal Descomplicado (ver Navbar)
- **Purpose:** "any maskable" (deve funcionar em diferentes formas de ícone)

## Como Criar

### Opção 1: Usando Ferramentas Online

1. Acesse [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
2. Faça upload de um logo/ícone base
3. Gere os ícones nos tamanhos necessários
4. Baixe e coloque em `public/`

### Opção 2: Usando Figma/Design Tools

1. Crie um design 512x512px com fundo #0a0a0a
2. Adicione o logo "D" ou design da marca
3. Exporte como PNG nos tamanhos 192x192 e 512x512
4. Coloque os arquivos em `public/`

### Opção 3: Usando ImageMagick (CLI)

Se você tem um logo base (logo.png):

```bash
# Instalar ImageMagick (se necessário)
# Windows: choco install imagemagick
# macOS: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Gerar ícone 192x192
convert logo.png -resize 192x192 -background "#0a0a0a" -gravity center -extent 192x192 public/icon-192x192.png

# Gerar ícone 512x512
convert logo.png -resize 512x512 -background "#0a0a0a" -gravity center -extent 512x512 public/icon-512x512.png
```

## Design Sugerido

Baseado no Navbar, o ícone pode ser:
- Fundo: #0a0a0a (preto)
- Letra "D" em destaque (verde #10b981 ou branco)
- Estilo minimalista e moderno

## Verificação

Após criar os ícones, verifique se:
1. Os arquivos estão em `public/icon-192x192.png` e `public/icon-512x512.png`
2. O `manifest.json` referencia corretamente os ícones (já configurado)
3. O PWA funciona corretamente após build

## Nota

O PWA funcionará mesmo sem os ícones, mas a experiência do usuário será melhor com ícones personalizados.

