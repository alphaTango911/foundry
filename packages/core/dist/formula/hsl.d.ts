/**
 * HSL Color Formula Engine
 *
 * Generates a consistent 11-step color scale from a single hue value.
 *
 * Why HSL?
 * HSL (Hue, Saturation, Lightness) is practical and widely supported.
 * It is easier to reason about than RGB and works natively in all browsers.
 *
 * Important limitation:
 * HSL is NOT a perceptually uniform color space. Two colors at the same
 * HSL lightness value can appear visually different in brightness —
 * especially yellows vs blues. For production-grade perceptual accuracy,
 * the future direction is OKLCH (see oklch.ts).
 *
 * For this version, HSL gives us a good practical approximation that
 * works well for design system palettes with careful lightness tuning.
 *
 * Dark mode note:
 * Lightness inversion is a starting point for dark mode, not a complete
 * solution. Dark mode requires its own semantic mapping, reduced
 * saturation, and different surface elevation behavior. See themes/dark.ts.
 */
/**
 * A single HSL color value.
 * H = Hue (0–360 degrees on the color wheel)
 * S = Saturation (0–100, how vivid the color is)
 * L = Lightness (0–100, how light or dark)
 */
export interface HSLColor {
    h: number;
    s: number;
    l: number;
}
/**
 * One shade in a color palette.
 */
export interface ColorShade {
    shade: number;
    hsl: HSLColor;
    hex: string;
}
/**
 * A full 11-shade palette for one color family.
 */
export interface ColorPalette {
    name: string;
    hue: number;
    shades: ColorShade[];
}
/**
 * Options for generating a palette.
 */
export interface GeneratePaletteOptions {
    /** Color family name e.g. 'blue', 'red', 'indigo' */
    name: string;
    /**
     * Hue value 0–360.
     * e.g. 210 = blue, 0 = red, 270 = purple, 120 = green
     * Must be a finite number. NaN and Infinity are rejected.
     */
    hue: number;
    /**
     * Saturation at the base shade (shade 6). Default is 75.
     * Range: 0–100. Values outside this range are clamped.
     * Note: very high values (90+) may look harsh at light/dark extremes.
     */
    baseSaturation?: number;
}
/**
 * Converts an HSL color to a hex string.
 * Pure math — no browser APIs — works in Node.js, Figma, CLI.
 */
export declare const hslToHex: (color: HSLColor) => string;
/**
 * Converts a hex color string to HSL.
 * Assumes input has already been validated by validateHex().
 */
export declare const hexToHsl: (hex: string) => HSLColor;
/**
 * Generates a full 11-shade palette from a hue value.
 *
 * Throws if hue is not a finite number.
 * Clamps baseSaturation to 0–100.
 */
export declare const generatePalette: (options: GeneratePaletteOptions) => ColorPalette;
/**
 * Generates a palette from a hex color.
 * Assumes hex has already been validated by validateHex().
 */
export declare const generatePaletteFromHex: (options: {
    hex: string;
    name: string;
    baseSaturation?: number;
}) => ColorPalette;
//# sourceMappingURL=hsl.d.ts.map