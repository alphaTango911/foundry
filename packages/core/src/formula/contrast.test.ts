import { describe, it, expect } from 'vitest';
import {
  getContrastRatio,
  checkContrast,
  checkPaletteContrast,
} from './contrast';
import { generatePalette } from './hsl';

describe('getContrastRatio', () => {
  it('black on white returns 21', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBe(21);
  });

  it('white on white returns 1', () => {
    const ratio = getContrastRatio('#ffffff', '#ffffff');
    expect(ratio).toBe(1);
  });

  it('ratio is the same regardless of order', () => {
    const ratio1 = getContrastRatio('#000000', '#ffffff');
    const ratio2 = getContrastRatio('#ffffff', '#000000');
    expect(ratio1).toBe(ratio2);
  });

  it('ratio is always between 1 and 21', () => {
    const ratio = getContrastRatio('#3a5afe', '#ffffff');
    expect(ratio).toBeGreaterThanOrEqual(1);
    expect(ratio).toBeLessThanOrEqual(21);
  });
});

describe('checkContrast', () => {
  it('black on white passes AA normal text', () => {
    const result = checkContrast({
      foreground: '#000000',
      background: '#ffffff',
      level: 'AA',
      textSize: 'normal',
    });
    expect(result.passes).toBe(true);
  });

  it('white on white fails AA normal text', () => {
    const result = checkContrast({
      foreground: '#ffffff',
      background: '#ffffff',
      level: 'AA',
      textSize: 'normal',
    });
    expect(result.passes).toBe(false);
  });

  it('returns correct required ratio for AA normal text', () => {
    const result = checkContrast({
      foreground: '#000000',
      background: '#ffffff',
      level: 'AA',
      textSize: 'normal',
    });
    expect(result.requiredRatio).toBe(4.5);
  });

  it('returns correct required ratio for AA large text', () => {
    const result = checkContrast({
      foreground: '#000000',
      background: '#ffffff',
      level: 'AA',
      textSize: 'large',
    });
    expect(result.requiredRatio).toBe(3.0);
  });

  it('returns correct required ratio for AAA normal text', () => {
    const result = checkContrast({
      foreground: '#000000',
      background: '#ffffff',
      level: 'AAA',
      textSize: 'normal',
    });
    expect(result.requiredRatio).toBe(7.0);
  });

  it('defaults to AA normal text', () => {
    const result = checkContrast({
      foreground: '#000000',
      background: '#ffffff',
    });
    expect(result.level).toBe('AA');
    expect(result.textSize).toBe('normal');
    expect(result.requiredRatio).toBe(4.5);
  });
});

describe('checkPaletteContrast', () => {
  const bluePalette = generatePalette({ name: 'blue', hue: 210 });

  it('returns a result for every shade', () => {
    const results = checkPaletteContrast({
      shades: bluePalette.shades,
      background: '#ffffff',
    });
    expect(results).toHaveLength(11);
  });

  it('passing shades have null suggestion', () => {
    const results = checkPaletteContrast({
      shades: bluePalette.shades,
      background: '#ffffff',
    });
    results
      .filter(r => r.contrast.passes)
      .forEach(r => {
        expect(r.suggestion).toBeNull();
      });
  });

  it('shade 11 passes AA on white background', () => {
    const results = checkPaletteContrast({
      shades: bluePalette.shades,
      background: '#ffffff',
      level: 'AA',
    });
    const shade11 = results.find(r => r.shade === 11);
    expect(shade11?.contrast.passes).toBe(true);
  });

  it('shade 1 fails AA on white background', () => {
    const results = checkPaletteContrast({
      shades: bluePalette.shades,
      background: '#ffffff',
      level: 'AA',
    });
    const shade1 = results.find(r => r.shade === 1);
    expect(shade1?.contrast.passes).toBe(false);
  });
});