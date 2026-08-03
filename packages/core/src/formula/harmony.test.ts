import { describe, it, expect } from 'vitest';
import {
  applyHarmony,
  generateHarmoniousHues,
} from './harmony';

describe('applyHarmony', () => {
  it('returns base hue when strength is 0', () => {
    const result = applyHarmony(142, { accentHue: 262, strength: 0 });
    expect(result).toBe(142);
  });

  it('shifts hue toward accent', () => {
    // Success (142°) with purple accent (262°) should shift toward purple
    const result = applyHarmony(142, { accentHue: 262, strength: 0.1 });
    expect(result).toBeGreaterThan(142);
  });

  it('never shifts more than 15 degrees', () => {
    // Even with max strength, shift is capped at 15°
    const result = applyHarmony(142, { accentHue: 262, strength: 0.3 });
    expect(Math.abs(result - 142)).toBeLessThanOrEqual(15);
  });

  it('handles hue wraparound correctly', () => {
    // Red (4°) with teal accent (180°) — crosses the 0/360 boundary
    const result = applyHarmony(4, { accentHue: 180, strength: 0.1 });
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(360);
  });

  it('clamps strength above 0.3', () => {
    const withClamped = applyHarmony(142, { accentHue: 262, strength: 1.0 });
    const withMax = applyHarmony(142, { accentHue: 262, strength: 0.3 });
    expect(withClamped).toBe(withMax);
  });

  it('works with default strength of 0.1', () => {
    const result = applyHarmony(142, { accentHue: 262 });
    expect(result).not.toBe(142);
  });
});

describe('generateHarmoniousHues', () => {
  const hues = generateHarmoniousHues({ accentHue: 262, strength: 0.1 });

  it('returns all semantic color families', () => {
    expect(hues.success).toBeDefined();
    expect(hues.warning).toBeDefined();
    expect(hues.error).toBeDefined();
    expect(hues.info).toBeDefined();
    expect(hues.neutral).toBeDefined();
  });

  it('all hues are in valid 0-360 range', () => {
    Object.values(hues).forEach(hue => {
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThanOrEqual(360);
    });
  });

  it('success stays in green range (100-170°)', () => {
    expect(hues.success).toBeGreaterThan(100);
    expect(hues.success).toBeLessThan(170);
  });

  it('error stays in red range (345-20°)', () => {
    // Red wraps around 0°, so check it stays near 0
    const isNearRed = hues.error <= 20 || hues.error >= 345;
    expect(isNearRed).toBe(true);
  });

  it('warning stays in amber range (30-65°)', () => {
    expect(hues.warning).toBeGreaterThan(30);
    expect(hues.warning).toBeLessThan(65);
  });

  it('different accent colors produce different hues', () => {
    const purpleHues = generateHarmoniousHues({ accentHue: 262 });
    const orangeHues = generateHarmoniousHues({ accentHue: 30 });
    expect(purpleHues.success).not.toBe(orangeHues.success);
  });

  it('same accent color always produces same hues', () => {
    const first = generateHarmoniousHues({ accentHue: 262 });
    const second = generateHarmoniousHues({ accentHue: 262 });
    expect(first.success).toBe(second.success);
  });
});