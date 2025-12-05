# Ratemypet

[![GitHub Actions CI](https://github.com/maurolps/ratemypet/actions/workflows/ci.yml/badge.svg)](https://github.com/maurolps/ratemypet/actions/workflows/ci.yml) 
[![Coverage Status](https://coveralls.io/repos/github/maurolps/ratemypet/badge.svg?branch=feature/uc001-enhance)](https://coveralls.io/github/maurolps/ratemypet?branch=feature/uc001-enhance)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 
[![SemVer](https://img.shields.io/badge/release-SemVer-blue)](https://github.com/maurolps/ratemypet/tags)
![Status](https://img.shields.io/badge/status-Active%20Development-orange)
<br>
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17%2B-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)
[![OpenAPI](https://img.shields.io/badge/API-OpenAPI%2FSwagger-85EA2D?logo=swagger)](#)

This project showcases a **scalable and maintainable** backend implementation in **NodeJs** and **TypeScript**. Modern development best practices are enforced with **Design Patterns**, **Clean Architecture**, **TDD**, **SOLID principles**.


 ## Summary: 
- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Scripts](#scripts)
- [Getting Started](#getting-started)
- [Conventions](#conventions)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

RateMyPet is a social web app where users can post photos of their pets ( dogs or cats ), and receive feedback, likes, and fun AI-generated content. See more about the **product vision**, **requirements**, **diagrams** and more in the [docs](./docs/).

## Architecture 

*UC-002 LoginUser - Clean Architecture based | [Mermaid diagram](./docs/diagrams/backend/UC-002-login-architecture.md)*
<img alt="UC002 Architecture Diagram" src="https://raw.githubusercontent.com/maurolps/ratemypet/refs/heads/main/docs/assets/uc002-diagram.png" width="700" />

**The layers are structured as follows:**

- **Domain**: entities, contracts 
- **Application**: usecases, app business rules, services, ports, repository interfaces, custom error
- **Presentation**: controllers, validator, DTOs, error presenter
- **Infrastructure**: libs/frameworks adapters
- **Main**: entrypoint, composition root (dependency injection/inversion), http server setup

## Tech Stack

- **Runtime:** `Nodejs` + `Typescript`
- **Http:** `Express` (modular structure)
- **Relational Database:** `PostgreSQL` (local or `Docker`),  versioned migrations with `dbmate`, pooling connection, singleton instance
- **Code Quality:** `Biome` (lint/format), `Conventional Commits`, `Husky`
- **Testing:** `Vitest`, `Supertest`(e2e), `TestContainers`(integration)
- **API Docs:** `Swagger/OpenAPI` documentation on `/docs` endpoint
- **Security:** Server-side validator, Authentication (`JWT`, refresh tokens, token rotation), Headers (helmet, cors), Rate-limit, Hasher, .env
- **Error Handling:** Custom AppError class, internal error logging, error handler middleware, error codes catalog
- **CI/CD:** `GitHub Actions` (typecheck, lint, tests, coverage)

> See more about the features and technical goals in the [Product Vision](./docs/product-vision.md)

## Folder Structure

```shell
#v0.2.0 

/src/main
	├── composition           # composition root, factories, dependency injection
	├── config                # env
	├── http                  # http server setup (Express)
	│   ├── adapters
	│   ├── middlewares
	│   └── routes
	└── layers                # core
	    ├── application
	    │   ├── errors
	    │   ├── ports
	    │   ├── repositories
	    │   └── usecases
	    ├── domain
	    │   ├── entities
	    │   └── usecases
	    ├── infra
	    │   ├── db
	    │   └── security
	    └── presentation
	        ├── contracts
	        ├── controllers
	        ├── dtos
	        ├── errors
	        ├── http
	        └── validation
/tests                       # tests (unit, integration, e2e)
```

## Scripts

```shell
# from package.json v0.2.0
> npm run <script>

{

  "prepare":          # set up git hooks for husky
  "dev":              # run development mode with hot-reload,
  "start":            # run the prod server from backend/dist
  "debug":            # start with inspector and source maps

  "typecheck":        # typeScript type checking
  "lint":             # lint/format code with Biome,
  "lint:ci":          # run Biome in CI mode (no writes), fail on issues

  "build":            # bundle, clean and minify into backend/dist
  "build:debug":      # inline source maps, no minify,code splitting

  "test":             # run unit and integration test
  "test:watch":       # watch mode for unit tests (TDD loop)
  "test:coverage":    # run tests and generate coverage
  "test:staged":      # for pre-commit
  "test:integration": # run only the integration tests

  "db:up":            # start Postgres container
  "db:down":          # stop and remove the container,
  "db:init":          # bring up the database and apply all migrations
  "db:reset":         # remove the database with volumes (clean slate)
  "migrate":          # apply pending migrations with dbmate 
  "migrate:new":      # create a new timestamped migration file with dbmate

  "docker:start":     # start all dev services in the foreground
  "docker:up":        # start all dev services in the background (detached)
  "docker:down":      # stop and remove all dev services
  "docker:rebuild":   # rebuild images  (required on deps change)
  
}

```

## Getting Started

### Prerequisites

- Nodejs 22+
- Docker

### Clone and install

1. *Clone*
```shell

> git clone https://github.com/maurolps/ratemypet.git
> cd ratemypet

```

2. *Install deps*
```shell
> npm install # or npm ci to guarantee clean install
```

### Start

- **Start with Docker** 

```shell
> npm run docker:start # or docker:up to detached mode

# First run builds images, sets up Postgres with the dev user/password and do migrations.
# App starts in dev mode with hot-reload.
```

- **Local**

```shell
# Note that docker still required for testcontainers (used in e2e and integration tests)

# 1. Start the database container
> npm run db:up
# (Or use a local Postgres install and config DATABASE_URL, check config/env.ts)

# 2. Run the migrations
> npm run migrate

# 3. Run the app in dev mode
> npm run dev

```

## Conventions

### Commits and Naming

- **Conventional Commits**: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`
- **Naming**: `PascalCase` (classes/interfaces/types), `camelCase` (vars/functions)

### Testing

- **Files**:  `*.spec.ts` (unit), `*.test.ts` (integration), `*.e2e.test.ts` (e2e)
- **Principles**: TDD, `AAA `Pattern (Arrange, Act, Assert), Red Green Refactor
- **Coverage**: 100% across all layers

### Branching & Versioning

- **Flow**: Based on `GitHub Flow`. Create branches from `main` (e.g., `feature/uc001-domain`, `fix/uc001-db`)
- **Pull Requests**: Always with green `CI` ( use draft to trigger CI test )
- **SemVer Tags for milestones**: v0.1.0 (setup), v0.2.0 (UC-001), v1.0.0 (MVP)

--- 

## Contributing

I built this project to learn and share, your ideas and contributions are welcome!

Please check out [Contributing Guide](./CONTRIBUTING.md) for details on the workflow.

## License

[MIT](./LICENSE) - **Feel free to fork, improve, break, learn :D**
