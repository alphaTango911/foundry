import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ColorInput } from './ColorInput';
import { PaletteDisplay } from './PaletteDisplay';
import { ExportPanel } from './ExportPanel';

export const ColorGeneratorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Foundry</h1>
          <p className="text-muted-foreground mt-1">
            Design system generator — pick a color, get a complete token system
          </p>
        </div>

        <Separator className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ColorInput />
          </div>

          <div>
            <Tabs defaultValue="palette">
              <TabsList>
                <TabsTrigger value="palette">Palette</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="palette" className="mt-6">
                <PaletteDisplay />
              </TabsContent>

              <TabsContent value="export" className="mt-6">
                <ExportPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};