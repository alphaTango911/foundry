/**
 * Input validation for the color engine.
 *
 * All user-facing inputs pass through here before touching
 * the formula engine. This means the engine functions can
 * assume their inputs are valid — no defensive checks needed
 * inside the math.
 *
 * Why separate validation?
 * It makes testing easier — you can test validation logic
 * independently from color math logic.
 */
export interface ValidationResult {
    valid: boolean;
    /** Human-readable error if valid is false */
    error?: string;
    /** Cleaned/normalized value if valid is true */
    value?: string;
}
/**
 * Validates and normalizes a hex color string.
 *
 * Accepts:
 *   #3a5afe  → valid, returns '#3a5afe'
 *   3a5afe   → valid (missing #), returns '#3a5afe'
 *   #fff     → valid (3-digit), expands to '#ffffff'
 *   fff      → valid (3-digit, missing #), expands to '#ffffff'
 *
 * Rejects:
 *   blue     → invalid (not a hex code)
 *   #12      → invalid (too short)
 *   #zzzzzz  → invalid (not valid hex characters)
 *   ''       → invalid (empty)
 *   null     → invalid
 */
export declare const validateHex: (input: unknown) => ValidationResult;
/**
 * Validates a hue value (0–360).
 *
 * Accepts any finite number — values outside 0–360 are
 * normalized by the formula engine, so we just reject
 * non-numbers here.
 */
export declare const validateHue: (input: unknown) => ValidationResult;
/**
 * Validates a saturation value (0–100).
 * Values are clamped rather than rejected — a saturation
 * of 110 becomes 100, not an error.
 */
export declare const validateSaturation: (input: unknown) => ValidationResult;
//# sourceMappingURL=validation.d.ts.map