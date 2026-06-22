import { describe, it, expect } from 'vitest';
import {
  hslToHex,
  hexToHsl,
  generatePalette,
  generatePaletteFromHex,
  type HSLColor,
} from './hsl';

describe('hslToHex', () => {
  it('converts pure red to hex', () => {
    const color: HSLColor = { h: 0, s: 100, l: 50 };
    expect(hslToHex(color)).toBe('#ff0000');
  });

  it('converts pure white to hex', () => {
    const color: HSLColor = { h: 0, s: 0, l: 100 };
    expect(hslToHex(color)).toBe('#ffffff');
  });

  it('converts pure black to hex', () => {
    const color: HSLColor = { h: 0, s: 0, l: 0 };
    expect(hslToHex(color)).toBe('#000000');
  });

  it('converts blue to hex', () => {
    const color: HSLColor = { h: 240, s: 100, l: 50 };
    expect(hslToHex(color)).toBe('#0000ff');
  });

  it('converts green to hex', () => {
    const color: HSLColor = { h: 120, s: 100, l: 50 };
    expect(hslToHex(color)).toBe('#00ff00');
  });

  it('handles zero saturation (gray)', () => {
    const color: HSLColor = { h: 200, s: 0, l: 50 };
    expect(hslToHex(color)).toBe('#808080');
  });
});

describe('hexToHsl', () => {
  it('converts white hex to HSL', () => {
    const result = hexToHsl('#ffffff');
    expect(result.l).toBe(100);
    expect(result.s).toBe(0);
  });

  it('converts black hex to HSL', () => {
    const result = hexToHsl('#000000');
    expect(result.l).toBe(0);
    expect(result.s).toBe(0);
  });

  it('converts red hex to correct hue', () => {
    const result = hexToHsl('#ff0000');
    expect(result.h).toBe(0);
    expect(result.s).toBe(100);
    expect(result.l).toBe(50);
  });

  it('converts blue hex to correct hue', () => {
    const result = hexToHsl('#0000ff');
    expect(result.h).toBe(240);
  });

  it('handles hex without # prefix', () => {
    const withHash = hexToHsl('#ff0000');
    const withoutHash = hexToHsl('ff0000');
    expect(withHash).toEqual(withoutHash);
  });

  it('handles uppercase hex', () => {
    const lower = hexToHsl('#ff0000');
    const upper = hexToHsl('#FF0000');
    expect(lower).toEqual(upper);
  });
});

describe('generatePalette', () => {
  it('generates exactly 11 shades', () => {
    const palette = generatePalette({ name: 'blue', hue: 210 });
    expect(palette.shades).toHaveLength(11);
  });

  it('shades are numbered 1 through 11', () => {
    const palette = generatePalette({ name: 'blue', hue: 210 });
    const shadeNumbers = palette.shades.map(s => s.shade);
    expect(shadeNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('every shade has a valid hex color', () => {
    const palette = generatePalette({ name: 'blue', hue: 210 });
    const hexPattern = /^#[0-9a-f]{6}$/;
    palette.shades.forEach(shade => {
      expect(shade.hex).toMatch(hexPattern);
    });
  });

  it('shade 1 is lighter than shade 11', () => {
    const palette = generatePalette({ name: 'blue', hue: 210 });
    const shade1 = palette.shades[0];
    const shade11 = palette.shades[10];
    expect(shade1?.hsl.l).toBeGreaterThan(shade11?.hsl.l ?? 100);
  });

  it('all shades share the same hue', () => {
    const palette = generatePalette({ name: 'blue', hue: 210 });
    palette.shades.forEach(shade => {
      expect(shade.hsl.h).toBe(210);
    });
  });

  it('normalizes hue values above 360', () => {
    const palette = generatePalette({ name: 'blue', hue: 570 });
    expect(palette.hue).toBe(210);
  });

  it('normalizes negative hue values', () => {
    const palette = generatePalette({ name: 'red', hue: -10 });
    expect(palette.hue).toBe(350);
  });

  it('throws on NaN hue', () => {
    expect(() =>
      generatePalette({ name: 'blue', hue: NaN })
    ).toThrow('must be a finite number');
  });

  it('throws on Infinity hue', () => {
    expect(() =>
      generatePalette({ name: 'blue', hue: Infinity })
    ).toThrow('must be a finite number');
  });

  it('clamps baseSaturation above 100', () => {
    const palette = generatePalette({
      name: 'blue',
      hue: 210,
      baseSaturation: 150,
    });
    palette.shades.forEach(shade => {
      expect(shade.hsl.s).toBeLessThanOrEqual(100);
    });
  });

  it('clamps baseSaturation below 0', () => {
    const palette = generatePalette({
      name: 'blue',
      hue: 210,
      baseSaturation: -20,
    });
    palette.shades.forEach(shade => {
      expect(shade.hsl.s).toBeGreaterThanOrEqual(0);
    });
  });

  it('returns the correct palette name', () => {
    const palette = generatePalette({ name: 'indigo', hue: 231 });
    expect(palette.name).toBe('indigo');
  });
});

describe('generatePaletteFromHex', () => {
  it('generates 11 shades from a hex color', () => {
    const palette = generatePaletteFromHex({
      hex: '#3a5afe',
      name: 'primary',
    });
    expect(palette.shades).toHaveLength(11);
  });

  it('works without optional baseSaturation', () => {
    expect(() =>
      generatePaletteFromHex({ hex: '#3a5afe', name: 'primary' })
    ).not.toThrow();
  });

  it('works with baseSaturation provided', () => {
    expect(() =>
      generatePaletteFromHex({
        hex: '#3a5afe',
        name: 'primary',
        baseSaturation: 90,
      })
    ).not.toThrow();
  });
});