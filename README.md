# Foundry

A design system generator for product designers and frontend engineers.

Pick an accent color. Get a complete, accessible token system —
ready for Figma, CSS, Tailwind, and production code.

---

## Packages

| Package | Description | Status |
|---|---|---|
| [`@foundry/core`](./packages/core) | HSL color engine, WCAG contrast checker, semantic token generator | ✅ Active |
| [`@foundry/web`](./packages/web) | React web app — the main product UI | 🚧 In progress |
| [`@foundry/figma`](./packages/figma) | Figma plugin | 📋 Phase 2 |
| [`@foundry/cli`](./packages/cli) | CLI tool — `npx foundry generate` | 📋 Phase 3 |

---

## The problem it solves

Starting a design system today means:
- Manually picking color shades one by one
- Separately checking each for WCAG contrast
- Rebuilding the same palette again in code
- Hoping design and code stay in sync

Foundry closes that loop. One accent color in — complete accessible
token system out, in every format you need.

---

## How it works

```
You pick an accent color + WCAG level (AA or AAA)
  ↓
@foundry/core generates 10 color families × 11 shades
  ↓
Every shade is checked for contrast compliance automatically
  ↓
Failing shades get the closest accessible alternative suggested
  ↓
Export as CSS variables · Tailwind config · tokens.json · Figma variables
```

---

## Tech stack

| Tool | Purpose |
|---|---|
| TypeScript strict mode | Type-safe color math and token generation |
| Yarn workspaces | Monorepo — one repo, multiple surfaces |
| React + Vite | Web app |
| Tailwind CSS v4 | Styling |
| Vitest | Unit testing |
| chroma.js | WCAG contrast ratio calculations |
| Style Dictionary | Token format conversion |

---

## Getting started

```bash
# Install all dependencies
yarn install

# Start the web app
yarn dev:web

# Build the core engine
yarn build:core

# Run all tests
yarn test
```

---

## Project status

| What | Status |
|---|---|
| Core color engine | 🔨 Building now |
| Web app | 📋 Next |
| Figma plugin | 📋 Phase 2 |
| CLI tool | 📋 Phase 3 |

---

## Why this exists

Built by a product designer who spent years maintaining fragmented
design systems across multiple products — and eventually started
writing the production code herself.

The color system architecture here comes from real work: migrating
a multi-product SaaS platform from inconsistent RGB values to a
formulaic HSL system that generates consistent, accessible palettes
on demand.