import { describe, it, expect } from 'vitest';
import { validateHex, validateHue, validateSaturation } from './validation';

describe('validateHex', () => {
  it('accepts valid 6-digit hex with hash', () => {
    const result = validateHex('#3a5afe');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('#3a5afe');
  });

  it('accepts valid 6-digit hex without hash', () => {
    const result = validateHex('3a5afe');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('#3a5afe');
  });

  it('accepts 3-digit hex and expands it', () => {
    const result = validateHex('#fff');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('#ffffff');
  });

  it('accepts uppercase hex and lowercases it', () => {
    const result = validateHex('#FF0000');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('#ff0000');
  });

  it('rejects non-string input', () => {
    const result = validateHex(123);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects null', () => {
    const result = validateHex(null);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects empty string', () => {
    const result = validateHex('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects color names like blue', () => {
    const result = validateHex('blue');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects invalid hex characters', () => {
    const result = validateHex('#zzzzzz');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects too-short hex', () => {
    const result = validateHex('#12');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('validateHue', () => {
  it('accepts 0', () => {
    expect(validateHue(0).valid).toBe(true);
  });

  it('accepts 360', () => {
    expect(validateHue(360).valid).toBe(true);
  });

  it('accepts values outside 0-360', () => {
    expect(validateHue(400).valid).toBe(true);
  });

  it('accepts negative values', () => {
    expect(validateHue(-10).valid).toBe(true);
  });

  it('rejects NaN', () => {
    const result = validateHue(NaN);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects Infinity', () => {
    const result = validateHue(Infinity);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects string input', () => {
    const result = validateHue('210');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('validateSaturation', () => {
  it('accepts 0', () => {
    expect(validateSaturation(0).valid).toBe(true);
  });

  it('accepts 100', () => {
    expect(validateSaturation(100).valid).toBe(true);
  });

  it('clamps values above 100', () => {
    const result = validateSaturation(150);
    expect(result.valid).toBe(true);
    expect(result.value).toBe('100');
  });

  it('clamps values below 0', () => {
    const result = validateSaturation(-20);
    expect(result.valid).toBe(true);
    expect(result.value).toBe('0');
  });

  it('rejects NaN', () => {
    const result = validateSaturation(NaN);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects string input', () => {
    const result = validateSaturation('75');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});