import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Settings, Image, FileType } from 'lucide-react';
import { toast } from 'sonner';

interface ExportSettingsProps {
  onExport: (settings: ExportConfig) => void;
  type: 'image' | 'video';
}

interface ExportConfig {
  quality: string;
  format: string;
  resolution: string;
}

const imageFormats = [
  { value: 'png', label: 'PNG (Lossless)' },
  { value: 'jpg', label: 'JPEG (Smaller size)' },
  { value: 'webp', label: 'WebP (Best quality/size)' },
];

const videoFormats = [
  { value: 'mp4', label: 'MP4 (H.264)' },
  { value: 'webm', label: 'WebM (VP9)' },
  { value: 'mov', label: 'MOV (ProRes)' },
];

const imageResolutions = [
  { value: 'original', label: 'Original Size' },
  { value: '4k', label: '4K (3840 × 2160)' },
  { value: '2k', label: '2K (2560 × 1440)' },
  { value: '1080', label: 'Full HD (1920 × 1080)' },
  { value: '720', label: 'HD (1280 × 720)' },
];

const videoResolutions = [
  { value: '2160', label: '4K Ultra HD (2160p)' },
  { value: '1440', label: '2K QHD (1440p)' },
  { value: '1080', label: 'Full HD (1080p)' },
  { value: '720', label: 'HD (720p)' },
  { value: '480', label: 'SD (480p)' },
];

const qualityOptions = [
  { value: 'max', label: 'Maximum Quality' },
  { value: 'high', label: 'High Quality' },
  { value: 'medium', label: 'Balanced' },
  { value: 'low', label: 'Optimized for Web' },
];

export function ExportSettings({ onExport, type }: ExportSettingsProps) {
  const [settings, setSettings] = useState<ExportConfig>({
    quality: 'high',
    format: type === 'image' ? 'png' : 'mp4',
    resolution: type === 'image' ? 'original' : '1080',
  });

  const formats = type === 'image' ? imageFormats : videoFormats;
  const resolutions = type === 'image' ? imageResolutions : videoResolutions;

  const handleExport = () => {
    onExport(settings);
    toast.success(`Exporting ${type} with ${settings.quality} quality in ${settings.format.toUpperCase()} format`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Export Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileType className="w-4 h-4 text-muted-foreground" />
              Format
            </label>
            <Select
              value={settings.format}
              onValueChange={(value) => setSettings({ ...settings, format: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Image className="w-4 h-4 text-muted-foreground" />
              Resolution
            </label>
            <Select
              value={settings.resolution}
              onValueChange={(value) => setSettings({ ...settings, resolution: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resolutions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quality */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              Quality
            </label>
            <Select
              value={settings.quality}
              onValueChange={(value) => setSettings({ ...settings, quality: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {qualityOptions.map((q) => (
                  <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-secondary/30 text-xs text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> For social media, use HD (720p) or Full HD (1080p) with balanced quality for faster uploads.
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
