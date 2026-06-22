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

// ─── Types ───────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  /** Human-readable error if valid is false */
  error?: string;
  /** Cleaned/normalized value if valid is true */
  value?: string;
}

// ─── Hex Validation ──────────────────────────────────────

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
export const validateHex = (input: unknown): ValidationResult => {
  // Reject non-strings immediately
  if (typeof input !== 'string') {
    return {
      valid: false,
      error: `Expected a string, got ${typeof input}`,
    };
  }

  // Reject empty strings
  if (input.trim() === '') {
    return {
      valid: false,
      error: 'Color value cannot be empty',
    };
  }

  // Remove # if present, lowercase everything
  const clean = input.trim().toLowerCase().replace(/^#/, '');

  // Expand 3-digit hex to 6-digit
  // e.g. 'fff' → 'ffffff', 'a3b' → 'aa33bb'
  const expanded = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;

  // Must be exactly 6 characters after expansion
  if (expanded.length !== 6) {
    return {
      valid: false,
      error: `Invalid hex color: "${input}". Must be 3 or 6 hex digits (e.g. #3a5afe or #fff)`,
    };
  }

  // Must only contain valid hex characters (0-9, a-f)
  if (!/^[0-9a-f]{6}$/.test(expanded)) {
    return {
      valid: false,
      error: `Invalid hex color: "${input}". Contains non-hex characters`,
    };
  }

  return {
    valid: true,
    value: `#${expanded}`,
  };
};

// ─── Hue Validation ──────────────────────────────────────

/**
 * Validates a hue value (0–360).
 *
 * Accepts any finite number — values outside 0–360 are
 * normalized by the formula engine, so we just reject
 * non-numbers here.
 */
export const validateHue = (input: unknown): ValidationResult => {
  if (typeof input !== 'number') {
    return {
      valid: false,
      error: `Hue must be a number, got ${typeof input}`,
    };
  }

  if (!Number.isFinite(input)) {
    return {
      valid: false,
      error: `Hue must be a finite number, got ${input}`,
    };
  }

  return {
    valid: true,
    value: String(input),
  };
};

// ─── Saturation Validation ───────────────────────────────

/**
 * Validates a saturation value (0–100).
 * Values are clamped rather than rejected — a saturation
 * of 110 becomes 100, not an error.
 */
export const validateSaturation = (input: unknown): ValidationResult => {
  if (typeof input !== 'number') {
    return {
      valid: false,
      error: `Saturation must be a number, got ${typeof input}`,
    };
  }

  if (!Number.isFinite(input)) {
    return {
      valid: false,
      error: `Saturation must be a finite number, got ${input}`,
    };
  }

  const clamped = Math.min(100, Math.max(0, input));

  return {
    valid: true,
    value: String(clamped),
  };
};