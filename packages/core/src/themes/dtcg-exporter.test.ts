/**
 * DTCG Exporter tests
 *
 * The exporter's contract: valid DTCG structure ($type/$value on every
 * leaf), stable token paths across themes, valid hex values, and
 * lossless JSON round-tripping.
 */

import { describe, it, expect } from 'vitest';
import { generateSemanticTokens } from '../semantic/tokens';
import {
  tokensToDTCG,
  exportDTCG,
  exportDTCGThemes,
  type DTCGGroup,
  type DTCGToken,
} from './dtcg-exporter';

const tokens = generateSemanticTokens({ accentColor: '#3a5afe' });

const isToken = (node: unknown): node is DTCGToken =>
  typeof node === 'object' && node !== null && '$value' in (node as object);

/** Walk every leaf token in a DTCG group. */
const walkTokens = (
  group: DTCGGroup,
  visit: (t: DTCGToken, path: string) => void,
  path = ''
) => {
  for (const [key, node] of Object.entries(group)) {
    if (key.startsWith('$') || node === undefined || typeof node === 'string') continue;
    if (isToken(node)) visit(node, `${path}${key}`);
    else walkTokens(node as DTCGGroup, visit, `${path}${key}.`);
  }
};

describe('tokensToDTCG', () => {
  it('wraps everything in a color group with group-level $type', () => {
    const doc = tokensToDTCG(tokens);
    expect(doc.color).toBeDefined();
    expect((doc.color as DTCGGroup).$type).toBe('color');
  });

  it('contains all five action colors and neutral', () => {
    const color = tokensToDTCG(tokens).color as DTCGGroup;
    for (const name of ['primary', 'success', 'warning', 'error', 'info', 'neutral']) {
      expect(color[name]).toBeDefined();
    }
  });

  it('every leaf carries $type color and a $value', () => {
    let count = 0;
    walkTokens(tokensToDTCG(tokens), (t) => {
      count++;
      expect(t.$type).toBe('color');
      expect(typeof t.$value).toBe('string');
    });
    expect(count).toBeGreaterThan(50);
  });

  it('every $value is a valid hex color', () => {
    walkTokens(tokensToDTCG(tokens), (t) => {
      expect(t.$value).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('every leaf carries a $description — intent is part of the contract', () => {
    walkTokens(tokensToDTCG(tokens), (t) => {
      expect(t.$description).toBeTruthy();
    });
  });

  it('excludes raw palettes by default and includes them on request', () => {
    const bare = tokensToDTCG(tokens).color as DTCGGroup;
    expect(bare.palette).toBeUndefined();

    const full = tokensToDTCG(tokens, { includePalettes: true }).color as DTCGGroup;
    const palette = full.palette as DTCGGroup;
    expect(palette).toBeDefined();
    expect(Object.keys(palette.primary as DTCGGroup).length).toBe(11);
  });
});

describe('exportDTCG', () => {
  it('round-trips through JSON without loss', () => {
    const parsed = JSON.parse(exportDTCG(tokens)) as DTCGGroup;
    expect(parsed).toEqual(tokensToDTCG(tokens));
  });

  it('primary.fill in the document equals the generated token', () => {
    const parsed = JSON.parse(exportDTCG(tokens)) as {
      color: { primary: { fill: DTCGToken } };
    };
    expect(parsed.color.primary.fill.$value).toBe(tokens.primary.fill);
  });
});

describe('exportDTCGThemes', () => {
  const dark = generateSemanticTokens({ accentColor: '#5b7aff' });

  it('produces two parseable documents', () => {
    const themes = exportDTCGThemes(tokens, dark);
    expect(() => JSON.parse(themes.light)).not.toThrow();
    expect(() => JSON.parse(themes.dark)).not.toThrow();
  });

  it('token paths are identical across themes — only values differ', () => {
    const themes = exportDTCGThemes(tokens, dark);
    const paths = (doc: string) => {
      const list: string[] = [];
      walkTokens(JSON.parse(doc) as DTCGGroup, (_t, p) => list.push(p));
      return list.sort();
    };
    expect(paths(themes.light)).toEqual(paths(themes.dark));
  });
});
