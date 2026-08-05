/**
 * @foundry/core — Public API
 *
 * This is the stable public surface of the package.
 *
 * API philosophy:
 * We export at two levels intentionally:
 *
 * HIGH-LEVEL (most users need only these):
 *   generateSemanticTokens() — one accent color in, full token set out
 *   generateThemeCSS()       — token set in, CSS custom properties out
 *   checkContrast()          — check any two colors for WCAG compliance
 *   validateHex()            — validate user color input
 *
 * LOW-LEVEL (for advanced users building on the engine):
 *   generatePalette()        — raw 11-shade palette generation
 *   generatePaletteFromHex() — same, from a hex input
 *   getContrastRatio()       — raw contrast ratio calculation
 *   checkPaletteContrast()   — check all shades in a palette
 *
 * Internal implementation details are NOT exported:
 *   LIGHTNESS_SCALE, SATURATION_SCALE, paletteToSemanticToken, etc.
 *   These can change without it being a breaking change.
 *
 * Warning: once exported, a function is part of the public contract.
 * Removing it later is a breaking change. Export deliberately.
 *
 * Future direction:
 * As this package grows, consider splitting into:
 *   @foundry/core         — high-level API only
 *   @foundry/accessibility — contrast + WCAG utilities
 *   @foundry/tokens       — semantic token generation
 *   @foundry/themes       — CSS and theme output
 */

// ─── High-level API ──────────────────────────────────────

export {
  generateSemanticTokens,
} from './semantic/tokens';

export type {
  SemanticColorToken,
  NeutralTokenScale,
  SemanticTokenSet,
  GenerateSemanticTokensOptions,
} from './semantic/tokens';

export {
  generateThemeCSS,
  generateLightThemeCSS,
  generateDarkThemeCSS,
} from './themes/css-exporter';

export type {
  ThemeCSS,
} from './themes/css-exporter';

export {
  checkContrast,
  checkPaletteContrast,
  getContrastRatio,
} from './formula/contrast';

export type {
  WCAGLevel,
  TextSize,
  ContrastResult,
  AccessibleSuggestion,
  ShadeContrastResult,
} from './formula/contrast';

export {
  validateHex,
  validateHue,
  validateSaturation,
} from './formula/validation';

export type {
  ValidationResult,
} from './formula/validation';

// ─── Color Harmony ───────────────────────────────────────

export {
  applyHarmony,
  generateHarmoniousHues,
  SEMANTIC_BASE_HUES,
} from './formula/harmony';

export type {
  HarmonyConfig,
} from './formula/harmony';

// ─── Low-level API ───────────────────────────────────────

export {
  generatePalette,
  generatePaletteFromHex,
  hslToHex,
  hexToHsl,
} from './formula/hsl';

export type {
  HSLColor,
  ColorShade,
  ColorPalette,
  GeneratePaletteOptions,
} from './formula/hsl';

// ─── DTCG Export ─────────────────────────────────────────

export {
  tokensToDTCG,
  exportDTCG,
  exportDTCGThemes,
} from './themes/dtcg-exporter';

export type {
  DTCGToken,
  DTCGGroup,
  DTCGExportOptions,
  DTCGThemes,
} from './themes/dtcg-exporter';
