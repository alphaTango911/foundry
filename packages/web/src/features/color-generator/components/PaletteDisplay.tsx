import { useState } from 'react';
import { useColorGeneratorStore } from '@/store/colorGenerator';
import { checkContrast, type ColorShade } from '@foundry/core';

const COLOR_FAMILIES = [
  'primary',
  'success',
  'warning',
  'error',
  'info',
] as const;

type PreviewMode = 'light' | 'dark';

const PREVIEW_BACKGROUNDS: Record<PreviewMode, string> = {
  light: '#ffffff',
  dark: '#0f172a',
};

const ContrastBadge = ({
  hex,
  background,
}: {
  hex: string;
  background: string;
}) => {
  const { wcagLevel } = useColorGeneratorStore();

  const result = checkContrast({
    foreground: hex,
    background,
    level: wcagLevel,
  });

  return (
    <span
      className={`text-[10px] font-mono ${
        result.passes ? 'text-green-500' : 'text-red-400'
      }`}
      title={`${result.ratio}:1 — ${result.passes ? `passes ${wcagLevel}` : `fails ${wcagLevel}`}`}
    >
      {result.ratio}:1
    </span>
  );
};

const ColorSwatch = ({
  shade,
  hex,
  name,
  background,
}: {
  shade: number;
  hex: string;
  name: string;
  background: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="flex flex-col items-center gap-1 flex-1 cursor-pointer group"
      onClick={handleClick}
      title={`${name}-${shade}: ${hex} — click to copy`}
    >
      <div
        className="w-full h-20 rounded transition-transform group-hover:scale-105 relative overflow-hidden"
        style={{ backgroundColor: hex }}
      >
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="text-white text-[10px] font-semibold">✓</span>
          </div>
        )}
      </div>
      <span className="text-[11px] font-mono text-muted-foreground truncate w-full text-center">
        {hex}
      </span>
      <ContrastBadge hex={hex} background={background} />
    </div>
  );
};

const PaletteRow = ({
  name,
  shades,
  baseHex,
  background,
}: {
  name: string;
  shades: ColorShade[];
  baseHex: string;
  background: string;
}) => {
  const [rowCopied, setRowCopied] = useState(false);

  const copyRow = async () => {
    const values = shades.map(s => s.hex).join(', ');
    await navigator.clipboard.writeText(values);
    setRowCopied(true);
    setTimeout(() => setRowCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 shrink-0">
        <button
          onClick={copyRow}
          className="text-left group/label"
          title={`Copy all ${name} hex values`}
        >
          <p className="text-base font-semibold capitalize text-foreground group-hover/label:text-primary transition-colors">
            {rowCopied ? '✓ Copied!' : name}
          </p>
          <p className="text-[10px] font-mono text-muted-foreground truncate">
            {baseHex}
          </p>
        </button>
      </div>

      <div className="flex gap-1 flex-1">
        {shades.map((s) => (
          <ColorSwatch
            key={s.shade}
            shade={s.shade}
            hex={s.hex}
            name={name}
            background={background}
          />
        ))}
      </div>
    </div>
  );
};

export const PaletteDisplay = () => {
  const { tokens } = useColorGeneratorStore();
  const [previewMode, setPreviewMode] = useState<PreviewMode>('light');

  const background = PREVIEW_BACKGROUNDS[previewMode];

  if (!tokens) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl">🎨</span>
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Pick a color and click Generate
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header with preview toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Color palette</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Numbers show WCAG contrast ratio. Click swatch to copy hex.
            Click name to copy all.
          </p>
        </div>

        {/* Light / Dark toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setPreviewMode('light')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              previewMode === 'light'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ☀️ Light
          </button>
          <button
            onClick={() => setPreviewMode('dark')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              previewMode === 'dark'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🌙 Dark
          </button>
        </div>
      </div>

      {/* Background preview strip */}
      <div
        className="rounded-lg p-4 transition-colors duration-300"
        style={{ backgroundColor: background }}
      >
        {/* Shade numbers */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 shrink-0" />
          <div className="flex gap-1 flex-1">
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} className="flex-1 text-center">
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: previewMode === 'light' ? '#94a3b8' : '#475569',
                  }}
                >
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Color rows */}
        <div className="flex flex-col gap-6">
          {COLOR_FAMILIES.map((family) => (
            <PaletteRow
              key={family}
              name={family}
              shades={tokens[family].palette.shades}
              baseHex={tokens[family].fill}
              background={background}
            />
          ))}

          <PaletteRow
            name="neutral"
            shades={tokens.neutral.palette.shades}
            baseHex={tokens.neutral.text}
            background={background}
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        Click any swatch to copy hex · Click color name to copy all 11 values
      </p>
    </div>
  );
};