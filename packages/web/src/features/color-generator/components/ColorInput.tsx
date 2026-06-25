import { HexColorPicker } from 'react-colorful';
import { useColorGeneratorStore } from '@/store/colorGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { validateHex } from '@foundry/core';

export const ColorInput = () => {
  const {
    accentColor,
    wcagLevel,
    isGenerating,
    error,
    setAccentColor,
    setWcagLevel,
    generate,
  } = useColorGeneratorStore();

  const hexValidation = validateHex(accentColor);
  const isValidHex = hexValidation.valid;

  return (
    <div className="flex flex-col gap-6">
      <div>
  <h1 className="text-2xl font-semibold tracking-tight">Foundry</h1>
  <p className="text-sm text-muted-foreground mt-1">
    Pick an accent color. Get a complete, accessible color token
    system — light mode, dark mode, and WCAG checked.
  </p>
</div>

      <div className="flex flex-col gap-3">
        <Label>Accent color</Label>
        <div className="rounded-lg overflow-hidden border">
          <HexColorPicker
            color={isValidHex ? (hexValidation.value ?? accentColor) : '#3a5afe'}
            onChange={setAccentColor}
            style={{ width: '100%', height: '200px' }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="hex-input">Hex value</Label>
        <Input
          id="hex-input"
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
          placeholder="#3a5afe"
          className={
            !isValidHex && accentColor !== ''
              ? 'border-destructive'
              : ''
          }
        />
        {!isValidHex && accentColor !== '' && (
          <p className="text-xs text-destructive">{hexValidation.error}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Accessibility target</Label>
        <Select
          value={wcagLevel}
          onValueChange={(value) => setWcagLevel(value as 'AA' | 'AAA')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AA">AA — minimum (4.5:1 ratio)</SelectItem>
            <SelectItem value="AAA">AAA — enhanced (7:1 ratio)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          WCAG AA is required by law in many countries.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          {error}
        </p>
      )}

      <Button
        onClick={generate}
        disabled={!isValidHex || isGenerating}
        size="lg"
        className="w-full"
      >
        {isGenerating ? 'Generating...' : 'Generate design system'}
      </Button>
    </div>
  );
};