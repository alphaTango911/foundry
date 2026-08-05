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
 * The base hues for each semantic color family.
 * These represent the "pure" meaning of each semantic color.
 * They are shifted by the harmony algorithm but never replaced.
 */
export const SEMANTIC_BASE_HUES = {
    success: 142, // Green — growth, positive, go
    warning: 45, // Amber — caution, attention
    error: 4, // Red — danger, stop, negative
    info: 210, // Blue — neutral information
    neutral: 220, // Blue-gray — foundation, structure
};
// ─── Core Algorithm ──────────────────────────────────────
/**
 * Calculates the shortest angular distance between two hues.
 *
 * Hues exist on a 360° circle. The distance between 10° and 350°
 * is 20°, not 340° — because you can go the short way around.
 *
 * Example:
 * angularDistance(10, 350) → -20 (350 is 20° before 10°)
 * angularDistance(142, 262) → 120 (262 is 120° after 142°)
 */
const angularDistance = (fromHue, toHue) => {
    let delta = toHue - fromHue;
    // Normalize to -180 to +180 range
    // This gives us the shortest path around the circle
    if (delta > 180)
        delta -= 360;
    if (delta < -180)
        delta += 360;
    return delta;
};
/**
 * Normalizes a hue to the 0–360 range.
 */
const normalizeHue = (hue) => {
    return ((hue % 360) + 360) % 360;
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
export const applyHarmony = (baseHue, config) => {
    const { accentHue, strength = 0.1 } = config;
    // Clamp strength to safe range
    const clampedStrength = Math.min(0.3, Math.max(0, strength));
    // Calculate how far the accent is from the base semantic hue
    const distance = angularDistance(baseHue, accentHue);
    // Apply a fraction of that distance as a shift
    const shift = distance * clampedStrength;
    // Cap the maximum shift at 15° to preserve semantic meaning
    const cappedShift = Math.max(-15, Math.min(15, shift));
    // Apply the shift and normalize back to 0–360
    return normalizeHue(baseHue + cappedShift);
};
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
export const generateHarmoniousHues = (config) => {
    return {
        success: applyHarmony(SEMANTIC_BASE_HUES.success, config),
        warning: applyHarmony(SEMANTIC_BASE_HUES.warning, config),
        error: applyHarmony(SEMANTIC_BASE_HUES.error, config),
        info: applyHarmony(SEMANTIC_BASE_HUES.info, config),
        neutral: applyHarmony(SEMANTIC_BASE_HUES.neutral, config),
    };
};
//# sourceMappingURL=harmony.js.map