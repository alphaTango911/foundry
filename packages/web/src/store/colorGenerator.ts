import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  generateSemanticTokens,
  generateThemeCSS,
  validateHex,
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

          const tokens: SemanticTokenSet = generateSemanticTokens({
            accentColor: validation.value ?? accentColor,
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
            error: err instanceof Error
              ? err.message
              : 'Something went wrong',
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
      partialize: (state) => ({
        accentColor: state.accentColor,
        wcagLevel: state.wcagLevel,
      }),
    }
  )
);