# Regras de Desenvolvimento e Arquitetura

- **Tomada de Decisões de Design**: Sempre que formos tomar decisões de System Design ou arquitetura no projeto, traga as principais abordagens possíveis, os trade-offs de cada uma (vantagens e desvantagens) e uma recomendação de qual usar e o porquê.

# Last.fm Analytics API

## Projeto de Aprendizagem Backend, Arquitetura e Desenvolvimento Cognitivo

---

# Visão Geral do Projeto

Este projeto consiste na criação de uma API de análise de dados musicais baseada nos dados do Last.fm. A proposta principal não é apenas construir um sistema funcional, mas utilizar o desenvolvimento da aplicação como um laboratório de aprendizado para backend, arquitetura de software e pensamento computacional.

A ideia central é desenvolver uma camada analítica acima do Last.fm.

Em vez de competir com o Last.fm, o sistema irá:

* coletar dados de scrobbles;
* organizar informações musicais;
* gerar estatísticas personalizadas;
* identificar padrões temporais;
* analisar comportamento musical;
* explorar possibilidades futuras de visualização e análise.

O projeto também funcionará como ambiente experimental para:

* APIs REST;
* GraphQL;
* bancos relacionais;
* programação assíncrona;
* modelagem de dados;
* arquitetura backend;
* cloud functions;
* agregação de dados;
* engenharia de software.

---

# Objetivos Cognitivos do Projeto

Este projeto foi pensado como uma ferramenta de desenvolvimento cognitivo, e não apenas técnico.

A proposta é transformar o aprendizado de backend em um sistema contínuo de investigação, comparação e reconstrução.

## O projeto foi estruturado para desenvolver

### 1. Pensamento Sistêmico

Compreender como múltiplos componentes interagem:

* API;
* banco de dados;
* serviços externos;
* processamento assíncrono;
* agregações;
* autenticação;
* pipelines de dados.

---

### 2. Pensamento Arquitetural

O objetivo não é apenas “fazer funcionar”.

A ideia é aprender:

* separação de responsabilidades;
* desacoplamento;
* design de serviços;
* organização de código;
* escalabilidade conceitual;
* design de APIs.

---

### 3. Aprendizado por Reconstrução

O projeto será reconstruído três vezes utilizando paradigmas diferentes.

Objetivos:

* compreender arquitetura além de frameworks;
* comparar paradigmas de comunicação;
* perceber trade-offs reais;
* aprender padrões universais de backend.

---

# Estratégia Arquitetural do Projeto

Após revisão dos objetivos do exercício, a arquitetura foi redefinida para priorizar clareza conceitual e comparação entre paradigmas.

O objetivo principal não é construir uma infraestrutura extremamente sofisticada logo no início, mas compreender profundamente como diferentes arquiteturas expõem a mesma lógica de negócio.

A pergunta central do projeto passa a ser:

> O que deve permanecer constante enquanto diferentes paradigmas backend são testados?

## Foco de Estudo: Software Design vs. System Design

* **V1 a V3 (Foco em Software Architecture & Software Design):**
  * Prioridade total em organização de código em camadas (`Controller`, `Service`, `Repository`), abstrações limpas, *Clean Code*, modelagem de dados no Prisma/SQLite e comparação de DX (REST vs GraphQL).
* **V3+ em diante (Transição para System Design):**
  * Introdução gradual de resiliência (rate limiting da API do Last.fm), filas assíncronas de mensageria para ingestão de scrobbles, *caching* com Redis e infraestrutura de deploy distribuída.

## Componentes Constantes

Ao longo das reconstruções do projeto, os seguintes elementos permanecerão iguais:

* domínio do problema;
* entidades principais;
* modelagem de dados;
* lógica de negócio;
* análises musicais;
* fluxo principal da aplicação.

## Componentes Variáveis

O que mudará entre versões será principalmente a forma como o sistema é exposto.

```txt
V1 → REST API
V2 → GraphQL
V3 → Cloud Services / Serverless
```

Essa abordagem reduz sobrecarga cognitiva e permite comparar arquiteturas com maior clareza.

## Apresentação Externa e Portfólio

* **Coleção do Postman:** Estruturada de forma híbrida — arquivo JSON versionado em `docs/postman/listening-analytics.postman_collection.json` e botão *"Run in Postman"* no `README.mkd` apontando para a Public Workspace no Postman Cloud.
* **Dashboard Web Minimalista (Pós-V3):** Estruturado no modelo **Monorepo (Abordagem 2)** em pasta separada (ex: `/frontend`) consumindo as rotas REST e GraphQL para demonstração visual em portfólio.

---

# Ideia Central do Sistema

## Conceito

O sistema será uma API de análise musical pessoal.

Ele coletará dados do Last.fm e transformará esses dados em insights analíticos.

---

## Exemplos de análises possíveis (após o MVP)

### Estatísticas gerais

* artistas mais ouvidos;
* músicas mais tocadas;
* gêneros predominantes;
* evolução temporal.

---

### Estatísticas temporais

* horários de maior atividade musical;
* padrões por dia da semana;
* mudanças mensais;
* sazonalidade musical.

---

### Estatísticas comportamentais

* repetição de artistas;
* diversidade musical;
* mudanças de gosto;
* exploração de gêneros.

---

### Possíveis expansões futuras

* integração com Spotify;
* recomendação musical;
* machine learning;
* visualizações gráficas;
* análise emocional;
* clustering musical;
* detecção de padrões;
* dashboard interativo;
* NLP aplicado em letras;
* classificação sonora.

---

# Tecnologias Escolhidas

## Backend

