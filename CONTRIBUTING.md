# Contributing to Foundry

Thank you for your interest in contributing to Foundry.

---

## Getting started

```bash
git clone https://github.com/alphaTango911/foundry.git
cd foundry
yarn install
```

## Running the projects

```bash
# React web app
yarn dev:web

# Angular demo (tokens auto-generated on start)
yarn dev:angular

# Run all tests
cd packages/core && yarn test

# Build token CSS
yarn build:tokens
```

## Project structure

foundry/
├── packages/
│ ├── core/ ← Color engine — pure TypeScript, no framework deps
│ ├── web/ ← React web app
│ └── angular-demo/ ← Angular demo

## Branch strategy

- `main` — stable, deployed to Vercel
- `feat/` — new features
- `fix/` — bug fixes
- `chore/` — maintenance
- `docs/` — documentation only

Never commit directly to `main`. Always open a pull request.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

feat(core): add color harmony algorithm
fix(web): fix contrast badge display
chore: update dependencies
docs: update Angular demo README

## Working on `@foundry-ds/core`

All color math lives in `packages/core/src/formula/`.
Every function must have tests in the corresponding `.test.ts` file.
Run tests with `cd packages/core && yarn test`.

The public API is in `packages/core/src/index.ts`.
Only export what needs to be public — once exported, it's part of the contract.

## Working on `@foundry/web`

Follows [Bulletproof React](https://github.com/alan2207/bulletproof-react) architecture.
New features go in `packages/web/src/features/`.
Shared components go in `packages/web/src/components/ui/`.

## Working on `@foundry/angular-demo`

Run `yarn dev:angular` from the repo root.
Tokens are auto-generated before the dev server starts.
If you change the core engine, rebuild tokens with `yarn build:tokens`.

## Pull request checklist

- [ ] Tests pass (`cd packages/core && yarn test`)
- [ ] No TypeScript errors
- [ ] Commit messages follow Conventional Commits
- [ ] README updated if adding new features
