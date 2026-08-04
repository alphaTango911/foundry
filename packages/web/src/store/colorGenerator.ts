import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  generateSemanticTokens,
  generateThemeCSS,
  validateHex,
  hexToHsl,
  type SemanticTokenSet,
  type WCAGLevel,
} from '@foundry/core';

interface ColorGeneratorStore {
  accentColor: string;
  wcagLevel: WCAGLevel;
  tokens: SemanticTokenSet | null;
  lightCSS: string | null;
  darkCSS: string | null;
  combinedCSS: string | null;
  isGenerating: boolean;
  error: string | null;
  setAccentColor: (color: string) => void;
  setWcagLevel: (level: WCAGLevel) => void;
  generate: () => void;
  reset: () => void;
}

/**
 * Checks if a color is achromatic (black, white, or gray).
 * Achromatic colors have saturation near 0 — no meaningful hue.
 * The engine would extract hue 0° (red) which is misleading.
 */
const isAchromatic = (hex: string): boolean => {
  const { s } = hexToHsl(hex);
  return s < 10;
};

export const useColorGeneratorStore = create<ColorGeneratorStore>()(
  persist(
    (set, get) => ({
      accentColor: '#3a5afe',
      wcagLevel: 'AA',
      tokens: null,
      lightCSS: null,
      darkCSS: null,
      combinedCSS: null,
      isGenerating: false,
      error: null,

      setAccentColor: (color: string) => {
        set({ accentColor: color, error: null });

        // Auto-generate on every valid color change (live update)
        const validation = validateHex(color);
        if (!validation.valid) return;

        const cleanHex = validation.value ?? color;

        // Warn user if color has no meaningful hue
        if (isAchromatic(cleanHex)) {
          set({
            error: '⚠️ This color has no hue (black, white, or gray). Try a color with some saturation for a meaningful palette.',
          });
          return;
        }

        try {
          const tokens: SemanticTokenSet = generateSemanticTokens({
            accentColor: cleanHex,
          });
          const { light, dark, combined } = generateThemeCSS(tokens);
          set({
            tokens,
            lightCSS: light,
            darkCSS: dark,
            combinedCSS: combined,
            error: null,
          });
        } catch {
          // Silent fail during live drag — don't interrupt the user
        }
      },

      setWcagLevel: (level: WCAGLevel) => {
        set({ wcagLevel: level });
      },

      generate: () => {
        const { accentColor } = get();
        set({ isGenerating: true, error: null });

        try {
          const validation = validateHex(accentColor);
          if (!validation.valid) {
            set({
              isGenerating: false,
              error: validation.error ?? 'Invalid color',
            });
            return;
          }

          const cleanHex = validation.value ?? accentColor;

          if (isAchromatic(cleanHex)) {
            set({
              isGenerating: false,
              error: '⚠️ This color has no hue. Try a color with some saturation for a meaningful palette.',
            });
            return;
          }

          const tokens: SemanticTokenSet = generateSemanticTokens({
            accentColor: cleanHex,
          });
          const { light, dark, combined } = generateThemeCSS(tokens);

          set({
            tokens,
            lightCSS: light,
            darkCSS: dark,
            combinedCSS: combined,
            isGenerating: false,
            error: null,
          });
        } catch (err) {
          set({
            isGenerating: false,
            error: err instanceof Error ? err.message : 'Something went wrong',
          });
        }
      },

      reset: () => {
        set({
          accentColor: '#3a5afe',
          wcagLevel: 'AA',
          tokens: null,
          lightCSS: null,
          darkCSS: null,
          combinedCSS: null,
          isGenerating: false,
          error: null,
        });
      },
    }),
    {
      name: 'foundry-color-generator',
      version: 1,
      partialize: (state) => ({
        accentColor: state.accentColor,
        wcagLevel: state.wcagLevel,
      }),
    }
  )
);