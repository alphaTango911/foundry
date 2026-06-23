import { describe, it, expect } from 'vitest';
import { generateSemanticTokens } from './tokens';

describe('generateSemanticTokens', () => {
  const tokens = generateSemanticTokens({ accentColor: '#3a5afe' });

  it('generates all 6 semantic token groups', () => {
    expect(tokens.primary).toBeDefined();
    expect(tokens.success).toBeDefined();
    expect(tokens.warning).toBeDefined();
    expect(tokens.error).toBeDefined();
    expect(tokens.info).toBeDefined();
    expect(tokens.neutral).toBeDefined();
  });

  it('action tokens have all required variants', () => {
    const actionGroups = [
      tokens.primary,
      tokens.success,
      tokens.warning,
      tokens.error,
      tokens.info,
    ];
    actionGroups.forEach(group => {
      expect(group.bg).toBeDefined();
      expect(group.bgHover).toBeDefined();
      expect(group.border).toBeDefined();
      expect(group.borderHover).toBeDefined();
      expect(group.fill).toBeDefined();
      expect(group.fillHover).toBeDefined();
      expect(group.fillActive).toBeDefined();
      expect(group.text).toBeDefined();
      expect(group.textHover).toBeDefined();
      expect(group.textActive).toBeDefined();
      expect(group.contrastText).toBeDefined();
    });
  });

  it('neutral has foundation scale structure', () => {
    expect(tokens.neutral.background).toBeDefined();
    expect(tokens.neutral.surface).toBeDefined();
    expect(tokens.neutral.surfaceHover).toBeDefined();
    expect(tokens.neutral.border).toBeDefined();
    expect(tokens.neutral.borderStrong).toBeDefined();
    expect(tokens.neutral.textMuted).toBeDefined();
    expect(tokens.neutral.text).toBeDefined();
    expect(tokens.neutral.textStrong).toBeDefined();
  });

  it('every hex value is a valid hex color', () => {
    const hexPattern = /^#[0-9a-f]{6}$/;
    const actionGroups = [
      tokens.primary,
      tokens.success,
      tokens.warning,
      tokens.error,
      tokens.info,
    ];
    actionGroups.forEach(group => {
      const { palette: _, ...hexValues } = group;
      Object.values(hexValues).forEach(value => {
        expect(value).toMatch(hexPattern);
      });
    });
  });

  it('contrastText is either white or black', () => {
    const actionGroups = [
      tokens.primary,
      tokens.success,
      tokens.warning,
      tokens.error,
      tokens.info,
    ];
    actionGroups.forEach(group => {
      expect(['#ffffff', '#000000']).toContain(group.contrastText);
    });
  });

  it('warning contrastText is either white or black', () => {
  expect(['#ffffff', '#000000']).toContain(tokens.warning.contrastText);
});

  it('text is darker than fill', () => {
    const actionGroups = [
      tokens.primary,
      tokens.success,
      tokens.warning,
      tokens.error,
      tokens.info,
    ];
    actionGroups.forEach(group => {
      const fillShade = group.palette.shades.find(s => s.hex === group.fill);
      const textShade = group.palette.shades.find(s => s.hex === group.text);
      expect(textShade?.hsl.l).toBeLessThan(fillShade?.hsl.l ?? 100);
    });
  });

  it('bg is lighter than fill', () => {
    const actionGroups = [
      tokens.primary,
      tokens.success,
      tokens.warning,
      tokens.error,
      tokens.info,
    ];
    actionGroups.forEach(group => {
      const bgShade = group.palette.shades.find(s => s.hex === group.bg);
      const fillShade = group.palette.shades.find(s => s.hex === group.fill);
      expect(bgShade?.hsl.l).toBeGreaterThan(fillShade?.hsl.l ?? 0);
    });
  });

  it('success, warning, error use fixed hues regardless of accent', () => {
    const tokens1 = generateSemanticTokens({ accentColor: '#3a5afe' });
    const tokens2 = generateSemanticTokens({ accentColor: '#ff0000' });
    expect(tokens1.success.fill).toBe(tokens2.success.fill);
    expect(tokens1.warning.fill).toBe(tokens2.warning.fill);
    expect(tokens1.error.fill).toBe(tokens2.error.fill);
  });

  it('primary changes when accent color changes', () => {
    const tokens1 = generateSemanticTokens({ accentColor: '#3a5afe' });
    const tokens2 = generateSemanticTokens({ accentColor: '#ff0000' });
    expect(tokens1.primary.fill).not.toBe(tokens2.primary.fill);
  });

  it('neutral textStrong is darker than textMuted', () => {
    const mutedShade = tokens.neutral.palette.shades.find(
      s => s.hex === tokens.neutral.textMuted
    );
    const strongShade = tokens.neutral.palette.shades.find(
      s => s.hex === tokens.neutral.textStrong
    );
    expect(strongShade?.hsl.l).toBeLessThan(mutedShade?.hsl.l ?? 100);
  });

  it('neutral has very low saturation', () => {
    const baseShade = tokens.neutral.palette.shades.find(
      s => s.hex === tokens.neutral.text
    );
    expect(baseShade?.hsl.s).toBeLessThan(20);
  });

  it('throws on invalid accent color', () => {
    expect(() =>
      generateSemanticTokens({ accentColor: 'not-a-color' })
    ).toThrow();
  });

  it('throws on empty accent color', () => {
    expect(() =>
      generateSemanticTokens({ accentColor: '' })
    ).toThrow();
  });

  it('accepts 3-digit hex', () => {
    expect(() =>
      generateSemanticTokens({ accentColor: '#fff' })
    ).not.toThrow();
  });

  it('accepts hex without hash', () => {
    expect(() =>
      generateSemanticTokens({ accentColor: '3a5afe' })
    ).not.toThrow();
  });
});