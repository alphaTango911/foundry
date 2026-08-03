/**
 * CSS Custom Properties Exporter
 *
 * Converts semantic token objects into CSS custom properties.
 *
 * Why CSS custom properties?
 * They are the universal format. Every framework reads them:
 * - Vanilla CSS uses them directly
 * - Tailwind v4 reads them via @theme
 * - React reads them via style={{ color: 'var(--color-primary-fill)' }}
 * - Figma Variables can be mapped to them
 *
 * Output example:
 * :root {
 *   --color-primary-fill: #3a5afe;
 *   --color-primary-text: #1a2fa8;
 *   --color-neutral-background: #f8fafc;
 * }
 *
 * Dark mode output uses [data-theme="dark"] selector:
 * [data-theme="dark"] {
 *   --color-primary-fill: #5b7aff;
 *   --color-neutral-background: #0f172a;
 * }
 *
 * This means dark mode works by setting data-theme="dark"
 * on the <html> element — no JavaScript class toggling needed.
 */
import { type SemanticTokenSet } from '../semantic/tokens';
/**
 * The CSS output for both light and dark themes.
 */
export interface ThemeCSS {
    /** Full CSS string for light mode — goes in :root */
    light: string;
    /** Full CSS string for dark mode — goes in [data-theme="dark"] */
    dark: string;
    /** Both combined into one CSS string ready to inject or write to file */
    combined: string;
}
/**
 * Generates the light theme CSS block.
 *
 * Uses :root selector so tokens are available everywhere
 * by default without any extra setup.
 */
export declare const generateLightThemeCSS: (tokens: SemanticTokenSet) => string;
/**
 * Generates the dark theme CSS block.
 *
 * Dark mode strategy:
 * - Fill colors stay similar but slightly lighter for contrast
 * - Background and surface colors become very dark
 * - Text colors invert (light text on dark backgrounds)
 * - Borders become more subtle
 *
 * We use the SAME token names as light mode — components
 * don't change. Only the values change.
 *
 * Activated by: <html data-theme="dark">
 *
 * Note: this is a starting point. A production dark theme
 * needs careful per-token tuning. The palette inversion
 * here is a principled approximation — not a final answer.
 */
export declare const generateDarkThemeCSS: (tokens: SemanticTokenSet) => string;
/**
 * Generates both light and dark theme CSS combined.
 *
 * This is the main function the web app and CLI will call.
 * The output can be:
 * - Written to a tokens.css file
 * - Injected into a <style> tag
 * - Copied by the user from the export panel
 */
export declare const generateThemeCSS: (tokens: SemanticTokenSet) => ThemeCSS;
//# sourceMappingURL=css-exporter.d.ts.map