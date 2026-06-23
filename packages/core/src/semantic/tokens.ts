/**
 * Semantic Token Generator
 *
 * Maps raw color palettes to named design tokens.
 *
 * Why semantic tokens?
 * Raw palette names like 'blue-6' describe appearance.
 * Semantic tokens like 'primary' describe purpose.
 *
 * This matters because:
 * - A button uses 'primary', not 'blue-6'
 * - If you rebrand from blue to purple, you change
 *   one mapping here — not hundreds of components
 * - Dark mode works by remapping tokens, not rewriting components
 *
 * Token structure — two separate concerns:
 *
 * ACTION COLORS (primary, success, warning, error, info)
 * These are used for interactive elements — buttons, alerts, badges.
 * They need bg/border/fill/text variants because the same color
 * is used at very different lightness levels depending on context.
 *
 * NEUTRAL SCALE
 * This is the foundation — backgrounds, surfaces, borders, body text.
 * It follows a different structure because neutral is not an action
 * color. It does not have hover/active states the same way.
 */

import {
  generatePalette,
  generatePaletteFromHex,
  type ColorPalette,
  type ColorShade,
} from '../formula/hsl';
import { validateHex } from '../formula/validation';
import { getContrastRatio } from '../formula/contrast';

// ─── Types ───────────────────────────────────────────────

/**
 * A semantic action color token.
 * Used for: primary, success, warning, error, info.
 *
 * Separated into three groups by purpose:
 * - bg/border   → subtle use (tinted backgrounds, borders)
 * - fill        → strong use (buttons, badges, icons)
 * - text        → readable use (labels, descriptions)
 * - contrastText → text ON TOP of the fill (e.g. white text on blue button)
 */
export interface SemanticColorToken {
  /** Shade 1 — lightest tint, used for subtle backgrounds */
  bg: string;
  /** Shade 2 — slightly darker, used for hover state backgrounds */
  bgHover: string;
  /** Shade 3 — used for borders in light mode */
  border: string;
  /** Shade 4 — used for hover state borders */
  borderHover: string;
  /** Shade 6 — the BASE fill color for buttons, badges, icons */
  fill: string;
  /** Shade 5 — fill on hover state */
  fillHover: string;
  /** Shade 7 — fill on active/pressed state */
  fillActive: string;
  /**
   * Shade 8 — text IN this color on light backgrounds.
   * Deliberately darker than fill so it passes contrast.
   * e.g. 'View details' link in primary color
   */
  text: string;
  /** Shade 7 — text on hover */
  textHover: string;
  /** Shade 9 — text on active state */
  textActive: string;
  /**
   * White or black — whichever passes contrast on the fill.
   * Used for text/icons ON TOP of a filled element.
   * e.g. the label inside a primary button
   */
  contrastText: string;
  /** The raw palette this token was generated from */
  palette: ColorPalette;
}

/**
 * Neutral token scale — the foundation of the design system.
 *
 * Neutral is not an action color. It does not have hover/active
 * states the same way. Instead it provides a layered surface
 * system and a text hierarchy.
 */
export interface NeutralTokenScale {
  /** Shade 1 — page background */
  background: string;
  /** Shade 2 — card/surface background */
  surface: string;
  /** Shade 3 — hover state for surfaces */
  surfaceHover: string;
  /** Shade 4 — subtle border */
  border: string;
  /** Shade 5 — stronger border, dividers */
  borderStrong: string;
  /** Shade 7 — muted/placeholder text */
  textMuted: string;
  /** Shade 9 — secondary body text */
  text: string;
  /** Shade 11 — primary headings and body text */
  textStrong: string;
  /** The raw palette */
  palette: ColorPalette;
}

/**
 * The full semantic token set generated from one accent color.
 */
export interface SemanticTokenSet {
  primary: SemanticColorToken;
  success: SemanticColorToken;
  warning: SemanticColorToken;
  error: SemanticColorToken;
  info: SemanticColorToken;
  neutral: NeutralTokenScale;
}

/**
 * Options for generating the full semantic token set.
 */
export interface GenerateSemanticTokensOptions {
  /**
   * Your brand accent color as a hex string.
   * e.g. '#3a5afe' or '#ff6b6b'
   * This becomes your 'primary' token.
   */
  accentColor: string;
}

// ─── Fixed Hues ──────────────────────────────────────────

/**
 * Fixed hue values for semantic colors.
 *
 * These hues are commonly used in digital product interfaces
 * to communicate status meaning. Only 'primary' comes from
 * the user's accent color — everything else is fixed because
 * a red 'success' or green 'error' would confuse users
 * regardless of branding.
 */
const SEMANTIC_HUES = {
  success: 142, // Green
  warning: 45,  // Amber
  error: 4,     // Red
  info: 210,    // Blue
  neutral: 220, // Blue-gray
} as const;

// ─── Helpers ─────────────────────────────────────────────

/**
 * Gets a specific shade from a palette by shade number.
 */
