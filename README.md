# EstudaEasy API

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)

</div>

## Sobre o Projeto
Este é o back-end (API) da plataforma EstudaEasy desenvolvida para disciplina de Projeto de Desenvolvimento de Software, com foco em estudantes que desejam otimizar sua rotina de estudos. Concentra diversas técnicas e ferramentas em um único lugar, oferecendo uma experiência integrada, colaborativa e potencializada por inteligência artificial.

## Visão Geral

A API centraliza regras de negócio e recursos da plataforma, incluindo:

- Autenticação e autorização (JWT e OAuth2 com Google)
- Gestão de usuários e sessões
- Decks, flashcards e diários
- Grupos de estudo, membros e postagens
- Quizzes, itens e opções de quiz
- Recursos compartilhados, favoritos e conversões
- Tarefas e quadro branco (whiteboard)
- Integrações com provedores de IA

## Stack Tecnológica

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT + Passport
- Swagger
- AWS S3
- OpenAI e Google Gemini
- Nodemailer + Handlebars
- Jest + Supertest
- Docker Compose

## Estrutura do Projeto

A organização segue uma arquitetura em camadas com separação de responsabilidades:

- `src/domain`: entidades e contratos do domínio
- `src/application`: casos de uso, serviços e regras da aplicação
- `src/infrastructure`: adaptadores, banco e provedores externos
- `src/presentation`: camada HTTP e validações
- `src/config`: configurações por módulo
- `src/core`: exceções, filtros, pipes e utilitários base

## Pré-requisitos

Instale as ferramentas abaixo:

- Node.js 20+
- npm 10+
- Docker e Docker Compose

## Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd estuda-easy-api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

- Crie um arquivo `.env` com base no padrão do projeto.
- Defina credenciais.

4. Suba os serviços de infraestrutura locais:

```bash
docker-compose up -d
```

5. Rode as migrations:

```bash
npm run migration:run
```

## Executando o Projeto

### Desenvolvimento

```bash
npm run start:dev
```

### Debug

```bash
npm run start:debug
```

### Produção

```bash
npm run build
npm run start:prod
```

## Scripts Disponíveis

```bash
# Build
npm run build

# Lint
npm run lint

# Testes unitários
npm run test

# Testes com cobertura
npm run test:cov

# Testes e2e
npm run test:e2e

# Migrations
npm run migration:create
npm run migration:generate
npm run migration:show
npm run migration:run
npm run migration:revert
```

## Documentação da API

A documentação interativa é disponibilizada via Swagger em ambiente local e está disponível na rota:

- `/docs`

