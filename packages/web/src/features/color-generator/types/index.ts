import type { SemanticTokenSet, WCAGLevel } from '@foundry-ds/core';

export interface ColorGeneratorState {
  accentColor: string;
  wcagLevel: WCAGLevel;
  tokens: SemanticTokenSet | null;
  css: string | null;
  isGenerating: boolean;
  error: string | null;
}

export type OutputTab = 'palette' | 'tokens' | 'css' | 'tailwind';
