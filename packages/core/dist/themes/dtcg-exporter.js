/**
 * W3C DTCG Exporter
 *
 * Converts semantic token objects into the Design Tokens Community
 * Group format, stable specification 2025.10
 * (https://www.designtokens.org/tr/2025.10/).
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
 * - Per the 2025.10 color module, "$value" for a color token is a
 *   structured object — { colorSpace, components, hex } — not a bare
 *   hex string. We use the "srgb" color space (Foundry's palettes are
 *   generated in sRGB) and include "hex" as the optional fallback
 *   field for tools that don't yet support structured color values.
 * - Groups are plain nested objects; "$type" declared at group level
 *   is inherited by children (we also declare it per leaf for clarity)
 * - "$description" documents intent, because a token's purpose is part
 *   of its contract — not just its value
 *
 * Theming note:
 * 2025.10 also stabilized a resolver module for modes/themes, but
 * adopting it is a larger structural change than this exporter makes
 * today. For now we still follow the simpler community convention of
 * one document per theme with identical token paths in both.
 */
// ─── Internal builders ───────────────────────────────────
/**
 * Converts a 6-digit hex string to normalized (0–1) sRGB components,
 * per the DTCG 2025.10 color module's "srgb" color space.
 * Assumes input has already been validated by validateHex().
 * Rounded to 4 decimal places — enough precision to round-trip
 * accurately without floating-point noise in the JSON output.
 */
const hexToSrgbComponents = (hex) => {
    const clean = hex.replace('#', '');
    const round4 = (n) => Math.round(n * 10000) / 10000;
    const r = round4(parseInt(clean.slice(0, 2), 16) / 255);
    const g = round4(parseInt(clean.slice(2, 4), 16) / 255);
    const b = round4(parseInt(clean.slice(4, 6), 16) / 255);
    return [r, g, b];
};
const toDTCGColorValue = (hex) => ({
    colorSpace: 'srgb',
    components: hexToSrgbComponents(hex),
    hex,
});
const token = (value, description) => ({
    $type: 'color',
    $value: toDTCGColorValue(value),
    $description: description,
});
/**
 * Maps an action color's variants to a DTCG group.
 * Descriptions carry usage intent, because an agent reading this file
 * should learn *when* to use a token, not only what hex it holds.
 */
const actionColorToGroup = (name, t) => ({
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
    contrastText: token(t.contrastText, `Text and icons on top of ${name} fill — chosen for contrast`),
});
const neutralToGroup = (n) => ({
    background: token(n.background, 'Page background'),
    surface: token(n.surface, 'Card / surface background'),
    surfaceHover: token(n.surfaceHover, 'Hover state for surfaces'),
    border: token(n.border, 'Subtle border'),
    borderStrong: token(n.borderStrong, 'Strong border, dividers'),
    textMuted: token(n.textMuted, 'Muted / placeholder text'),
    text: token(n.text, 'Secondary body text'),
    textStrong: token(n.textStrong, 'Primary headings and body text'),
});
const paletteToGroup = (t) => {
    const group = {};
    t.palette.shades.forEach((shade) => {
        group[String(shade.shade)] = token(shade.hex, `Raw palette shade ${shade.shade}`);
    });
    return group;
};
// ─── Public API ──────────────────────────────────────────
/**
 * Convert a semantic token set into a DTCG document object.
 * Use exportDTCG for a ready-to-write JSON string.
 */
export const tokensToDTCG = (tokens, options = {}) => {
    const color = {
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
export const exportDTCG = (tokens, options = {}) => JSON.stringify(tokensToDTCG(tokens, options), null, 2);
/**
 * Export light and dark token sets as two DTCG documents with
 * identical token paths — the current community convention for
 * theming until the DTCG resolver spec lands.
 */
export const exportDTCGThemes = (light, dark, options = {}) => ({
    light: exportDTCG(light, options),
    dark: exportDTCG(dark, options),
});
//# sourceMappingURL=dtcg-exporter.js.map