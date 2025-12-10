import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useImageEditor } from '@/hooks/useImageEditor';
import { Toolbar } from './Toolbar';
import { AdjustmentPanel } from './AdjustmentPanel';
import { FilterPanel } from './FilterPanel';
import { Canvas } from './Canvas';
import { AIAssistant } from './AIAssistant';
import { ExportSettings } from './ExportSettings';
import { ChatMessage, ImageAdjustments } from '@/types/editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sliders, Wand2, PanelRightOpen, PanelRightClose, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { processAIEditCommand } from '@/lib/ai-edit';

interface EditorLayoutProps {
  mode?: 'image' | 'video';
}

export function EditorLayout({ mode = 'image' }: EditorLayoutProps) {
  const editor = useImageEditor();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);

  const handleExport = async (settings?: { quality: string; format: string; resolution: string }) => {
    const dataUrl = await editor.exportImage();
    if (dataUrl) {
      const format = settings?.format || 'png';
      const link = document.createElement('a');
      link.download = `edited-image.${format}`;
      link.href = dataUrl;
      link.click();
      toast.success(`Image exported as ${format.toUpperCase()}!`);
    }
  };

  const handleAIMessage = useCallback(async (userMessage: string) => {
    if (!editor.state.image) {
      toast.error('Please upload an image first');
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsAILoading(true);

    // Add loading message
    const loadingMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      // Call the AI edge function
      const response = await processAIEditCommand(userMessage, editor.state.adjustments);
      
      // Apply the adjustments
      if (response.adjustments) {
        Object.entries(response.adjustments).forEach(([key, value]) => {
          if (typeof value === 'number') {
            editor.updateAdjustment(key as keyof ImageAdjustments, value);
          }
        });
      }

      // Apply filter if specified
      if (response.filter && response.filter !== 'none') {
        editor.applyFilter(response.filter);
      }

      // Update the loading message with the response
      setMessages((prev) => 
        prev.map((msg) =>
          msg.id === loadingMsg.id
            ? { ...msg, content: response.explanation || 'Adjustments applied!', isLoading: false }
            : msg
        )
      );

      toast.success('AI edits applied!');
    } catch (error) {
      console.error('AI edit error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to process your request';
      
      setMessages((prev) => 
        prev.map((msg) =>
          msg.id === loadingMsg.id
            ? { ...msg, content: `Sorry, I couldn't process that request: ${errorMessage}. Try being more specific about the adjustments you want.`, isLoading: false }
            : msg
        )
      );
      
      toast.error(errorMessage);
    } finally {
      setIsAILoading(false);
    }
  }, [editor]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-lg blur-lg" />
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Image Editor</h1>
              <p className="text-xs text-muted-foreground">PixelForge AI</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Toolbar
            canUndo={editor.canUndo}
            canRedo={editor.canRedo}
            zoom={editor.state.zoom}
            onUndo={editor.undo}
            onRedo={editor.redo}
            onReset={editor.reset}
            onExport={() => {}}
            onZoomIn={() => editor.setZoom(editor.state.zoom + 0.1)}
            onZoomOut={() => editor.setZoom(editor.state.zoom - 0.1)}
            onRotate={() => editor.setRotation(editor.state.rotation + 90)}
            onFitToScreen={() => editor.setZoom(1)}
          />
          <ExportSettings onExport={handleExport} type="image" />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
          className="lg:hidden"
        >
          {isAIPanelOpen ? <PanelRightClose /> : <PanelRightOpen />}
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="w-72 border-r border-border bg-card/30 backdrop-blur-sm overflow-y-auto scrollbar-thin hidden md:block">
          <Tabs defaultValue="adjustments" className="p-4">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="adjustments" className="gap-2">
                <Sliders className="w-4 h-4" />
                Adjust
              </TabsTrigger>
              <TabsTrigger value="filters" className="gap-2">
                <Wand2 className="w-4 h-4" />
                Filters
              </TabsTrigger>
            </TabsList>
            <TabsContent value="adjustments" className="mt-0">
              <AdjustmentPanel
                adjustments={editor.state.adjustments}
                onAdjustmentChange={editor.updateAdjustment}
              />
            </TabsContent>
            <TabsContent value="filters" className="mt-0">
              <FilterPanel
                activeFilter={editor.state.activeFilter}
                onFilterSelect={editor.applyFilter}
                imageUrl={editor.state.image}
              />
            </TabsContent>
          </Tabs>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 p-6 overflow-hidden">
          <Canvas
            image={editor.state.image}
            cssFilters={editor.getCSSFilters()}
            zoom={editor.state.zoom}
            rotation={editor.state.rotation}
            onImageUpload={editor.loadImage}
          />
        </main>

        {/* Right Sidebar - AI Assistant */}
        <aside
          className={cn(
            'w-80 border-l border-border bg-card/30 backdrop-blur-sm transition-all duration-300',
            isAIPanelOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 top-0 bottom-0 lg:relative lg:translate-x-0',
            'hidden lg:flex flex-col'
          )}
        >
          <AIAssistant
            messages={messages}
            isLoading={isAILoading}
            onSendMessage={handleAIMessage}
          />
        </aside>
      </div>
    </div>
  );
}
