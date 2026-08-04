import { useColorGeneratorStore } from '@/store/colorGenerator';
import { checkContrast, type ColorShade } from '@foundry/core';

const COLOR_FAMILIES = [
  'primary',
  'success',
  'warning',
  'error',
  'info',
] as const;

const ContrastBadge = ({ hex }: { hex: string }) => {
  const { wcagLevel } = useColorGeneratorStore();
  const result = checkContrast({
    foreground: hex,
    background: '#ffffff',
    level: wcagLevel,
  });

  return (
    <span
      className={`text-xs font-mono ${
        result.passes ? 'text-green-600' : 'text-red-500'
      }`}
      title={result.passes ? `Passes ${wcagLevel}` : `Fails ${wcagLevel}`}
      aria-label={`Contrast ratio ${result.ratio}:1 — ${result.passes ? 'passes' : 'fails'} WCAG ${wcagLevel}`}
    >
      {result.ratio}:1
    </span>
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
}) => (
  <div className="flex items-center gap-3">
    {/* Label */}
    <div className="w-24 shrink-0">
      <p className="text-lg font-medium capitalize text-foreground">{name}</p>
      <p className="text-[16px] font-mono text-muted-foreground truncate">
        {baseHex}
      </p>
    </div>

    {/* Swatches */}
    <div className="flex gap-1 flex-1">
      {shades.map((s) => (
        <div
          key={s.shade}
          className="flex flex-col items-center gap-0.5 flex-1"
        >
          <div
            className="w-full h-24 rounded cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: s.hex }}
            title={`${name}-${s.shade}: ${s.hex} — click to copy`}
            onClick={() => navigator.clipboard.writeText(s.hex)}
          />
          <ContrastBadge hex={s.hex} />
        </div>
      ))}
    </div>
  </div>
);

export const PaletteDisplay = () => {
  const { tokens } = useColorGeneratorStore();

  if (!tokens) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl">🎨</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Pick a color and click Generate
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Shade numbers header */}
      <div className="flex items-center gap-3">
        <div className="w-24 shrink-0" />
        <div className="flex gap-1 flex-1">
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-lg text-muted-foreground">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action color families */}
      {COLOR_FAMILIES.map((family) => (
        <PaletteRow
          key={family}
          name={family}
          shades={tokens[family].palette.shades}
          baseHex={tokens[family].fill}
        />
      ))}

      {/* Neutral */}
      <PaletteRow
        name="neutral"
        shades={tokens.neutral.palette.shades}
        baseHex={tokens.neutral.text}
      />

      {/* Click to copy hint */}
      <p className="text-[16px] text-muted-foreground text-center mt-2">
        Click any swatch to copy its hex value
      </p>
    </div>
  );
};