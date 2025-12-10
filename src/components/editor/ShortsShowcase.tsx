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
  path?: string; // Optional path to the video file
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
    <div className="h-full flex flex-col p-4 bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AI Generated Shorts</h3>
            <p className="text-xs text-muted-foreground">
              {shorts.length} high-quality clips ready
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerateShorts}
          className="gap-2 hover:bg-primary/10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
        </Button>
      </div>

      {/* Shorts Grid - Responsive */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 h-full pb-2 min-w-max">
            {shorts.map((short, index) => (
              <div
                key={short.id}
                className={cn(
                  "flex-shrink-0 w-64 h-full rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group bg-card shadow-lg",
                  hoveredIndex === index
                    ? "border-primary shadow-xl shadow-primary/30 scale-[1.02] -translate-y-1"
                    : "border-border/50 hover:border-primary/50 hover:shadow-xl"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectShort(short)}
              >
                {/* Thumbnail */}
                <div className="relative h-3/5 bg-gradient-to-br from-primary/5 via-secondary/30 to-primary/10 overflow-hidden">
                  {/* Video thumbnail if path exists */}
                  {short.path && (
                    <video
                      src={short.path}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      muted
                      preload="metadata"
                    />
                  )}
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40">
                    <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all shadow-lg">
                      <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm text-xs font-medium border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">{formatDuration(short.duration)}</span>
                  </div>

                  {/* Score Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-lg">
                    {short.score}%
                  </div>

                  {/* Clip Number */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white border border-white/10">
                    {index + 1}
                  </div>

                  {/* Status */}
                  {short.status === 'processing' && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="h-2/5 p-4 bg-gradient-to-b from-card to-card/80 flex flex-col border-t border-border/50">
                  <h4 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {short.title}
                  </h4>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-auto">
                    {short.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 h-8 text-xs gap-1.5 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectShort(short);
                      }}
                    >
                      <Play className="w-3.5 h-3.5" />
                      Play
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs gap-1.5 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(short);
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {shorts.length > 3 && (
        <div className="flex justify-center items-center gap-2 mt-3 pt-3 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Scroll to see more clips →
          </div>
        </div>
      )}
    </div>
  );
}

export type { GeneratedShort };
