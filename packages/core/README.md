# @foundry-ds/core

The brain of Foundry. A pure TypeScript engine that generates a complete,
accessible design token system from a single accent color.

No UI. No framework dependencies. Just functions — so it runs anywhere:
browser, Node.js, Figma plugin, CLI.

---

## What it does

```
Your accent color (e.g. #3a5afe)
  ↓
HSL formula engine
  Converts to HSL
  Generates 10 color families × 11 shades each
  Lightness scale: 97% (lightest) → 12% (darkest)
  ↓
Accessibility checker
  Calculates WCAG contrast ratio for every shade
  Flags any shade that fails your target (AA or AAA)
  Suggests the closest passing alternative
  ↓
Semantic token mapping
  primary   → your accent color family, shade 6
  success   → green family, shade 6
  warning   → yellow family, shade 6
  error     → red family, shade 6
  neutral   → gray family, all 11 shades
  ↓
Theme output
  Light theme → CSS custom properties
  Dark theme  → inverted lightness scale, reduced saturation
```

---

## Why HSL and not RGB or hex

RGB has no perceptual structure. Two colors with similar RGB numbers
can look completely different in brightness to the human eye.

HSL (Hue, Saturation, Lightness) maps directly to how we perceive color:
- Hue = which color family (fixed per family)
- Saturation = how vivid (increases toward mid-tones)
- Lightness = how light or dark (drives our 11-step scale)

Most importantly: HSL's Lightness channel inverts cleanly for dark mode.
Shade 1 in light mode (L: 97%) becomes shade 11 in dark mode (L: 12%)
with a simple scale reversal. No separate dark palette needed.

---

## Color system

- 10 color families: indigo, blue, cyan, green, lime, yellow, orange, red, magenta, neutral
- 11 shades per family (shade 1 = lightest, shade 11 = darkest in light mode)
- Shade 6 = the base/primary shade
- Hue stays fixed per family
- Lightness drives hierarchy: 97% → 12%
- Saturation increases toward mid-tones for vibrancy

---

## Usage

```ts
import { generatePalette } from '@foundry-ds/core'

const palette = generatePalette({
  hue: 210,
  name: 'blue'
})
// Returns blue-1 through blue-11 as HSL values

import { generateSemanticTokens } from '@foundry-ds/core'

const tokens = generateSemanticTokens({
  accentColor: '#3a5afe'
})
// Returns { primary, success, warning, error, neutral }

import { checkContrast } from '@foundry-ds/core'

const result = checkContrast({
  foreground: '#ffffff',
  background: '#3a5afe',
  level: 'AA'
})
// Returns { passes: true, ratio: 4.7, suggestion: null }
```

---

## Framework support

`@foundry-ds/core` outputs standard CSS custom properties via `dist/tokens.css`.
This file works in any framework:

```bash
# React (via Tailwind or direct import)
import './tokens.css'

# Angular (via styles.scss)
@import './foundry-tokens.css';

# Vue, Svelte, vanilla HTML — same pattern
```

See [`packages/angular-demo`](../angular-demo) for a working Angular example.


---

## Output

Running `yarn build` generates:
- `dist/tokens.css` — CSS custom properties for light + dark themes
- W3C DTCG format (Style Dictionary / Tokens Studio compatible) — via `exportDTCG` / `exportDTCGThemes`
- `dist/index.js` — JavaScript token objects for use in components
- `dist/index.d.ts` — TypeScript types for full autocomplete