const getShade = (palette: ColorPalette, shadeNumber: number): ColorShade => {
  const shade = palette.shades.find(s => s.shade === shadeNumber);
  if (!shade) {
    throw new Error(
      `Shade ${shadeNumber} not found in palette '${palette.name}'`
    );
  }
  return shade;
};

/**
 * Chooses white or black for text ON TOP of a filled element.
 *
 * Picks whichever gives higher contrast ratio.
 *
 * Note: this always returns white or black — it does not yet
 * adjust the fill if neither passes 4.5:1. That is the next
 * improvement: if bestContrast < 4.5, warn and suggest a
 * darker fill shade. Coming in the contrast validation layer.
 */
const getContrastText = (fillHex: string): string => {
  const whiteContrast = getContrastRatio('#ffffff', fillHex);
  const blackContrast = getContrastRatio('#000000', fillHex);
  return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
};

/**
 * Maps a palette to a semantic action color token.
 *
 * Text shades are intentionally darker than fill shades
 * to ensure readable contrast on light backgrounds.
 */
const paletteToSemanticToken = (
  palette: ColorPalette
): SemanticColorToken => {
  const fill = getShade(palette, 6);

  return {
    bg:           getShade(palette, 1).hex,
    bgHover:      getShade(palette, 2).hex,
    border:       getShade(palette, 3).hex,
    borderHover:  getShade(palette, 4).hex,
    fill:         fill.hex,
    fillHover:    getShade(palette, 5).hex,
    fillActive:   getShade(palette, 7).hex,
    text:         getShade(palette, 8).hex,
    textHover:    getShade(palette, 7).hex,
    textActive:   getShade(palette, 9).hex,
    contrastText: getContrastText(fill.hex),
    palette,
  };
};

/**
 * Maps a palette to the neutral token scale.
 * Different structure from action colors — no hover/active.
 */
const paletteToNeutralScale = (
  palette: ColorPalette
): NeutralTokenScale => ({
  background:  getShade(palette, 1).hex,
  surface:     getShade(palette, 2).hex,
  surfaceHover:getShade(palette, 3).hex,
  border:      getShade(palette, 4).hex,
  borderStrong:getShade(palette, 5).hex,
  textMuted:   getShade(palette, 7).hex,
  text:        getShade(palette, 9).hex,
  textStrong:  getShade(palette, 11).hex,
  palette,
});

// ─── Main Generator ──────────────────────────────────────

/**
 * Generates the full semantic token set from an accent color.
 *
 * Example:
 * generateSemanticTokens({ accentColor: '#3a5afe' })
 * → {
 *     primary: { bg: '#eef1ff', fill: '#3a5afe', text: '#1a2fa8', contrastText: '#ffffff', ... },
 *     success: { bg: '#f0fdf4', fill: '#22c55e', text: '#14532d', contrastText: '#ffffff', ... },
 *     warning: { bg: '#fffbeb', fill: '#f59e0b', text: '#78350f', contrastText: '#000000', ... },
 *     error:   { bg: '#fef2f2', fill: '#ef4444', text: '#7f1d1d', contrastText: '#ffffff', ... },
 *     neutral: { background: '#f8fafc', surface: '#f1f5f9', text: '#0f172a', ... },
 *   }
 *
 * Notice: warning.contrastText is '#000000' not '#ffffff' —
 * because yellow is light and black text is more readable on it.
 */
export const generateSemanticTokens = (
  options: GenerateSemanticTokensOptions
): SemanticTokenSet => {
  const { accentColor } = options;

  const validation = validateHex(accentColor);
  if (!validation.valid) {
    throw new Error(
      `generateSemanticTokens: invalid accent color — ${validation.error}`
    );
  }

  const primaryPalette = generatePaletteFromHex({
    hex: validation.value ?? accentColor,
    name: 'primary',
  });

  const successPalette = generatePalette({
    name: 'success',
    hue: SEMANTIC_HUES.success,
    baseSaturation: 70,
  });

  const warningPalette = generatePalette({
    name: 'warning',
    hue: SEMANTIC_HUES.warning,
    baseSaturation: 85,
  });

  const errorPalette = generatePalette({
    name: 'error',
    hue: SEMANTIC_HUES.error,
    baseSaturation: 75,
  });

  const infoPalette = generatePalette({
    name: 'info',
    hue: SEMANTIC_HUES.info,
    baseSaturation: 70,
  });

  const neutralPalette = generatePalette({
    name: 'neutral',
    hue: SEMANTIC_HUES.neutral,
    baseSaturation: 15,
  });

  return {
    primary: paletteToSemanticToken(primaryPalette),
    success: paletteToSemanticToken(successPalette),
    warning: paletteToSemanticToken(warningPalette),
    error:   paletteToSemanticToken(errorPalette),
    info:    paletteToSemanticToken(infoPalette),
    neutral: paletteToNeutralScale(neutralPalette),
  };
};