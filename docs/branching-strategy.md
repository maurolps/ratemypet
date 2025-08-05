
# Branching Strategy — RateMyPet (GitHub Flow based)

## TL;DR;

```bash
# Workflow example: Creating a new feat

# start from latest main
git checkout main
git pull origin main

# create a new feature 
git checkout -b feature/some-feat 

# make changes, commit, and push
git commit -m "feat: create some feat"
git push -u origin feature/some-feat

# open PR
```


## Principles

- The `main` branch is always production-ready
- All development happens in short-lived branches
- Each feature/fix/etc is delivered via PR
- Enforced conventional commits (feat, chore, fix, test, docs)
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
| `v0.11.1`| Fix UC-001 business logic               |
| `v1.0.0` | Release MVP                             |
|          |                                         |
