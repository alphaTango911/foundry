import { useColorGeneratorStore } from '@/store/colorGenerator';
import { Badge } from '@/components/ui/badge';
import { checkContrast } from '@foundry/core';

const COLOR_FAMILIES = [
  'primary',
  'success',
  'warning',
  'error',
  'info',
] as const;

const ContrastBadge = ({ hex }: { hex: string }) => {
  const result = checkContrast({
    foreground: hex,
    background: '#ffffff',
    level: 'AA',
  });

  return (
    <Badge
      variant={result.passes ? 'default' : 'destructive'}
      className="text-[10px] px-1 py-0"
    >
      {result.ratio}:1
    </Badge>
  );
};

const ShadeRow = ({
  name,
  shades,
}: {
  name: string;
  shades: Array<{ shade: number; hex: string }>;
}) => (
  <div className="flex flex-col gap-1">
    <p className="text-xs font-medium text-muted-foreground capitalize">
      {name}
    </p>
    <div className="flex gap-1">
      {shades.map((s) => (
        <div key={s.shade} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full h-10 rounded-md border border-black/5"
            style={{ backgroundColor: s.hex }}
            title={`${name}-${s.shade}: ${s.hex}`}
          />
          <span className="text-[9px] text-muted-foreground">{s.shade}</span>
        </div>
      ))}
    </div>
  </div>
);

export const PaletteDisplay = () => {
  const { tokens } = useColorGeneratorStore();

  if (!tokens) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Generate a palette to see it here
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Color palette</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Badges show WCAG contrast ratio against white.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {COLOR_FAMILIES.map((family) => (
          <ShadeRow
            key={family}
            name={family}
            shades={tokens[family].palette.shades.map((s) => ({
              shade: s.shade,
              hex: s.hex,
            }))}
          />
        ))}
        <ShadeRow
          name="neutral"
          shades={tokens.neutral.palette.shades.map((s) => ({
            shade: s.shade,
            hex: s.hex,
          }))}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Semantic tokens</h3>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_FAMILIES.map((family) => {
            const token = tokens[family];
            return (
              <div
                key={family}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                <div
                  className="w-8 h-8 rounded-md flex-shrink-0"
                  style={{ backgroundColor: token.fill }}
                />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-medium capitalize">
                    {family}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono truncate">
                    {token.fill}
                  </span>
                  <ContrastBadge hex={token.fill} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};