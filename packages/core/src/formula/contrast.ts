/**
 * WCAG Contrast Checker
 *
 * Checks whether a foreground + background color pair meets
 * WCAG 2.1 accessibility guidelines.
 *
 * Important: accessibility is about COLOR PAIRS, not individual colors.
 * A color cannot "be accessible" on its own — only a foreground and
 * background together can pass or fail a contrast requirement.
 *
 * WCAG levels:
 * AA  — minimum requirement. Ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
 * AAA — enhanced requirement. Ratio ≥ 7:1 for normal text, ≥ 4.5:1 for large text
 */

import { type ColorShade } from './hsl';

// ─── Types ───────────────────────────────────────────────

export type WCAGLevel = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';

/**
 * The result of a contrast check between two colors.
 */
export interface ContrastResult {
  /** The calculated contrast ratio e.g. 4.7 */
  ratio: number;
  /** Whether the pair passes the requested WCAG level */
  passes: boolean;
  /** The WCAG level that was checked */
  level: WCAGLevel;
  /** The text size that was checked */
  textSize: TextSize;
  /** Minimum ratio required for this level + text size combination */
  requiredRatio: number;
}

/**
 * A suggestion for the closest accessible alternative shade.
 */
export interface AccessibleSuggestion {
  /** The shade number that passes (e.g. 7 instead of 6) */
  shade: number;
  /** The hex color of the suggested shade */
  hex: string;
  /** The contrast ratio of the suggested shade */
  ratio: number;
}

/**
 * Full result of checking a palette shade against a background.
 */
export interface ShadeContrastResult {
  shade: number;
  hex: string;
  contrast: ContrastResult;
  /**
   * If contrast.passes is false, this suggests the nearest
   * shade that does pass.
   */
  suggestion: AccessibleSuggestion | null;
}

// ─── Constants ───────────────────────────────────────────

/**
 * Minimum contrast ratios required by WCAG 2.1.
 *
 * Normal text = body text, labels, captions
 * Large text  = 18pt+ regular or 14pt+ bold (roughly 24px or 18.67px bold)
 */
const REQUIRED_RATIOS: Record<WCAGLevel, Record<TextSize, number>> = {
  AA:  { normal: 4.5, large: 3.0 },
  AAA: { normal: 7.0, large: 4.5 },
};

// ─── Core Math ───────────────────────────────────────────

/**
 * Converts a hex color to its relative luminance.
 *
 * Relative luminance is a measure of how bright a color appears
 * to the human eye — 0 is black, 1 is white.
 *
 * This is the standard WCAG formula. It accounts for the fact
 * that our eyes are more sensitive to green than red or blue.
 */
const hexToLuminance = (hex: string): number => {
  const clean = hex.replace('#', '');

  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  // Apply gamma correction — this is the WCAG standard formula
  // Colors need to be converted from sRGB to linear light values
  const toLinear = (channel: number): number =>
    channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);

  return (
    0.2126 * toLinear(r) +
    0.7152 * toLinear(g) +
    0.0722 * toLinear(b)
  );
};

/**
 * Calculates the contrast ratio between two colors.
 *
 * Formula: (lighter luminance + 0.05) / (darker luminance + 0.05)
 * Result: a number from 1 (no contrast) to 21 (black on white)
 *
 * e.g. black (#000000) on white (#ffffff) = 21:1
 *      medium blue on white               ≈ 4.7:1
 */
export const getContrastRatio = (
  foregroundHex: string,
  backgroundHex: string
): number => {
  const fgLuminance = hexToLuminance(foregroundHex);
  const bgLuminance = hexToLuminance(backgroundHex);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker  = Math.min(fgLuminance, bgLuminance);

  const ratio = (lighter + 0.05) / (darker + 0.05);

  // Round to 2 decimal places
  return Math.round(ratio * 100) / 100;
};

/**
 * Checks whether two colors meet a WCAG contrast requirement.
 */
export const checkContrast = (options: {
  foreground: string;
  background: string;
  level?: WCAGLevel;
  textSize?: TextSize;
}): ContrastResult => {
  const {
    foreground,
    background,
    level = 'AA',
    textSize = 'normal',
  } = options;

  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = REQUIRED_RATIOS[level][textSize];

  return {
    ratio,
    passes: ratio >= requiredRatio,
    level,
    textSize,
    requiredRatio,
  };
};

// ─── Palette Checker ─────────────────────────────────────

/**
 * Checks every shade in a palette against a background color.
 *
 * For each shade that fails, it finds the nearest shade that
 * passes and suggests it as an alternative.
 *
 * This is what the web app calls to show the accessibility
 * traffic lights next to each color swatch.
 *
 * Example:
 * checkPaletteContrast({
 *   shades: bluePalette.shades,
 *   background: '#ffffff',
 *   level: 'AA'
 * })
 * → [
 *     { shade: 1, passes: false, suggestion: { shade: 7, hex: '...' } },
 *     { shade: 6, passes: true,  suggestion: null },
 *     ...
 *   ]
 */
export const checkPaletteContrast = (options: {
  shades: ColorShade[];
  background: string;
  level?: WCAGLevel;
  textSize?: TextSize;
}): ShadeContrastResult[] => {
  const { shades, background, level = 'AA', textSize = 'normal' } = options;
  const requiredRatio = REQUIRED_RATIOS[level][textSize];

  return shades.map(shade => {
    const contrast = checkContrast({
      foreground: shade.hex,
      background,
      level,
      textSize,
    });

    // If it passes, no suggestion needed
    if (contrast.passes) {
      return { shade: shade.shade, hex: shade.hex, contrast, suggestion: null };
    }

    // Find the nearest shade that passes
    // We look for the shade closest in number to the failing shade
    const passingSuggestion = shades
      .filter(s => {
        const ratio = getContrastRatio(s.hex, background);
        return ratio >= requiredRatio;
      })
      .sort((a, b) => {
        // Sort by distance from the failing shade
        const distA = Math.abs(a.shade - shade.shade);
        const distB = Math.abs(b.shade - shade.shade);
        return distA - distB;
      })[0];

    const suggestion: AccessibleSuggestion | null = passingSuggestion
      ? {
          shade: passingSuggestion.shade,
          hex: passingSuggestion.hex,
          ratio: getContrastRatio(passingSuggestion.hex, background),
        }
      : null;

    return { shade: shade.shade, hex: shade.hex, contrast, suggestion };
  });
};