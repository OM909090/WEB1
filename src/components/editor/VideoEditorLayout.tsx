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
  Settings,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    temperature: number;
  };
}

const exportQualities = [
  { value: '2160', label: '4K Ultra HD (2160p)' },
  { value: '1440', label: '2K QHD (1440p)' },
  { value: '1080', label: 'Full HD (1080p)' },
  { value: '720', label: 'HD (720p)' },
  { value: '480', label: 'SD (480p)' },
];

export function VideoEditorLayout() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [exportQuality, setExportQuality] = useState('1080');
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
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
    adjustments: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoState((prev) => ({ ...prev, src: url }));
      toast.success('Video loaded successfully!');
    }
  };

  const handleYoutubeImport = () => {
    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    
    // Note: Direct YouTube import requires backend processing
    toast.info('YouTube import feature requires video processing. For now, please download the video and upload it directly.');
    setYoutubeUrl('');
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

    // Simulate AI processing
    setTimeout(() => {
      // Apply some adjustments based on keywords
      const prompt = aiPrompt.toLowerCase();
      
      if (prompt.includes('warm') || prompt.includes('sunset')) {
        updateAdjustment('temperature', 25);
        updateAdjustment('saturation', 15);
      } else if (prompt.includes('cool') || prompt.includes('cold')) {
        updateAdjustment('temperature', -25);
      } else if (prompt.includes('cinematic')) {
        updateAdjustment('contrast', 20);
        updateAdjustment('saturation', -10);
      } else if (prompt.includes('vibrant') || prompt.includes('pop')) {
        updateAdjustment('saturation', 30);
        updateAdjustment('contrast', 15);
      } else if (prompt.includes('bright')) {
        updateAdjustment('brightness', 20);
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
    const { brightness, contrast, saturation } = videoState.adjustments;
    return `brightness(${1 + brightness / 100}) contrast(${1 + contrast / 100}) saturate(${1 + saturation / 100})`;
  };

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
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="import" className="text-xs">Import</TabsTrigger>
              <TabsTrigger value="adjust" className="text-xs">Adjust</TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="space-y-4">
              {/* Local Upload */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Local Upload
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
                  className="w-full h-24 border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">
                      Drop video or click to browse
                    </div>
                  </div>
                </Button>
              </div>

              {/* YouTube Import */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  YouTube Import
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste YouTube URL..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleYoutubeImport} size="icon" variant="secondary">
                    <Link2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Supported Formats */}
              <div className="p-3 rounded-lg bg-secondary/30 text-xs text-muted-foreground">
                <strong className="text-foreground">Supported formats:</strong>
                <br />
                MP4, WebM, MOV, AVI, MKV
              </div>
            </TabsContent>

            <TabsContent value="adjust" className="space-y-6">
              {[
                { key: 'brightness', label: 'Brightness', icon: Sun, min: -100, max: 100 },
                { key: 'contrast', label: 'Contrast', icon: Contrast, min: -100, max: 100 },
                { key: 'saturation', label: 'Saturation', icon: Droplets, min: -100, max: 100 },
                { key: 'temperature', label: 'Temperature', icon: Thermometer, min: -100, max: 100 },
              ].map(({ key, label, icon: Icon, min, max }) => (
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
                    min={min}
                    max={max}
                    step={1}
                    onValueChange={(v) => updateAdjustment(key as keyof VideoState['adjustments'], v[0])}
                  />
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setVideoState((prev) => ({
                  ...prev,
                  adjustments: { brightness: 0, contrast: 0, saturation: 0, temperature: 0 },
                }))}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Scissors, label: 'Trim' },
                  { icon: Clock, label: 'Speed' },
                  { icon: Type, label: 'Text' },
                  { icon: Music, label: 'Audio' },
                  { icon: Layers, label: 'Transitions' },
                  { icon: Palette, label: 'Filters' },
                ].map(({ icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => toast.info(`${label} feature coming soon!`)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>

              {/* Speed Control */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Playback Speed</h3>
                <div className="flex gap-2">
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <Button
                      key={speed}
                      size="sm"
                      variant={videoState.playbackRate === speed ? 'default' : 'outline'}
                      onClick={() => handleSpeedChange(speed)}
                      className="flex-1"
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Video Preview */}
          <div className="flex-1 p-6 flex items-center justify-center bg-black/50">
            {videoState.src ? (
              <video
                ref={videoRef}
                src={videoState.src}
                className="max-h-full max-w-full rounded-lg"
                style={{ filter: getVideoFilters() }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setVideoState((prev) => ({ ...prev, isPlaying: false }))}
              />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No video loaded</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a video or paste a YouTube link to get started
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              </div>
            )}
          </div>

          {/* Timeline & Controls */}
          {videoState.src && (
            <div className="p-4 border-t border-border bg-card/50">
              {/* Progress Bar */}
              <div className="mb-4">
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

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleSeek([0])}>
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button size="icon" onClick={togglePlay}>
                    {videoState.isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleSeek([videoState.duration])}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleMute}>
                      {videoState.isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Slider
                      value={[videoState.isMuted ? 0 : videoState.volume]}
                      min={0}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                      className="w-24"
                    />
                  </div>

                  <Button variant="ghost" size="icon">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - AI Assistant */}
        <aside className="w-80 border-l border-border bg-card/30 backdrop-blur-sm flex flex-col">
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
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Having trouble?</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Describe what you want to achieve and let AI make the adjustments for you.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">What would you like to do?</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g., 'Make it look cinematic with warm tones' or 'Add a cool blue grade'"
                  className="w-full h-24 p-3 text-sm rounded-lg bg-secondary/50 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
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
                  {['Cinematic', 'Warm', 'Cool', 'Vibrant'].map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAiPrompt(`Make it look ${preset.toLowerCase()}`);
                      }}
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
