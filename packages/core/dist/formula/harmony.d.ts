/**
 * Color Harmony Engine
 *
 * Calculates harmonious hue adjustments for semantic colors
 * based on the user's accent color.
 *
 * Why color harmony matters:
 * Without harmony, a purple brand color produces a generic
 * green success, generic red error, and generic amber warning
 * that feel disconnected from the brand.
 *
 * With harmony, each semantic color shifts slightly toward
 * the accent hue — keeping its meaning (green still means
 * success) but feeling like it belongs to the same family.
 *
 * This is the same technique used by Google Material You,
 * Apple's dynamic colors, and Radix UI's color system.
 *
 * How it works:
 * 1. Extract the hue from the user's accent color
 * 2. For each semantic color, calculate the angular distance
 *    between the semantic base hue and the accent hue
 * 3. Shift the semantic hue by a small fraction of that distance
 * 4. The shift is clamped so meaning is never lost
 *
 * Example:
 * Accent: #8b5cf6 (purple, hue ~262°)
 * Success base hue: 142° (green)
 * Angular distance: 120°
 * Harmony strength: 0.1
 * Shift: 120° × 0.1 = 12°
 * Adjusted success hue: 142° + 12° = 154° (slightly warmer green)
 */
/**
 * Configuration for color harmony.
 */
export interface HarmonyConfig {
    /**
     * The hue of the user's accent color (0–360).
     * Extracted from the accent hex color.
     */
    accentHue: number;
    /**
     * How strongly the accent hue influences semantic colors.
     * Range: 0.0 (no influence) to 0.3 (strong influence).
     * Default: 0.1 (subtle, safe for most brands).
     *
     * Keep this low — semantic colors must retain their meaning.
     * A red success or green error would confuse users.
     */
    strength?: number;
}
/**
 * The base hues for each semantic color family.
 * These represent the "pure" meaning of each semantic color.
 * They are shifted by the harmony algorithm but never replaced.
 */
export declare const SEMANTIC_BASE_HUES: {
    readonly success: 142;
    readonly warning: 45;
    readonly error: 4;
    readonly info: 210;
    readonly neutral: 220;
};
/**
 * Applies harmony to a single semantic hue.
 *
 * Takes the base semantic hue and shifts it slightly
 * toward the accent hue based on harmony strength.
 *
 * The maximum shift is capped at 15° to preserve meaning.
 * No matter what accent color is chosen, green will always
 * read as green, red as red, etc.
 */
export declare const applyHarmony: (baseHue: number, config: HarmonyConfig) => number;
/**
 * Generates harmonious hues for all semantic colors
 * based on the accent color's hue.
 *
 * Example with purple accent (hue 262°):
 * {
 *   success: 154°  (was 142°, shifted +12° toward purple)
 *   warning: 41°   (was 45°, shifted -4° toward purple)
 *   error: 7°      (was 4°, shifted +3° toward purple)
 *   info: 214°     (was 210°, shifted +4° toward purple)
 *   neutral: 223°  (was 220°, shifted +3° toward purple)
 * }
 *
 * The shifts are subtle but the palette feels cohesive.
 */
export declare const generateHarmoniousHues: (config: HarmonyConfig) => {
    success: number;
    warning: number;
    error: number;
    info: number;
    neutral: number;
};
//# sourceMappingURL=harmony.d.ts.map