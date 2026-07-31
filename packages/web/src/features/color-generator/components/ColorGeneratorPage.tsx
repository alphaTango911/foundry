import { ColorInput } from "./ColorInput";
import { PaletteDisplay } from "./PaletteDisplay";
import { ExportPanel } from "./ExportPanel";

export const ColorGeneratorPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <ColorInput />
        </div>
      </header>

      {/* Palette */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-20">
        <PaletteDisplay />
      </main>

      {/* Export bar */}
      <footer className="border-t bg-background sticky bottom-0">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <ExportPanel />
        </div>
      </footer>
    </div>
  );
};
