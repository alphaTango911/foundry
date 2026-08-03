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
/**
 * Calculates the contrast ratio between two colors.
 *
 * Formula: (lighter luminance + 0.05) / (darker luminance + 0.05)
 * Result: a number from 1 (no contrast) to 21 (black on white)
 *
 * e.g. black (#000000) on white (#ffffff) = 21:1
 *      medium blue on white               ≈ 4.7:1
 */
export declare const getContrastRatio: (foregroundHex: string, backgroundHex: string) => number;
/**
 * Checks whether two colors meet a WCAG contrast requirement.
 */
export declare const checkContrast: (options: {
    foreground: string;
    background: string;
    level?: WCAGLevel;
    textSize?: TextSize;
}) => ContrastResult;
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
export declare const checkPaletteContrast: (options: {
    shades: ColorShade[];
    background: string;
    level?: WCAGLevel;
    textSize?: TextSize;
}) => ShadeContrastResult[];
//# sourceMappingURL=contrast.d.ts.map