### Node.js

#### Motivos da escolha

* forte ecossistema para APIs;
* excelente suporte assíncrono;
* ideal para integração com APIs externas;
* alinhamento com estudos de JavaScript assíncrono;
* compatibilidade com GraphQL e cloud functions.

---

## Framework Backend

### Express

#### Motivos

* minimalista;
* simples para aprendizado;
* ampla documentação;
* ajuda a compreender arquitetura HTTP sem abstrações excessivas.

---

## Banco de Dados

### SQLite (V1 e V2)

#### Motivos

SQLite passa a ser a escolha inicial devido ao foco pedagógico atual do projeto.

Os objetivos principais são:

* comparação entre REST, GraphQL e Cloud Services;
* entendimento arquitetural;
* velocidade de reconstrução;
* redução de sobrecarga cognitiva;
* foco em APIs e não em infraestrutura.

SQLite foi escolhido porque:

* não exige configuração de servidor;
* reduz complexidade operacional;
* acelera prototipagem;
* facilita múltiplas reconstruções do projeto;
* permite maior foco em arquitetura backend.

A ideia é manter o domínio do sistema constante enquanto apenas o paradigma da aplicação muda.

---

### PostgreSQL (Evolução futura)

PostgreSQL continua sendo uma tecnologia relevante para o projeto, mas agora entra como etapa evolutiva posterior.

Possível progressão:

```txt
SQLite
   ↓
PostgreSQL
   ↓
Cloud deployment
```

Objetivos futuros da migração:

* aprender migração de banco de dados;
* explorar queries analíticas mais robustas;
* trabalhar cenários próximos de produção;
* praticar engenharia backend em maior escala.

---

## ORM

### Prisma

#### Motivos

Prisma foi escolhido porque:

* reduz fricção inicial;
* melhora produtividade;
* possui excelente autocomplete;
* facilita aprendizado gradual;
* simplifica relações entre tabelas.

A proposta não é substituir SQL.

O projeto incentivará o uso simultâneo de:

* Prisma;
* SQL puro.

Objetivo:

aprender abstração sem perder entendimento da camada de dados.

---

## Ferramentas de Teste

### Postman / Insomnia

Utilizados para:

* testar endpoints;
* visualizar respostas;
* validar arquitetura;
* compreender fluxo HTTP.

---

## Versionamento

### Git + GitHub

Objetivos:

* histórico de evolução;
* documentação do aprendizado;
* construção de portfólio;
* prática profissional.

---

# Estrutura Conceitual do Sistema

## Entidades Principais

### User

Representa o usuário da aplicação.

---

### Artist

Representa artistas musicais.

---

### Track

Representa músicas.

---

### Scrobble

Representa eventos de reprodução.

Essa será a entidade mais importante do sistema.

Ela conecta:

* usuário;
* música;
* artista;
* timestamp.

Grande parte das análises surgirá dessa entidade.

---

# Estrutura Inicial da API

## Primeiros endpoints

### Health Check

```http
GET /health
```

Objetivo:

verificar funcionamento da API.

---

### Tracks

```http
GET /tracks
```

Retorna músicas registradas.

---

### Top Artists

```http
GET /stats/top-artists
```

Retorna artistas mais ouvidos.

---

### Listening Hours

```http
GET /stats/listening-hours
```

Retorna horários de maior atividade musical.

---

# Fases do Projeto

## Fase 1 — Fundamentos

Objetivos:

* aprender HTTP;
* entender REST;
* criar primeiras rotas;
* estruturar Express;
* conectar banco de dados.

---

## Fase 2 — Modelagem

Objetivos:

* criar entidades;
* aprender relações;
* implementar Prisma;
* desenvolver schema.

---

## Fase 3 — Integração Last.fm

Objetivos:

* consumir API externa;
* trabalhar com async/await;
* salvar dados;
* transformar JSON.

---

## Fase 4 — Analytics

Objetivos:

* agregações;
* rankings;
* estatísticas;
* agrupamentos;
* queries complexas.

---

## Fase 5 — GraphQL

Objetivos:

* comparar paradigmas;
* aprender queries flexíveis;
* entender arquitetura GraphQL.

---

## Fase 6 — Cloud Functions

Objetivos:

* automações;
* processamento assíncrono;
* tarefas agendadas;
* geração de relatórios.

---

# Desenvolvimento Cognitivo Durante o Projeto

## O projeto incentiva

### Aprendizado ativo

O foco será:

* escrever código manualmente;
* investigar erros;
* reconstruir soluções;
* comparar abordagens.

---

### Aprendizado dialético

Toda escolha tecnológica deverá ser questionada.

Exemplos:

* Por que SQLite antes de PostgreSQL?
* Por que Node.js?
* Por que Prisma?
* Quando SQL puro seria melhor?
* Quando GraphQL se torna exagero?

Objetivo:

reduzir aprendizado superficial e fortalecer pensamento crítico.

---

### Aprendizado incremental

O sistema será construído em camadas.

Cada camada adicionará:

* nova abstração;
* novo desafio;
* novo paradigma.

---

# Objetivo Final

O objetivo final não é apenas possuir um projeto no GitHub.

O verdadeiro objetivo é:

* desenvolver pensamento computacional;
* criar maturidade arquitetural;
* fortalecer análise de dados;
* aprender backend moderno;
* desenvolver autonomia técnica;
* transformar curiosidade em sistema.

Este projeto funciona simultaneamente como:

* laboratório técnico;
* exercício cognitivo;
* portfólio;
* ambiente de pesquisa;
* playground arquitetural;
* sistema evolutivo de aprendizado.
