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

// ─── Types ───────────────────────────────────────────────

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

// ─── Constants ───────────────────────────────────────────

/**
 * Lightness values for each of the 11 shades in light mode.
 *
 * Shade 1  = 97% — near white, used for subtle backgrounds
 * Shade 6  = 44% — the base color, vivid and readable
 * Shade 11 = 12% — near black, used for text
 *
 * These values were hand-tuned to give enough contrast between
 * adjacent shades while keeping the base shade readable.
 *
 * Note: due to HSL's non-perceptual nature, some hues (especially
 * yellow) may appear lighter than others at the same lightness value.
 * OKLCH would fix this — see oklch.ts for the upgrade path.
 */
const LIGHTNESS_SCALE: readonly number[] = [
  97, // shade 1
  93, // shade 2
  85, // shade 3
  76, // shade 4
  65, // shade 5
  44, // shade 6 — BASE
  35, // shade 7
  27, // shade 8
  20, // shade 9
  16, // shade 10
  12, // shade 11
] as const;

/**
 * Saturation multipliers for each of the 11 shades.
 *
 * Saturation peaks at mid-tones (shades 5–7) for vibrancy.
 * Light shades (1–3) are desaturated for use as backgrounds.
 * Dark shades (9–11) are desaturated to avoid looking artificial.
 *
 * These are base values relative to baseSaturation = 80.
 * A different saturation curve is needed for:
 * - Neutral/gray colors (should stay near 0 saturation)
 * - Semantic colors (success, warning, error have fixed meanings)
 * - Dark theme surfaces (need lower saturation throughout)
 * Future: support saturation curve presets per color type.
 */
const SATURATION_SCALE: readonly number[] = [
  30,  // shade 1
  45,  // shade 2
  55,  // shade 3
  65,  // shade 4
  75,  // shade 5
  80,  // shade 6 — BASE
  78,  // shade 7
  72,  // shade 8
  65,  // shade 9
  55,  // shade 10
  45,  // shade 11
] as const;

// ─── Conversion Utilities ────────────────────────────────

/**
 * Converts an HSL color to a hex string.
 * Pure math — no browser APIs — works in Node.js, Figma, CLI.
 */
export const hslToHex = (color: HSLColor): string => {
  const { h, s, l } = color;

  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }

  const toHex = (channel: number): string => {
    const hex = Math.round((channel + m) * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Converts a hex color string to HSL.
 * Assumes input has already been validated by validateHex().
 */
export const hexToHsl = (hex: string): HSLColor => {
  const clean = hex.replace('#', '');

  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  const l = (max + min) / 2;
  const s = delta === 0
    ? 0
    : delta / (1 - Math.abs(2 * l - 1));

  let h = 0;
  if (delta !== 0) {
    if (max === r)      h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else                h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

// ─── Core Generator ──────────────────────────────────────

/**
 * Generates a full 11-shade palette from a hue value.
 *
 * Throws if hue is not a finite number.
 * Clamps baseSaturation to 0–100.
 */
export const generatePalette = (
  options: GeneratePaletteOptions
): ColorPalette => {
  const { name, hue, baseSaturation = 75 } = options;

  // Guard against NaN and Infinity
  if (!Number.isFinite(hue)) {
    throw new Error(
      `generatePalette: hue must be a finite number, got ${hue}`
    );
  }

  // Clamp baseSaturation to valid range
  const clampedSaturation = Math.min(100, Math.max(0, baseSaturation));

  // Normalize hue to 0–360
  const clampedHue = ((hue % 360) + 360) % 360;

  const shades: ColorShade[] = LIGHTNESS_SCALE.map((lightness, index) => {
    const shadeNumber = index + 1;
    const saturationRaw = SATURATION_SCALE[index] ?? 75;

    // Scale saturation relative to baseSaturation
    // Base reference is 80 (the value at shade 6 in SATURATION_SCALE)
    const saturation = Math.round(
      (saturationRaw / 80) * clampedSaturation
    );

    const hslColor: HSLColor = {
      h: clampedHue,
      s: Math.min(100, Math.max(0, saturation)),
      l: lightness,
    };

    return {
      shade: shadeNumber,
      hsl: hslColor,
      hex: hslToHex(hslColor),
    };
  });

  return {
    name,
    hue: clampedHue,
    shades,
  };
};

/**
 * Generates a palette from a hex color.
 * Assumes hex has already been validated by validateHex().
 */
export const generatePaletteFromHex = (options: {
  hex: string;
  name: string;
  baseSaturation?: number;
}): ColorPalette => {
  const { hex, name, baseSaturation } = options;
  const { h } = hexToHsl(hex);

  return generatePalette({
    name,
    hue: h,
    ...(baseSaturation !== undefined && { baseSaturation }),
  });
};