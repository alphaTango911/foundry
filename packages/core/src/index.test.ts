/**
 * Index export smoke tests.
 *
 * Verifies that everything the public API promises to export
 * actually exists. These are not logic tests — they are
 * contract tests. If a function moves or gets renamed
 * internally, this catches it immediately.
 */

import { describe, it, expect } from 'vitest';
import * as Foundry from './index';

describe('@foundry/core public API', () => {

  describe('exported functions exist', () => {
    const expectedFunctions = [
      // Color formula engine
      'generatePalette',
      'generatePaletteFromHex',
      'hslToHex',
      'hexToHsl',
      // Validation
      'validateHex',
      'validateHue',
      'validateSaturation',
      // Accessibility
      'getContrastRatio',
      'checkContrast',
      'checkPaletteContrast',
      // Semantic tokens
      'generateSemanticTokens',
      // Theme output
      'generateThemeCSS',
      'generateLightThemeCSS',
      'generateDarkThemeCSS',
    ] as const;

    expectedFunctions.forEach(name => {
      it(`exports ${name}`, () => {
        expect(typeof (Foundry as Record<string, unknown>)[name]).toBe('function');
      });
    });
  });

  describe('end to end — full pipeline', () => {
    it('generates a complete token set and CSS from one accent color', () => {
      const tokens = Foundry.generateSemanticTokens({
        accentColor: '#3a5afe',
      });
      const css = Foundry.generateThemeCSS(tokens);

      // Verify token structure
      expect(tokens.primary.fill).toBeDefined();
      expect(tokens.neutral.background).toBeDefined();

      // Verify CSS structure
      expect(css.light).toContain(':root');
      expect(css.dark).toContain('[data-theme="dark"]');

      // Verify actual token content exists — not just wrapper
      expect(css.combined).toContain('--color-primary-fill');
      expect(css.combined).toContain('--color-neutral-background');
      expect(css.combined).toContain('--color-warning-contrast-text');
    });

    it('contrast checker works on generated colors', () => {
      const tokens = Foundry.generateSemanticTokens({
        accentColor: '#3a5afe',
      });
      const result = Foundry.checkContrast({
        foreground: tokens.primary.contrastText,
        background: tokens.primary.fill,
      });
      expect(result.ratio).toBeGreaterThan(1);
    });
  });

  describe('product decision — invalid brand colors', () => {
    /**
     * Should pure white, black, or gray be valid accent colors?
     *
     * Our current decision: YES — we accept them technically.
     * The web app UI layer will warn users that achromatic
     * colors (saturation = 0) produce flat, unbrandable palettes.
     * We do not reject them at the engine level because:
     * 1. The engine should be flexible
     * 2. Rejection logic belongs in the UI/validation layer
     * 3. Some neutral brand systems intentionally use low saturation
     *
     * This decision is documented here so it can be revisited.
     */
    it('accepts white as accent color — flat palette, user warned in UI', () => {
      expect(() =>
        Foundry.generateSemanticTokens({ accentColor: '#ffffff' })
      ).not.toThrow();
    });

    it('accepts black as accent color — flat palette, user warned in UI', () => {
      expect(() =>
        Foundry.generateSemanticTokens({ accentColor: '#000000' })
      ).not.toThrow();
    });

    it('accepts gray as accent color — flat palette, user warned in UI', () => {
      expect(() =>
        Foundry.generateSemanticTokens({ accentColor: '#808080' })
      ).not.toThrow();
    });
  });
});