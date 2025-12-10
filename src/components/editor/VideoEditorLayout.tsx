import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Wand2,
  Upload,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Scissors,
  Palette,
  Type,
  Music,
  Layers,
  Clock,
  RotateCcw,
  Bot,
  ArrowLeft,
  Link2,
  Sun,
  Contrast,
  Droplets,
  Thermometer,
  Sparkles,
  Zap,
  Crop,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
  Move,
  ZoomIn,
  ZoomOut,
  ImagePlus,
  SlidersHorizontal,
  Gauge,
  Film,
  MonitorPlay,
  Subtitles,
  Mic,
  VolumeOff,
  Waves,
  Loader2,
  Youtube,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShortsShowcase, GeneratedShort } from './ShortsShowcase';

interface VideoState {
  src: string | null;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  trimStart: number;
  trimEnd: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  zoom: number;
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    temperature: number;
    blur: number;
    sharpen: number;
    vignette: number;
    grain: number;
  };
  effects: {
    fadeIn: number;
    fadeOut: number;
    slowMo: boolean;
    reverse: boolean;
    stabilize: boolean;
  };
  audio: {
    noiseReduction: number;
    bassBoost: number;
    trebleBoost: number;
    normalize: boolean;
  };
}

const exportQualities = [
  { value: '2160', label: '4K Ultra HD (2160p)' },
  { value: '1440', label: '2K QHD (1440p)' },
  { value: '1080', label: 'Full HD (1080p)' },
  { value: '720', label: 'HD (720p)' },
  { value: '480', label: 'SD (480p)' },
];

const videoFilters = [
  { id: 'none', name: 'None', filter: '' },
  { id: 'vintage', name: 'Vintage', filter: 'sepia(0.4) contrast(1.1)' },
  { id: 'noir', name: 'Noir', filter: 'grayscale(1) contrast(1.2)' },
  { id: 'vivid', name: 'Vivid', filter: 'saturate(1.5) contrast(1.1)' },
  { id: 'cool', name: 'Cool', filter: 'hue-rotate(20deg) saturate(0.9)' },
  { id: 'warm', name: 'Warm', filter: 'sepia(0.2) saturate(1.2)' },
  { id: 'dramatic', name: 'Dramatic', filter: 'contrast(1.3) brightness(0.9)' },
  { id: 'fade', name: 'Fade', filter: 'contrast(0.9) brightness(1.1) saturate(0.8)' },
];

