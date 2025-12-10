import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Play,
  Download,
  Clock,
  Eye,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Film,
  Scissors,
} from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedShort {
  id: string;
  title: string;
  thumbnailTime: number;
  startTime: number;
  endTime: number;
  duration: number;
  score: number;
  tags: string[];
  status: 'ready' | 'processing' | 'pending';
}

interface ShortsShowcaseProps {
  isGenerating: boolean;
  shorts: GeneratedShort[];
  onSelectShort: (short: GeneratedShort) => void;
  onRegenerateShorts: () => void;
  videoSrc: string | null;
}

export function ShortsShowcase({
  isGenerating,
  shorts,
  onSelectShort,
  onRegenerateShorts,
  videoSrc,
}: ShortsShowcaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scrollLeft = () => {
    setSelectedIndex(Math.max(0, selectedIndex - 1));
  };

  const scrollRight = () => {
    setSelectedIndex(Math.min(shorts.length - 1, selectedIndex + 1));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = (short: GeneratedShort) => {
    toast.success(`Downloading "${short.title}"...`);
  };

  if (!videoSrc) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Film className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Import a YouTube video to generate AI shorts
          </p>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-2 border-primary/30 animate-ping" />
          </div>
          <h3 className="font-medium mb-1">Generating AI Shorts</h3>
          <p className="text-sm text-muted-foreground">
            Analyzing video for the best short clips...
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-1">No Shorts Generated Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click "Generate Shorts" after importing a YouTube video
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">AI Generated Shorts</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {shorts.length} clips
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerateShorts}
          className="gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Regenerate
        </Button>
      </div>

      {/* Shorts Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="relative h-full">
          {/* Navigation Arrows */}
          {shorts.length > 4 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
                onClick={scrollLeft}
                disabled={selectedIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
                onClick={scrollRight}
                disabled={selectedIndex >= shorts.length - 4}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Shorts Cards */}
          <div
            className="flex gap-4 h-full transition-transform duration-300 px-8"
            style={{ transform: `translateX(-${selectedIndex * 220}px)` }}
          >
            {shorts.map((short, index) => (
              <div
                key={short.id}
                className={cn(
                  "flex-shrink-0 w-52 h-full rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer group",
                  hoveredIndex === index
                    ? "border-primary shadow-lg shadow-primary/20 scale-105"
                    : "border-border hover:border-primary/50"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectShort(short)}
              >
                {/* Thumbnail */}
                <div className="relative h-3/5 bg-gradient-to-br from-secondary to-secondary/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Play className="w-5 h-5 text-primary fill-primary" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 text-xs">
                    <Clock className="w-3 h-3" />
                    {formatDuration(short.duration)}
                  </div>

                  {/* Score Badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-primary/90 text-xs font-medium text-primary-foreground">
                    {short.score}% match
                  </div>

                  {/* Status */}
                  {short.status === 'processing' && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="h-2/5 p-3 bg-card flex flex-col">
                  <h4 className="font-medium text-sm line-clamp-2 mb-2">{short.title}</h4>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-auto">
                    {short.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-7 text-xs gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectShort(short);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-7 text-xs gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(short);
                      }}
                    >
                      <Download className="w-3 h-3" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      {shorts.length > 4 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: Math.ceil(shorts.length / 4) }).map((_, i) => (
            <button
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                Math.floor(selectedIndex / 4) === i ? "bg-primary" : "bg-secondary"
              )}
              onClick={() => setSelectedIndex(i * 4)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export type { GeneratedShort };
