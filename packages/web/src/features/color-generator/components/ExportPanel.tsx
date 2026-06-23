import { useState } from 'react';
import { saveAs } from 'file-saver';
import { useColorGeneratorStore } from '@/store/colorGenerator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  );
};

const CodeBlock = ({ code }: { code: string }) => (
  <ScrollArea className="h-64 w-full rounded-md border">
    <pre className="p-4 text-xs font-mono whitespace-pre">{code}</pre>
  </ScrollArea>
);

export const ExportPanel = () => {
  const { tokens, combinedCSS, accentColor } = useColorGeneratorStore();

  if (!tokens) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Generate a palette to export it
      </div>
    );
  }

  const tailwindConfig = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '${tokens.primary.bg}',
          border: '${tokens.primary.border}',
          fill: '${tokens.primary.fill}',
          text: '${tokens.primary.text}',
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
      metadata: {
        generatedBy: 'Foundry',
        accentColor,
        timestamp: new Date().toISOString(),
      },
      tokens: {
        primary: {
          bg: tokens.primary.bg,
          border: tokens.primary.border,
          fill: tokens.primary.fill,
          text: tokens.primary.text,
          contrastText: tokens.primary.contrastText,
        },
        success: { fill: tokens.success.fill, text: tokens.success.text },
        warning: { fill: tokens.warning.fill, text: tokens.warning.text },
        error: { fill: tokens.error.fill, text: tokens.error.text },
        neutral: {
          background: tokens.neutral.background,
          surface: tokens.neutral.surface,
          border: tokens.neutral.border,
          text: tokens.neutral.text,
          textStrong: tokens.neutral.textStrong,
          textMuted: tokens.neutral.textMuted,
        },
      },
    },
    null,
    2
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Export</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Copy or download your tokens in any format.
        </p>
      </div>

      <Tabs defaultValue="css">
        <TabsList className="w-full">
          <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
          <TabsTrigger value="tailwind" className="flex-1">Tailwind</TabsTrigger>
          <TabsTrigger value="json" className="flex-1">JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="css" className="flex flex-col gap-2 mt-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              CSS custom properties for light + dark mode
            </p>
            <div className="flex gap-2">
              <CopyButton text={combinedCSS ?? ''} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([combinedCSS ?? ''], { type: 'text/css' });
                  saveAs(blob, 'foundry-tokens.css');
                }}
              >
                Download
              </Button>
            </div>
          </div>
          <CodeBlock code={combinedCSS ?? ''} />
        </TabsContent>

        <TabsContent value="tailwind" className="flex flex-col gap-2 mt-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Tailwind config extension</p>
            <CopyButton text={tailwindConfig} />
          </div>
          <CodeBlock code={tailwindConfig} />
        </TabsContent>

        <TabsContent value="json" className="flex flex-col gap-2 mt-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Design tokens in JSON</p>
            <div className="flex gap-2">
              <CopyButton text={tokensJson} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([tokensJson], { type: 'application/json' });
                  saveAs(blob, 'foundry-tokens.json');
                }}
              >
                Download
              </Button>
            </div>
          </div>
          <CodeBlock code={tokensJson} />
        </TabsContent>
      </Tabs>
    </div>
  );
};