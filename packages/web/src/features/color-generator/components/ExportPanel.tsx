import { useState } from 'react';
import { saveAs } from 'file-saver';
import { useColorGeneratorStore } from '@/store/colorGenerator';
import { Button } from '@/components/ui/button';

const useCopy = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return { copiedKey, copy };
};

export const ExportPanel = () => {
  const { tokens, combinedCSS, accentColor } = useColorGeneratorStore();
  const { copiedKey, copy } = useCopy();

  if (!tokens) {
    return (
      <div className="flex items-center gap-3 w-full opacity-40 pointer-events-none">
        <span className="text-lg text-muted-foreground shrink-0">Export</span>
        <div className="w-px h-4 bg-border shrink-0" />
        <Button variant="outline" size="lg" disabled>Copy CSS</Button>
        <Button variant="outline" size="lg" disabled>Copy Tailwind</Button>
        <Button variant="outline" size="lg" disabled>Copy JSON</Button>
        <div className="w-px h-4 bg-border shrink-0" />
        <Button variant="outline" size="lg" disabled>Download CSS</Button>
        <Button variant="outline" size="lg" disabled>Download JSON</Button>
      </div>
    );
  }

  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '${tokens.primary.bg}',
          border: '${tokens.primary.border}',
          fill: '${tokens.primary.fill}',
          text: '${tokens.primary.text}',
          'contrast-text': '${tokens.primary.contrastText}',
        },
        success: { fill: '${tokens.success.fill}', text: '${tokens.success.text}' },
        warning: { fill: '${tokens.warning.fill}', text: '${tokens.warning.text}' },
        error: { fill: '${tokens.error.fill}', text: '${tokens.error.text}' },
      },
    },
  },
};`;

  const tokensJson = JSON.stringify(
    {
      metadata: { generatedBy: 'Foundry', accentColor, timestamp: new Date().toISOString() },
      tokens: {
        primary: { bg: tokens.primary.bg, border: tokens.primary.border, fill: tokens.primary.fill, text: tokens.primary.text, contrastText: tokens.primary.contrastText },
        success: { fill: tokens.success.fill, text: tokens.success.text },
        warning: { fill: tokens.warning.fill, text: tokens.warning.text },
        error: { fill: tokens.error.fill, text: tokens.error.text },
        neutral: { background: tokens.neutral.background, surface: tokens.neutral.surface, border: tokens.neutral.border, text: tokens.neutral.text, textStrong: tokens.neutral.textStrong },
      },
    },
    null,
    2
  );

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-lg text-muted-foreground shrink-0">Export</span>

      <div className="w-px h-4 bg-border shrink-0" />

      <Button
        variant="outline"
        size="lg"
        onClick={() => copy(combinedCSS ?? '', 'css')}
      >
        {copiedKey === 'css' ? '✓ Copied' : 'Copy CSS'}
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => copy(tailwindConfig, 'tailwind')}
      >
        {copiedKey === 'tailwind' ? '✓ Copied' : 'Copy Tailwind'}
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => copy(tokensJson, 'json')}
      >
        {copiedKey === 'json' ? '✓ Copied' : 'Copy JSON'}
      </Button>

      <div className="w-px h-4 bg-border shrink-0" />

      <Button
        variant="outline"
        size="lg"
        onClick={() => {
          const blob = new Blob([combinedCSS ?? ''], { type: 'text/css' });
          saveAs(blob, 'foundry-tokens.css');
        }}
      >
        Download CSS
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => {
          const blob = new Blob([tokensJson], { type: 'application/json' });
          saveAs(blob, 'foundry-tokens.json');
        }}
      >
        Download JSON
      </Button>
    </div>
  );
};