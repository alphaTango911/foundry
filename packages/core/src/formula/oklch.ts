/**
 * OKLCH Color Engine — Future Upgrade Path
 *
 * OKLCH is a perceptually uniform color space — meaning two colors
 * at the same OKLCH lightness value actually look the same brightness
 * to human eyes. HSL does not guarantee this.
 *
 * Why not use OKLCH now?
 * - Browser support for oklch() in CSS is good but not universal yet
 * - The math is more complex and harder to explain
 * - HSL is a good practical approximation for v1
 *
 * When to migrate:
 * - When browser support is universal (check caniuse.com/oklch)
 * - When users report visible unevenness in the HSL palettes
 * - When adding HDR/P3 wide-gamut color support
 *
 * Resources:
 * - https://oklch.com — interactive OKLCH color picker
 * - https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
 * - https://bottosson.github.io/posts/oklab/ — the original paper
 *
 * This file is a placeholder. Implementation coming in v2.
 */

export const OKLCH_TODO = 'Coming in v2 — see file header for context';