export function VideoEditorLayout() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [exportQuality, setExportQuality] = useState('1080');
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [activeFilter, setActiveFilter] = useState('none');
  const [isYoutubeImporting, setIsYoutubeImporting] = useState(false);
  const [isGeneratingShorts, setIsGeneratingShorts] = useState(false);
  const [generatedShorts, setGeneratedShorts] = useState<GeneratedShort[]>([]);
  const [importSource, setImportSource] = useState<'local' | 'youtube' | null>(null);
  
  const [videoState, setVideoState] = useState<VideoState>({
    src: null,
    duration: 0,
    currentTime: 0,
    isPlaying: false,
    volume: 1,
    isMuted: false,
    playbackRate: 1,
    trimStart: 0,
    trimEnd: 100,
    rotation: 0,
    flipH: false,
    flipV: false,
    zoom: 100,
    adjustments: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
      blur: 0,
      sharpen: 0,
      vignette: 0,
      grain: 0,
    },
    effects: {
      fadeIn: 0,
      fadeOut: 0,
      slowMo: false,
      reverse: false,
      stabilize: false,
    },
    audio: {
      noiseReduction: 0,
      bassBoost: 0,
      trebleBoost: 0,
      normalize: false,
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoState((prev) => ({ ...prev, src: url }));
      setImportSource('local');
      setGeneratedShorts([]);
      toast.success('Video loaded successfully!');
    }
  };

  const handleYoutubeImport = async () => {
    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    // Validate YouTube URL
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/;
    if (!ytRegex.test(youtubeUrl)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    setIsYoutubeImporting(true);
    toast.info('Importing video from YouTube...');

    // Simulate import process
    setTimeout(() => {
      setVideoState((prev) => ({
        ...prev,
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      }));
      setImportSource('youtube');
      setIsYoutubeImporting(false);
      toast.success('YouTube video imported successfully!');
      
      // Auto-trigger shorts generation for YouTube imports
      generateShorts();
    }, 2000);
  };

  const generateShorts = () => {
    setIsGeneratingShorts(true);
    
    // Simulate AI shorts generation
    setTimeout(() => {
      const mockShorts: GeneratedShort[] = [
        {
          id: '1',
          title: 'Epic Intro Scene',
          thumbnailTime: 5,
          startTime: 0,
          endTime: 15,
          duration: 15,
          score: 95,
          tags: ['viral', 'hook'],
          status: 'ready',
        },
        {
          id: '2',
          title: 'Key Highlight Moment',
          thumbnailTime: 45,
          startTime: 40,
          endTime: 58,
          duration: 18,
          score: 88,
          tags: ['highlight', 'action'],
          status: 'ready',
        },
        {
          id: '3',
          title: 'Emotional Peak',
          thumbnailTime: 120,
          startTime: 115,
          endTime: 135,
          duration: 20,
          score: 92,
          tags: ['emotional', 'trending'],
          status: 'ready',
        },
        {
          id: '4',
          title: 'Surprise Twist',
          thumbnailTime: 200,
          startTime: 195,
          endTime: 215,
          duration: 20,
          score: 85,
          tags: ['twist', 'cliffhanger'],
          status: 'ready',
        },
        {
          id: '5',
          title: 'Perfect Ending',
          thumbnailTime: 280,
          startTime: 275,
          endTime: 295,
          duration: 20,
          score: 90,
          tags: ['ending', 'satisfying'],
          status: 'ready',
        },
        {
          id: '6',
          title: 'Funny Moment',
          thumbnailTime: 150,
          startTime: 145,
          endTime: 160,
          duration: 15,
          score: 82,
          tags: ['comedy', 'shareable'],
          status: 'ready',
        },
      ];
      
      setGeneratedShorts(mockShorts);
      setIsGeneratingShorts(false);
      toast.success(`Generated ${mockShorts.length} potential shorts!`);
    }, 3000);
  };

  const handleSelectShort = (short: GeneratedShort) => {
    if (videoRef.current) {
      videoRef.current.currentTime = short.startTime;
      setVideoState((prev) => ({
        ...prev,
        trimStart: (short.startTime / prev.duration) * 100,
        trimEnd: (short.endTime / prev.duration) * 100,
        currentTime: short.startTime,
      }));
      toast.success(`Selected: ${short.title}`);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoState.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoState((prev) => ({
        ...prev,
        currentTime: videoRef.current?.currentTime || 0,
      }));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoState((prev) => ({
        ...prev,
        duration: videoRef.current?.duration || 0,
      }));
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setVideoState((prev) => ({ ...prev, currentTime: value[0] }));
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0];
      setVideoState((prev) => ({ ...prev, volume: value[0], isMuted: value[0] === 0 }));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoState.isMuted;
      setVideoState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setVideoState((prev) => ({ ...prev, playbackRate: speed }));
    }
  };

  const updateAdjustment = (key: keyof VideoState['adjustments'], value: number) => {
    setVideoState((prev) => ({
      ...prev,
      adjustments: { ...prev.adjustments, [key]: value },
    }));
  };

  const updateAudio = (key: keyof VideoState['audio'], value: number | boolean) => {
    setVideoState((prev) => ({
      ...prev,
      audio: { ...prev.audio, [key]: value },
    }));
  };

  const handleRotate = (degrees: number) => {
    setVideoState((prev) => ({
      ...prev,
      rotation: (prev.rotation + degrees) % 360,
    }));
  };

  const handleFlip = (direction: 'h' | 'v') => {
    if (direction === 'h') {
      setVideoState((prev) => ({ ...prev, flipH: !prev.flipH }));
    } else {
      setVideoState((prev) => ({ ...prev, flipV: !prev.flipV }));
    }
  };

  const handleZoom = (delta: number) => {
    setVideoState((prev) => ({
      ...prev,
      zoom: Math.max(50, Math.min(200, prev.zoom + delta)),
    }));
  };

  const handleAITakeover = async () => {
    if (!videoState.src) {
      toast.error('Please upload a video first');
      return;
    }

    if (!aiPrompt.trim()) {
      toast.error('Please describe what you want to do');
      return;
    }

    setIsAIProcessing(true);
    toast.info('AI is analyzing your request...');

    setTimeout(() => {
      const prompt = aiPrompt.toLowerCase();
      
      if (prompt.includes('warm') || prompt.includes('sunset')) {
        updateAdjustment('temperature', 25);
        updateAdjustment('saturation', 15);
        setActiveFilter('warm');
      } else if (prompt.includes('cool') || prompt.includes('cold')) {
        updateAdjustment('temperature', -25);
        setActiveFilter('cool');
      } else if (prompt.includes('cinematic') || prompt.includes('film')) {
        updateAdjustment('contrast', 20);
        updateAdjustment('saturation', -10);
        updateAdjustment('vignette', 30);
        setActiveFilter('dramatic');
      } else if (prompt.includes('vibrant') || prompt.includes('pop') || prompt.includes('colorful')) {
        updateAdjustment('saturation', 30);
        updateAdjustment('contrast', 15);
        setActiveFilter('vivid');
      } else if (prompt.includes('vintage') || prompt.includes('retro') || prompt.includes('old')) {
        setActiveFilter('vintage');
        updateAdjustment('grain', 20);
      } else if (prompt.includes('black and white') || prompt.includes('b&w') || prompt.includes('noir')) {
        setActiveFilter('noir');
      } else if (prompt.includes('bright') || prompt.includes('lighter')) {
        updateAdjustment('brightness', 20);
      } else if (prompt.includes('dark') || prompt.includes('moody')) {
        updateAdjustment('brightness', -20);
        updateAdjustment('contrast', 15);
      } else if (prompt.includes('slow') || prompt.includes('slow motion')) {
        handleSpeedChange(0.5);
      } else if (prompt.includes('fast') || prompt.includes('speed up')) {
        handleSpeedChange(2);
      }

      setIsAIProcessing(false);
      setAiPrompt('');
      toast.success('AI adjustments applied!');
    }, 2000);
  };

  const handleExport = () => {
    if (!videoState.src) {
      toast.error('Please upload a video first');
      return;
    }
    toast.success(`Exporting video in ${exportQuality}p quality...`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoFilters = () => {
    const { brightness, contrast, saturation, blur } = videoState.adjustments;
    const activeFilterStyle = videoFilters.find(f => f.id === activeFilter)?.filter || '';
    return `brightness(${1 + brightness / 100}) contrast(${1 + contrast / 100}) saturate(${1 + saturation / 100}) blur(${blur}px) ${activeFilterStyle}`;
  };

  const getVideoTransform = () => {
    const { rotation, flipH, flipV, zoom } = videoState;
    const scaleX = flipH ? -1 : 1;
    const scaleY = flipV ? -1 : 1;
    return `rotate(${rotation}deg) scale(${(zoom / 100) * scaleX}, ${(zoom / 100) * scaleY})`;
  };

  const resetAll = () => {
    setVideoState((prev) => ({
      ...prev,
      rotation: 0,
      flipH: false,
      flipV: false,
      zoom: 100,
      adjustments: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        temperature: 0,
        blur: 0,
        sharpen: 0,
        vignette: 0,
        grain: 0,
      },
      effects: {
        fadeIn: 0,
        fadeOut: 0,
        slowMo: false,
        reverse: false,
        stabilize: false,
      },
      audio: {
        noiseReduction: 0,
        bassBoost: 0,
        trebleBoost: 0,
        normalize: false,
      },
    }));
    setActiveFilter('none');
    toast.success('All settings reset!');
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/30 rounded-lg blur-lg" />
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Video Editor</h1>
              <p className="text-xs text-muted-foreground">PixelForge AI</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={exportQuality} onValueChange={setExportQuality}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Export Quality" />
            </SelectTrigger>
            <SelectContent>
              {exportQualities.map((q) => (
                <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="w-80 border-r border-border bg-card/30 backdrop-blur-sm overflow-y-auto scrollbar-thin">
          <Tabs defaultValue="import" className="p-4">
            <TabsList className="w-full grid grid-cols-5 mb-4">
              <TabsTrigger value="import" className="text-xs px-1">Import</TabsTrigger>
              <TabsTrigger value="adjust" className="text-xs px-1">Color</TabsTrigger>
              <TabsTrigger value="transform" className="text-xs px-1">Transform</TabsTrigger>
              <TabsTrigger value="effects" className="text-xs px-1">Effects</TabsTrigger>
              <TabsTrigger value="audio" className="text-xs px-1">Audio</TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="space-y-4">
              {/* Split Import Section */}
              <div className="grid grid-cols-2 gap-3">
                {/* Local Upload */}
                <div className="space-y-2">
                  <h3 className="text-xs font-medium flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    Local File
                  </h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-20 border-dashed flex-col gap-1",
                      importSource === 'local' && "border-primary bg-primary/5"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                  </Button>
                </div>

                {/* YouTube Import */}
                <div className="space-y-2">
                  <h3 className="text-xs font-medium flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    YouTube
                  </h3>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-20 border-dashed flex-col gap-1",
                      importSource === 'youtube' && "border-primary bg-primary/5"
                    )}
                    onClick={() => document.getElementById('yt-input')?.focus()}
                  >
                    <Link2 className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Paste URL</span>
                  </Button>
                </div>
              </div>

              {/* YouTube URL Input */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="yt-input"
                    placeholder="Paste YouTube URL..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleYoutubeImport()}
                  />
                  <Button 
                    onClick={handleYoutubeImport} 
                    size="icon" 
                    variant="secondary"
                    disabled={isYoutubeImporting}
                  >
                    {isYoutubeImporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Generate Shorts Button */}
              {importSource === 'youtube' && videoState.src && (
                <Button
                  className="w-full gap-2"
                  variant="secondary"
                  onClick={generateShorts}
                  disabled={isGeneratingShorts}
                >
                  {isGeneratingShorts ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Generate AI Shorts
                </Button>
              )}

              {/* Supported Formats */}
              <div className="p-3 rounded-lg bg-secondary/30 text-xs text-muted-foreground">
                <strong className="text-foreground">Supported:</strong> MP4, WebM, MOV, AVI, MKV
              </div>
            </TabsContent>

            <TabsContent value="adjust" className="space-y-4">
              {/* Quick Filters */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Quick Filters</h3>
                <div className="grid grid-cols-4 gap-2">
                  {videoFilters.map((filter) => (
                    <button
                      key={filter.id}
                      className={cn(
                        "aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-xs font-medium",
                        activeFilter === filter.id
                          ? "border-primary bg-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setActiveFilter(filter.id)}
                    >
                      {filter.name.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Adjustments */}
              {[
                { key: 'brightness', label: 'Brightness', icon: Sun },
                { key: 'contrast', label: 'Contrast', icon: Contrast },
                { key: 'saturation', label: 'Saturation', icon: Droplets },
                { key: 'temperature', label: 'Temperature', icon: Thermometer },
                { key: 'vignette', label: 'Vignette', icon: ImagePlus },
                { key: 'grain', label: 'Grain', icon: Sparkles },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {videoState.adjustments[key as keyof VideoState['adjustments']]}
                    </span>
                  </div>
                  <Slider
                    value={[videoState.adjustments[key as keyof VideoState['adjustments']]]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={(v) => updateAdjustment(key as keyof VideoState['adjustments'], v[0])}
                  />
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={resetAll}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </TabsContent>

            <TabsContent value="transform" className="space-y-4">
              {/* Rotation */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Rotation</h3>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => handleRotate(-90)}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    -90°
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => handleRotate(90)}>
                    <RotateCw className="w-4 h-4 mr-1" />
                    +90°
                  </Button>
                </div>
                <div className="text-center text-xs text-muted-foreground">
                  Current: {videoState.rotation}°
                </div>
              </div>

              {/* Flip */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Flip</h3>
                <div className="flex gap-2">
                  <Button
                    variant={videoState.flipH ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleFlip('h')}
                  >
                    <FlipHorizontal className="w-4 h-4 mr-1" />
                    Horizontal
                  </Button>
                  <Button
                    variant={videoState.flipV ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleFlip('v')}
                  >
                    <FlipVertical className="w-4 h-4 mr-1" />
                    Vertical
                  </Button>
                </div>
              </div>

              {/* Zoom */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Zoom</h3>
                  <span className="text-xs text-muted-foreground">{videoState.zoom}%</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleZoom(-10)}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Slider
                    value={[videoState.zoom]}
                    min={50}
                    max={200}
                    step={5}
                    onValueChange={(v) => setVideoState((prev) => ({ ...prev, zoom: v[0] }))}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleZoom(10)}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Crop & Position */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-16 flex-col gap-1">
                  <Crop className="w-5 h-5" />
                  <span className="text-xs">Crop</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-1">
                  <Move className="w-5 h-5" />
                  <span className="text-xs">Position</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              {/* Quick Effects */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Scissors, label: 'Trim', action: 'trim' },
                  { icon: Clock, label: 'Speed', action: 'speed' },
                  { icon: Type, label: 'Text Overlay', action: 'text' },
                  { icon: Subtitles, label: 'Subtitles', action: 'subtitles' },
                  { icon: Layers, label: 'Transitions', action: 'transitions' },
                  { icon: MonitorPlay, label: 'Picture-in-Picture', action: 'pip' },
                  { icon: Film, label: 'Slow Motion', action: 'slowmo' },
                  { icon: Zap, label: 'Stabilize', action: 'stabilize' },
                ].map(({ icon: Icon, label, action }) => (
                  <Button
                    key={label}
                    variant="outline"
                    className="h-16 flex-col gap-1"
                    onClick={() => toast.info(`${label} feature opening...`)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>

              {/* Playback Speed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    Playback Speed
                  </h3>
                  <span className="text-xs text-muted-foreground">{videoState.playbackRate}x</span>
                </div>
                <div className="flex gap-1">
                  {[0.25, 0.5, 1, 1.5, 2, 4].map((speed) => (
                    <Button
                      key={speed}
                      size="sm"
                      variant={videoState.playbackRate === speed ? 'default' : 'outline'}
                      onClick={() => handleSpeedChange(speed)}
                      className="flex-1 text-xs px-1"
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Fade Controls */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Fade Effects</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Fade In</span>
                    <span className="text-xs text-muted-foreground">{videoState.effects.fadeIn}s</span>
                  </div>
                  <Slider
                    value={[videoState.effects.fadeIn]}
                    min={0}
                    max={5}
                    step={0.1}
                    onValueChange={(v) => setVideoState((prev) => ({
                      ...prev,
                      effects: { ...prev.effects, fadeIn: v[0] },
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Fade Out</span>
                    <span className="text-xs text-muted-foreground">{videoState.effects.fadeOut}s</span>
                  </div>
                  <Slider
                    value={[videoState.effects.fadeOut]}
                    min={0}
                    max={5}
                    step={0.1}
                    onValueChange={(v) => setVideoState((prev) => ({
                      ...prev,
                      effects: { ...prev.effects, fadeOut: v[0] },
                    }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audio" className="space-y-4">
              {/* Audio Controls */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Mic, label: 'Voice Extract' },
                  { icon: Music, label: 'Add Music' },
                  { icon: VolumeOff, label: 'Mute Original' },
                  { icon: Waves, label: 'Equalizer' },
                ].map(({ icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="outline"
                    className="h-16 flex-col gap-1"
                    onClick={() => toast.info(`${label} feature coming soon!`)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>

              {/* Audio Adjustments */}
              {[
                { key: 'noiseReduction', label: 'Noise Reduction' },
                { key: 'bassBoost', label: 'Bass Boost' },
                { key: 'trebleBoost', label: 'Treble Boost' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{label}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {videoState.audio[key as keyof typeof videoState.audio]}%
                    </span>
                  </div>
                  <Slider
                    value={[videoState.audio[key as keyof typeof videoState.audio] as number]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(v) => updateAudio(key as keyof VideoState['audio'], v[0])}
                  />
                </div>
              ))}

              <Button
                variant={videoState.audio.normalize ? 'default' : 'outline'}
                className="w-full"
                onClick={() => updateAudio('normalize', !videoState.audio.normalize)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Normalize Audio
              </Button>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Video Preview - Top Half */}
          <div className="h-1/2 p-4 flex items-center justify-center bg-black/50 relative overflow-hidden">
            {videoState.src ? (
              <video
                ref={videoRef}
                src={videoState.src}
                className="max-h-full max-w-full rounded-lg transition-transform"
                style={{ 
                  filter: getVideoFilters(),
                  transform: getVideoTransform(),
                }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setVideoState((prev) => ({ ...prev, isPlaying: false }))}
              />
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No video loaded</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a video or paste a YouTube link
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <Button variant="outline" onClick={() => document.getElementById('yt-input')?.focus()}>
                    <Youtube className="w-4 h-4 mr-2" />
                    YouTube
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Shorts Showcase - Bottom Half */}
          <div className="h-1/2 border-t border-border bg-card/30">
            <ShortsShowcase
              isGenerating={isGeneratingShorts}
              shorts={generatedShorts}
              onSelectShort={handleSelectShort}
              onRegenerateShorts={generateShorts}
              videoSrc={importSource === 'youtube' ? videoState.src : null}
            />
          </div>

          {/* Timeline & Controls - Floating */}
          {videoState.src && (
            <div className="absolute bottom-1/2 left-80 right-80 mx-4 translate-y-1/2 p-3 border border-border bg-card/90 backdrop-blur-sm rounded-lg">
              <div className="mb-2">
                <Slider
                  value={[videoState.currentTime]}
                  min={0}
                  max={videoState.duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(videoState.currentTime)}</span>
                  <span>{formatTime(videoState.duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSeek([0])}>
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button size="icon" className="h-8 w-8" onClick={togglePlay}>
                    {videoState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSeek([videoState.duration])}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
                    {videoState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[videoState.isMuted ? 0 : videoState.volume]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - AI Assistant */}
        <aside className="w-72 border-l border-border bg-card/30 backdrop-blur-sm flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Let AI handle your edits</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Having trouble?</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Describe what you want and let AI make the adjustments.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">What would you like to do?</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g., 'Make it cinematic' or 'Add slow motion effect'"
                  className="w-full h-20 p-3 text-sm rounded-lg bg-secondary/50 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  className="w-full gap-2"
                  onClick={handleAITakeover}
                  disabled={isAIProcessing || !videoState.src}
                >
                  {isAIProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Apply AI Edits
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Cinematic', 'Warm', 'Cool', 'Vibrant', 'Vintage', 'Slow-Mo'].map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => setAiPrompt(`Make it ${preset.toLowerCase()}`)}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
