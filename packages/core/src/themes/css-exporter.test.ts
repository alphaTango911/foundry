import { describe, it, expect } from 'vitest';
import {
  generateLightThemeCSS,
  generateDarkThemeCSS,
  generateThemeCSS,
} from './css-exporter';
import { generateSemanticTokens } from '../semantic/tokens';

const tokens = generateSemanticTokens({ accentColor: '#3a5afe' });

describe('generateLightThemeCSS', () => {
  const css = generateLightThemeCSS(tokens);

  it('outputs a string', () => {
    expect(typeof css).toBe('string');
  });

  it('contains :root selector', () => {
    expect(css).toContain(':root {');
  });

  it('contains primary fill token', () => {
    expect(css).toContain('--color-primary-fill:');
  });

  it('contains success fill token', () => {
    expect(css).toContain('--color-success-fill:');
  });

  it('contains warning fill token', () => {
    expect(css).toContain('--color-warning-fill:');
  });

  it('contains error fill token', () => {
    expect(css).toContain('--color-error-fill:');
  });

  it('contains neutral background token', () => {
    expect(css).toContain('--color-neutral-background:');
  });

  it('contains neutral text-strong token', () => {
    expect(css).toContain('--color-neutral-text-strong:');
  });

  it('contains expected number of CSS custom properties', () => {
  // 5 action groups × 11 tokens each = 55
  // 1 neutral group × 8 tokens = 8
  // Total = 63 custom properties in light theme
  const propertyCount = (css.match(/--color-/g) ?? []).length;
  expect(propertyCount).toBe(63);
});

  it('uses camelCase to kebab-case conversion correctly', () => {
    expect(css).toContain('--color-primary-bg-hover:');
    expect(css).toContain('--color-primary-fill-active:');
    expect(css).toContain('--color-primary-contrast-text:');
    expect(css).toContain('--color-neutral-surface-hover:');
    expect(css).toContain('--color-neutral-border-strong:');
    expect(css).toContain('--color-neutral-text-muted:');
  });
});

describe('generateDarkThemeCSS', () => {
  const css = generateDarkThemeCSS(tokens);

  it('outputs a string', () => {
    expect(typeof css).toBe('string');
  });

  it('contains data-theme dark selector', () => {
    expect(css).toContain('[data-theme="dark"] {');
  });

  it('contains same token names as light theme', () => {
    expect(css).toContain('--color-primary-fill:');
    expect(css).toContain('--color-neutral-background:');
  });

  it('neutral background is darker in dark mode than light mode', () => {
    const lightCSS = generateLightThemeCSS(tokens);
    const darkCSS = generateDarkThemeCSS(tokens);

    const getLightness = (css: string, token: string): number => {
      const regex = new RegExp(`${token}: (#[0-9a-f]{6})`);
      const match = css.match(regex);
      const hex = match?.[1];
      if (!hex) return 50;
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return (Math.max(r, g, b) + Math.min(r, g, b)) / 2 * 100;
    };

    const lightBg = getLightness(lightCSS, '--color-neutral-background');
    const darkBg = getLightness(darkCSS, '--color-neutral-background');
    expect(darkBg).toBeLessThan(lightBg);
  });
});

describe('generateThemeCSS', () => {
  const result = generateThemeCSS(tokens);

  it('returns light, dark and combined strings', () => {
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
    expect(result.combined).toBeDefined();
  });

  it('combined contains both :root and dark selector', () => {
    expect(result.combined).toContain(':root {');
    expect(result.combined).toContain('[data-theme="dark"] {');
  });

  it('combined is light + dark joined', () => {
    expect(result.combined).toContain(result.light);
    expect(result.combined).toContain(result.dark);
  });
});