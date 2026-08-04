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

const ContrastBadge = ({ hex, shade }: { hex: string; shade: number }) => {
  const { wcagLevel } = useColorGeneratorStore();
  const background = shade <= 6 ? '#ffffff' : '#000000';
  const bgLabel = shade <= 6 ? 'white' : 'black';

  const result = checkContrast({
    foreground: hex,
    background,
    level: wcagLevel,
  });

  return (
    <span
      className={`text-[10px] font-mono ${
        result.passes ? 'text-green-600' : 'text-red-500'
      }`}
      title={`${result.ratio}:1 on ${bgLabel} — ${result.passes ? `passes ${wcagLevel}` : `fails ${wcagLevel}`}`}
      aria-label={`Contrast ${result.ratio}:1 on ${bgLabel} ${result.passes ? 'passes' : 'fails'} WCAG ${wcagLevel}`}
    >
      {result.ratio}:1
    </span>
  );
};

const ColorSwatch = ({
  shade,
  hex,
  name,
}: {
  shade: number;
  hex: string;
  name: string;
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
      <ContrastBadge hex={hex} shade={shade} />
    </div>
  );
};

const PaletteRow = ({
  name,
  shades,
  baseHex,
}: {
  name: string;
  shades: ColorShade[];
  baseHex: string;
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
      {/* Label */}
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

      {/* Swatches */}
      <div className="flex gap-1 flex-1">
        {shades.map((s) => (
          <ColorSwatch
            key={s.shade}
            shade={s.shade}
            hex={s.hex}
            name={name}
          />
        ))}
      </div>
    </div>
  );
};

export const PaletteDisplay = () => {
  const { tokens } = useColorGeneratorStore();

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
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="w-24 shrink-0" />
        <div className="flex gap-1 flex-1">
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[10px] text-muted-foreground font-medium">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {COLOR_FAMILIES.map((family) => (
        <PaletteRow
          key={family}
          name={family}
          shades={tokens[family].palette.shades}
          baseHex={tokens[family].fill}
        />
      ))}

      <PaletteRow
        name="neutral"
        shades={tokens.neutral.palette.shades}
        baseHex={tokens.neutral.text}
      />

      <p className="text-[11px] text-muted-foreground text-center mt-1">
        Click any swatch to copy · Click color name to copy all
      </p>
    </div>
  );
};