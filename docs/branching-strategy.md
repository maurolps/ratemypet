
# Branching Strategy — RateMyPet (GitHub Flow based)

## TL;DR;

```bash
# Workflow example: Creating a new feat

# start from latest main
git checkout main
git fetch
git pull --ff-only ## ensure fast-forward ( no merge conflicts )

# start fresh
git checkout -b feature/new-feat

# ... make changes, commit (conventional commits enforced). e.g:
git commit -m "feat(users): validate email and password length"

# push to origin
git push -u origin feature/new-feat

# open PR on github
```


## Principles

- Each feature/fix/etc is delivered via PR
- Enforced conventional commits (feat, chore, fix, refactor, test, docs) with scope, e.g:
  # refactor(scope): added new things.
- CI pipelines validate each PR (tests, lint, build)
- Merging into `main` triggers a deploy or release tag


## Branches

_Note: Only `main` branch is permanent_

| Branch Pattern | Purpose                   |
| -------------- | ------------------------- |
| `main`         | Stable code               |
| `feature/*`    | New features or use cases |
| `fix/*`        | Bug fixes                 |
| `refactor/*`   | Internal refactoring      |
| `docs/*`       | Documentation only        |
| `chore/*`      | Tooling and config        |
| `test/*`       | Test improvements         |


## Semantic Versioning

Tags are used to mark milestones, format: `v<MAJOR>.<MINOR>.<PATCH>` e.g:

| Tag      | Description                             |
| -------- | --------------------------------------- |
| `v0.1.0` | Initial setup: docs and project structure |
| `v0.2.0` | Create usecase UC-001-create-user       |
| `v0.2.1` | Fix UC-001 business logic               |
| `v1.0.0` | Release MVP                             |
|          |                                         |
