# Contributing 

## Requirements

- **Node.js 22+**
- **Docker** (Build + Postgres + Testcontainers)
- **npm** (default package manager)


## Quick Start

### Example workflow 

Before you start, find an [existing issue](https://github.com/maurolps/ratemypet/issues) you want to tackle or **create a new one** to discuss your idea.

#### 1. **Fork & Clone**

```bash
# on GitHub: click "Fork"
> git clone https://github.com/<your-username>/ratemypet.git # clone your forked repo
> cd ratemypet
```

#### 2. **Add upstream & sync main**

```bash
> git remote add upstream https://github.com/maurolps/ratemypet.git
> git fetch upstream
> git checkout main
> git pull --rebase upstream main
```

#### 3. **Create a feature/fix/refactor branch**

```bash
# use Conventional branch names
> git checkout -b feature/uc001-application
```

#### 4. **Install & run locally**

```bash
> npm ci

# Option A: everything via Docker (recommended), hot-reload on
> npm run docker:start

# Option B: local dev (DB via Docker or local)
> npm run db:up # skip this if you want to use Postgres local, you should manual config credentials and URI in case
> npm run migrate
> npm run dev
```

#### 5. **Make changes + run quality gates**

```bash
> npm run typecheck
> npm run lint
> npm run test:coverage   # aim to the tdd requirements, see at the bottom
```

#### 6. **Commit using Conventional Commits**

```bash
> git commit -m "feat(application): implement CreateUser use case #<issue-id>"
```

#### 7. **Push your branch**

```bash
> git push -u origin feature/uc001-application
```

#### 8. **Open a Pull Request**

- Go to your fork on GitHub -> **Compare & pull request**
- Keep PR small and focused. Use a clear title.
- Link the related issue. add `Closes #<ISSUE-ID>` in the description ( if applicable )
- Draft PR is welcome if you want early CI checks and feedback.

### Quick PR checklist

- [ ] Clear scope and title (use Conventional Commit format for title)
- [ ] OpenAPI/Swagger updated if API changed (`/docs`)
- [ ] Migrations reviewed (if DB changed)
- [ ] Uses `AppError` + error catalog where relevant
- [ ] Documentation updated ( if applicable )
- [ ] Testing Coverage: layers 100%, main/composition 0% 


Refer to [README.md](./README.md) and [/docs](./docs/) to learn more about the project conventions.

> Thanks for contributing to RateMyPet! 🐶🐱

