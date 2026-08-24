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
import { type SemanticTokenSet } from '../semantic/tokens';
/**
 * A DTCG 2025.10 color value: colorSpace + components are required;
 * hex is an optional fallback for tools with limited color-space support.
 * https://www.designtokens.org/tr/2025.10/color/
 */
export interface DTCGColorValue {
    colorSpace: 'srgb';
    components: [number, number, number];
    hex: string;
}
/** A single DTCG token leaf. */
export interface DTCGToken {
    $type: 'color';
    $value: DTCGColorValue;
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
/**
 * Convert a semantic token set into a DTCG document object.
 * Use exportDTCG for a ready-to-write JSON string.
 */
export declare const tokensToDTCG: (tokens: SemanticTokenSet, options?: DTCGExportOptions) => DTCGGroup;
/**
 * Export a token set as a pretty-printed DTCG JSON string —
 * ready to write as tokens.json for Style Dictionary or similar.
 */
export declare const exportDTCG: (tokens: SemanticTokenSet, options?: DTCGExportOptions) => string;
/**
 * Export light and dark token sets as two DTCG documents with
 * identical token paths — the current community convention for
 * theming until the DTCG resolver spec lands.
 */
export declare const exportDTCGThemes: (light: SemanticTokenSet, dark: SemanticTokenSet, options?: DTCGExportOptions) => DTCGThemes;
//# sourceMappingURL=dtcg-exporter.d.ts.map