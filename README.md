<h1 align="center">Portal Descomplicado: Simplificando o Acesso a Dados Públicos</h1>

<div align="center">
  <img src="./preview-portal.png" width="100%" alt="Portal Descomplicado Interface" style="border-radius: 10px"/>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-Logic-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-Pro-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Fuse.js-Search-orange" alt="Fuse.js">
  <img src="https://img.shields.io/badge/Tailwind-UI-06B6D4?logo=tailwind-css" alt="Tailwind">
</p>

## 📋 Sobre o Projeto

O **Portal Descomplicado** é uma plataforma focada em **Data UX**, projetada para democratizar o acesso a informações utilitárias complexas, como a Tabela FIPE e a Tabela TACO. O objetivo central é eliminar a fricção entre o usuário e o dado bruto, oferecendo uma interface intuitiva, rápida e focada em resultados imediatos.

## 🛠️ Desafios Técnicos e Soluções de Engenharia

### 1. Normalização de Dados Complexos
Dados públicos raramente vêm prontos para o consumo em aplicações modernas.
* **A Abordagem:** Desenvolvi uma camada de pré-processamento para converter estruturas de dados heterogêneas em modelos TypeScript tipados e consistentes.
* **O Ganho:** Isso permite que a aplicação consuma diferentes fontes (veículos, alimentos, indicadores) sob o mesmo padrão de interface, facilitando a escalabilidade do portal para novos domínios.

### 2. Algoritmo de Busca Fuzzy (Fuse.js)
Navegar em listas com milhares de itens requer uma busca que entenda o usuário.
* **Implementação:** Utilização do **Fuse.js** para permitir buscas por aproximação. Se o usuário digitar "Onix 1.0", o sistema entrega o resultado instantaneamente, priorizando a relevância mesmo com termos parciais ou erros de digitação.
* **Performance:** Todo o processamento de filtragem ocorre localmente, garantindo latência zero após o carregamento inicial dos dados.

### 3. Interface "Mobile-First" e Acessibilidade
Dados densos em telas pequenas costumam ser um problema de design.
* **Solução:** Apliquei conceitos de **Design Atômico** com Tailwind CSS para garantir que tabelas complexas se transformem em "cards" legíveis em dispositivos móveis, mantendo a hierarquia de informação e o contraste adequado.

## 🚀 O DNA de Automação

Seguindo a mesma filosofia de outros projetos autorais, o Portal Descomplicado não depende de preenchimento manual de dados.
* **Automação:** Utilizo processos de extração e tratamento de dados para alimentar o estado da aplicação de forma automatizada.
* **Persistência:** O backend (Firebase) atua como uma camada leve de suporte para configurações e métricas, enquanto a inteligência do dado reside na lógica frontend, otimizando o custo operacional e a velocidade de resposta.

## 💻 Stack Tecnológica

* **Frontend:** React.js com TypeScript (Tipagem rigorosa para evitar erros de dados nulos).
* **Estilização:** Tailwind CSS (Foco em performance de renderização e design system).
* **Busca:** Fuse.js (Engine de busca leve e poderosa).
* **Infraestrutura:** Firebase (Persistência e Hosting).

## ⚙️ Execução Local

1. **Clone:** `git clone https://github.com/WelderBM/portal-descomplicado`
2. **Dependências:** `npm install`
3. **Inicie:** `npm run dev`

---
**Desenvolvido por [Welder Barroso](https://linkedin.com/in/welder-barroso-37b654207)**
*Engenheiro Frontend focado em transformar complexidade em simplicidade.*
