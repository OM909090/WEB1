import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { 
  Wand2, 
  Image, 
  Video, 
  Sparkles, 
  Zap, 
  Download, 
  Upload, 
  Play,
  Palette,
  Scissors,
  Layers,
  Sun,
  Contrast,
  Droplets,
  RotateCcw,
  Crop,
  Type,
  Music,
  Clock,
  ArrowRight,
  Check,
  Bot,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const imageFeatures = [
  { icon: Sun, title: 'Brightness & Exposure', description: 'Fine-tune lighting with precision controls' },
  { icon: Contrast, title: 'Contrast & Clarity', description: 'Enhance depth and detail in your images' },
  { icon: Droplets, title: 'Saturation & Vibrance', description: 'Make colors pop or create muted tones' },
  { icon: Palette, title: 'Color Temperature', description: 'Warm or cool your images for the perfect mood' },
  { icon: Crop, title: 'Crop & Transform', description: 'Resize, rotate, and flip with ease' },
  { icon: Layers, title: 'Filters & Presets', description: 'One-click professional looks' },
  { icon: Wand2, title: 'AI Enhancement', description: 'Automatic smart adjustments' },
  { icon: RotateCcw, title: 'Undo/Redo History', description: 'Never lose your work' },
];

const videoFeatures = [
  { icon: Scissors, title: 'Trim & Cut', description: 'Precise video trimming and splitting' },
  { icon: Play, title: 'Speed Control', description: 'Slow-mo, time-lapse, and speed ramping' },
  { icon: Palette, title: 'Color Grading', description: 'Professional color correction tools' },
  { icon: Type, title: 'Text & Titles', description: 'Add animated text overlays' },
  { icon: Music, title: 'Audio Editing', description: 'Add music, adjust volume, sync audio' },
  { icon: Layers, title: 'Transitions', description: 'Smooth transitions between clips' },
  { icon: Clock, title: 'Timeline Editing', description: 'Multi-track timeline editor' },
  { icon: Wand2, title: 'AI Video Effects', description: 'Smart filters and enhancements' },
];

const qualityOptions = [
  { quality: '4K Ultra HD', resolution: '3840 × 2160', icon: '🎬' },
  { quality: '2K QHD', resolution: '2560 × 1440', icon: '🎥' },
  { quality: '1080p Full HD', resolution: '1920 × 1080', icon: '📹' },
  { quality: '720p HD', resolution: '1280 × 720', icon: '📷' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  return (
    <>
      <Helmet>
        <title>PixelForge AI - Intelligent Photo & Video Editor</title>
        <meta name="description" content="Transform your images and videos with AI-powered editing tools. Apply filters, adjust colors, trim videos, and let AI assist your creative workflow." />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 rounded-lg blur-lg" />
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
                <span className="text-xl font-bold gradient-text">PixelForge AI</span>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/editor/image">
                  <Button variant="ghost" className="hidden sm:flex">Image Editor</Button>
                </Link>
                <Link to="/editor/video">
                  <Button variant="ghost" className="hidden sm:flex">Video Editor</Button>
                </Link>
                <Link to="/editor/image">
                  <Button className="glow-primary">Start Editing</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">AI-Powered Editing Suite</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Transform Your Media</span>
              <br />
              <span className="text-foreground">With AI Intelligence</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Professional-grade photo and video editing powered by artificial intelligence. 
              Edit with precision or let our AI handle the complex work for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/editor/image">
                <Button size="lg" className="glow-primary gap-2 text-lg px-8 py-6">
                  <Image className="w-5 h-5" />
                  Edit Images
                </Button>
              </Link>
              <Link to="/editor/video">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-accent/50 hover:bg-accent/10">
                  <Video className="w-5 h-5" />
                  Edit Videos
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: 'Image Formats', value: 'All Major' },
                { label: 'Video Support', value: 'MP4, WebM, MOV' },
                { label: 'Export Quality', value: 'Up to 4K' },
                { label: 'AI Features', value: '20+ Tools' },
              ].map((stat) => (
                <div key={stat.label} className="glass-panel p-4 rounded-xl">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-muted-foreground" />
          </div>
        </section>

        {/* Features Tabs Section */}
        <section className="py-20 px-4 bg-card/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Complete Editing Suite</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need for professional media editing in one powerful platform
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex p-1.5 rounded-xl bg-secondary/50 border border-border">
                <button
                  onClick={() => setActiveTab('image')}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                    activeTab === 'image' 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Image className="w-5 h-5" />
                  Image Editing
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                    activeTab === 'video' 
                      ? 'bg-accent text-accent-foreground shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Video className="w-5 h-5" />
                  Video Editing
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(activeTab === 'image' ? imageFeatures : videoFeatures).map((feature, i) => (
                <div 
                  key={feature.title}
                  className="glass-panel p-6 rounded-xl hover:border-primary/30 transition-all group cursor-default"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors',
                    activeTab === 'image' ? 'bg-primary/20 group-hover:bg-primary/30' : 'bg-accent/20 group-hover:bg-accent/30'
                  )}>
                    <feature.icon className={cn(
                      'w-6 h-6',
                      activeTab === 'image' ? 'text-primary' : 'text-accent'
                    )} />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Link to={activeTab === 'image' ? '/editor/image' : '/editor/video'}>
                <Button size="lg" className={cn(
                  'gap-2',
                  activeTab === 'video' && 'bg-accent hover:bg-accent/90'
                )}>
                  Start {activeTab === 'image' ? 'Image' : 'Video'} Editing
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Video Import Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
                  <Video className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent">Video Import</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Import Videos From Anywhere
                </h2>
                <p className="text-muted-foreground mb-8">
                  Upload from your device or paste a YouTube link. Our smart import system 
                  handles multiple formats and resolutions automatically.
                </p>

                <div className="space-y-4">
                  {[
                    { title: 'Local Upload', desc: 'Drag & drop or browse MP4, WebM, MOV, AVI files' },
                    { title: 'YouTube Import', desc: 'Paste any YouTube URL to start editing' },
                    { title: 'Cloud Storage', desc: 'Connect Google Drive, Dropbox, and more' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/editor/video" className="inline-block mt-8">
                  <Button className="bg-accent hover:bg-accent/90 gap-2">
                    Try Video Editor
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="glass-panel p-8 rounded-2xl">
                <div className="space-y-4">
                  <div className="p-6 rounded-xl border-2 border-dashed border-border hover:border-accent/50 transition-colors cursor-pointer text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <div className="font-medium mb-1">Drop your video here</div>
                    <div className="text-sm text-muted-foreground">or click to browse</div>
                  </div>
                  
                  <div className="text-center text-muted-foreground">or</div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 rounded-lg bg-secondary/50 border border-border text-muted-foreground text-sm">
                      https://youtube.com/watch?v=...
                    </div>
                    <Button variant="secondary" className="shrink-0">
                      Import
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Section */}
        <section className="py-20 px-4 bg-card/30">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Quality Options</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Export In Any Resolution
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              From web-optimized to cinema-quality 4K, choose the perfect export settings for your needs
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {qualityOptions.map((option) => (
                <div key={option.quality} className="glass-panel p-6 rounded-xl hover:border-primary/30 transition-all">
                  <div className="text-4xl mb-4">{option.icon}</div>
                  <div className="font-semibold text-lg mb-1">{option.quality}</div>
                  <div className="text-sm text-muted-foreground">{option.resolution}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-sm">Lossless Upload</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
                <Download className="w-4 h-4 text-primary" />
                <span className="text-sm">High-Quality Export</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm">Fast Processing</span>
              </div>
            </div>
          </div>
        </section>

        {/* AI Takeover Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="glass-panel p-8 sm:p-12 rounded-2xl border-primary/20 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary">AI Assistant</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Having Trouble?
                    <br />
                    <span className="gradient-text">Let AI Take Over</span>
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Stuck on a complex edit? Just describe what you want in natural language, 
                    and our AI will execute the perfect adjustments. From simple tweaks to 
                    advanced effects, let our intelligent assistant do the heavy lifting.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      '"Make this look like a sunset scene"',
                      '"Remove the blue tint and add warmth"',
                      '"Apply a cinematic color grade"',
                      '"Enhance the details and reduce noise"',
                    ].map((example) => (
                      <div key={example} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/50">
                        <Wand2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm">{example}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/editor/image">
                    <Button size="lg" className="glow-primary gap-2">
                      <Sparkles className="w-5 h-5" />
                      Try AI Editing Now
                    </Button>
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
                  <div className="relative glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">PixelForge AI</div>
                        <div className="text-xs text-muted-foreground">Your intelligent editing assistant</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-primary/20 rounded-xl rounded-br-none px-4 py-2 max-w-[80%]">
                          <p className="text-sm">Make this photo look like a warm summer evening</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-secondary rounded-xl rounded-bl-none px-4 py-2 max-w-[80%]">
                          <p className="text-sm">I'll apply warm tones with increased temperature (+25), add a slight golden hue, boost saturation (+15), and reduce contrast slightly for that soft evening glow.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-card/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Media?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
              Start editing your photos and videos with professional-grade tools and AI assistance. No signup required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/editor/image">
                <Button size="lg" className="glow-primary gap-2 px-8">
                  <Image className="w-5 h-5" />
                  Start Image Editing
                </Button>
              </Link>
              <Link to="/editor/video">
                <Button size="lg" variant="outline" className="gap-2 px-8 border-accent/50 hover:bg-accent/10">
                  <Video className="w-5 h-5" />
                  Start Video Editing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">PixelForge AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PixelForge AI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
