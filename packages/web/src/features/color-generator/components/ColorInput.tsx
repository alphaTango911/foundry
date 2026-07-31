import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';
import { useColorGeneratorStore } from '@/store/colorGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

  const [pickerOpen, setPickerOpen] = useState(false);
  const hexValidation = validateHex(accentColor);
  const isValidHex = hexValidation.valid;

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Brand */}
      <span className="font-semibold text-base shrink-0">Foundry</span>

      <div className="w-px h-5 bg-border shrink-0" />

      {/* Color picker popover */}
      <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
        <PopoverTrigger>
  <div
    className="w-8 h-8 rounded-md border border-border shrink-0 cursor-pointer"
    style={{
      backgroundColor: isValidHex
        ? (hexValidation.value ?? accentColor)
        : '#3a5afe',
    }}
    aria-label="Open color picker"
  />
</PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <HexColorPicker
            color={isValidHex ? (hexValidation.value ?? accentColor) : '#3a5afe'}
            onChange={setAccentColor}
          />
        </PopoverContent>
      </Popover>

      {/* Hex input */}
      <Input
        value={accentColor}
        onChange={(e) => setAccentColor(e.target.value)}
        placeholder="#3a5afe"
        className={`w-32 font-mono text-lg ${
          !isValidHex && accentColor !== '' ? 'border-destructive' : ''
        }`}
      />

      {/* WCAG selector */}
      <Select
        value={wcagLevel}
        onValueChange={(value) => setWcagLevel(value as 'AA' | 'AAA')}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AA">WCAG AA</SelectItem>
          <SelectItem value="AAA">WCAG AAA</SelectItem>
        </SelectContent>
      </Select>

      {/* Generate button */}
      <Button
        onClick={generate}
        disabled={!isValidHex || isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>

      {/* Error */}
      {error && (
        <p className="text-lg text-destructive shrink-0">{error}</p>
      )}
    </div>
  );
};