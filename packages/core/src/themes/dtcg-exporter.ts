/**
 * W3C DTCG Exporter
 *
 * Converts semantic token objects into the W3C Design Tokens Community
 * Group format (https://tr.designtokens.org/format/).
 *
 * Why DTCG?
 * It is the interchange standard for token pipelines:
 * - Style Dictionary v4 reads it natively
 * - Tokens Studio imports and exports it
 * - AI coding agents can consume it as reliable, typed context —
 *   a machine-readable contract for what "on-brand" means
 *
 * Format essentials implemented here:
 * - Every token leaf carries "$type" and "$value"
 * - Groups are plain nested objects; "$type" declared at group level
 *   is inherited by children (we also declare it per leaf for clarity)
 * - "$description" documents intent, because a token's purpose is part
 *   of its contract — not just its value
 *
 * Theming note:
 * The DTCG spec does not yet standardize modes/themes (the resolver
 * spec is still in progress), so this follows the current community
 * convention: one document per theme, identical token paths in both.
 */

import {
  type SemanticTokenSet,
  type SemanticColorToken,
  type NeutralTokenScale,
} from '../semantic/tokens';

// ─── Types ───────────────────────────────────────────────

/** A single DTCG token leaf. */
export interface DTCGToken {
  $type: 'color';
  $value: string;
  $description?: string;
}

/** A DTCG group: nested groups and/or token leaves. */
export interface DTCGGroup {
  [key: string]: DTCGGroup | DTCGToken | string | undefined;
}

/** Options for DTCG export. */
export interface DTCGExportOptions {
  /**
   * Include the full 11-shade raw palettes under color.palette.*
   * Default: false — semantic tokens are the public contract;
   * raw shades are implementation detail unless a consumer needs them.
   */
  includePalettes?: boolean;
}

/** Both themes exported as DTCG documents. */
export interface DTCGThemes {
  /** Light theme DTCG document (pretty-printed JSON string) */
  light: string;
  /** Dark theme DTCG document (pretty-printed JSON string) */
  dark: string;
}

// ─── Internal builders ───────────────────────────────────

const token = (value: string, description: string): DTCGToken => ({
  $type: 'color',
  $value: value,
  $description: description,
});

/**
 * Maps an action color's variants to a DTCG group.
 * Descriptions carry usage intent, because an agent reading this file
 * should learn *when* to use a token, not only what hex it holds.
 */
const actionColorToGroup = (name: string, t: SemanticColorToken): DTCGGroup => ({
  bg: token(t.bg, `Subtle ${name} background tint`),
  bgHover: token(t.bgHover, `Hover state for ${name} background`),
  border: token(t.border, `${name} border`),
  borderHover: token(t.borderHover, `Hover state for ${name} border`),
  fill: token(t.fill, `Base ${name} fill — buttons, badges, icons`),
  fillHover: token(t.fillHover, `Hover state for ${name} fill`),
  fillActive: token(t.fillActive, `Active/pressed state for ${name} fill`),
  text: token(t.text, `${name}-coloured text on light backgrounds`),
  textHover: token(t.textHover, `Hover state for ${name} text`),
  textActive: token(t.textActive, `Active state for ${name} text`),
  contrastText: token(
    t.contrastText,
    `Text and icons on top of ${name} fill — chosen for contrast`
  ),
});

const neutralToGroup = (n: NeutralTokenScale): DTCGGroup => ({
  background: token(n.background, 'Page background'),
  surface: token(n.surface, 'Card / surface background'),
  surfaceHover: token(n.surfaceHover, 'Hover state for surfaces'),
  border: token(n.border, 'Subtle border'),
  borderStrong: token(n.borderStrong, 'Strong border, dividers'),
  textMuted: token(n.textMuted, 'Muted / placeholder text'),
  text: token(n.text, 'Secondary body text'),
  textStrong: token(n.textStrong, 'Primary headings and body text'),
});

const paletteToGroup = (t: SemanticColorToken | NeutralTokenScale): DTCGGroup => {
  const group: DTCGGroup = {};
  t.palette.shades.forEach((shade) => {
    group[String(shade.shade)] = token(
      shade.hex,
      `Raw palette shade ${shade.shade}`
    );
  });
  return group;
};

// ─── Public API ──────────────────────────────────────────

/**
 * Convert a semantic token set into a DTCG document object.
 * Use exportDTCG for a ready-to-write JSON string.
 */
export const tokensToDTCG = (
  tokens: SemanticTokenSet,
  options: DTCGExportOptions = {}
): DTCGGroup => {
  const color: DTCGGroup = {
    $type: 'color',
    primary: actionColorToGroup('primary', tokens.primary),
    success: actionColorToGroup('success', tokens.success),
    warning: actionColorToGroup('warning', tokens.warning),
    error: actionColorToGroup('error', tokens.error),
    info: actionColorToGroup('info', tokens.info),
    neutral: neutralToGroup(tokens.neutral),
  };

  if (options.includePalettes) {
    color['palette'] = {
      primary: paletteToGroup(tokens.primary),
      success: paletteToGroup(tokens.success),
      warning: paletteToGroup(tokens.warning),
      error: paletteToGroup(tokens.error),
      info: paletteToGroup(tokens.info),
      neutral: paletteToGroup(tokens.neutral),
    };
  }

  return { color };
};

/**
 * Export a token set as a pretty-printed DTCG JSON string —
 * ready to write as tokens.json for Style Dictionary or similar.
 */
export const exportDTCG = (
  tokens: SemanticTokenSet,
  options: DTCGExportOptions = {}
): string => JSON.stringify(tokensToDTCG(tokens, options), null, 2);

/**
 * Export light and dark token sets as two DTCG documents with
 * identical token paths — the current community convention for
 * theming until the DTCG resolver spec lands.
 */
export const exportDTCGThemes = (
  light: SemanticTokenSet,
  dark: SemanticTokenSet,
  options: DTCGExportOptions = {}
): DTCGThemes => ({
  light: exportDTCG(light, options),
  dark: exportDTCG(dark, options),
});
