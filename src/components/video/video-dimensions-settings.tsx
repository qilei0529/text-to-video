"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { VideoSettings, VIDEO_PRESETS } from "./types"

interface VideoDimensionsSettingsProps {
  settings: VideoSettings
  onSettingsChange: <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) => void
}

export function VideoDimensionsSettings({ settings, onSettingsChange }: VideoDimensionsSettingsProps) {
  const applyPreset = (width: number, height: number) => {
    onSettingsChange('width', width)
    onSettingsChange('height', height)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width (px)</Label>
          <Input
            id="width"
            type="number"
            value={settings.width}
            onChange={(e) => onSettingsChange('width', parseInt(e.target.value))}
            min="640"
            max="3840"
          />
        </div>
        <div>
          <Label htmlFor="height">Height (px)</Label>
          <Input
            id="height"
            type="number"
            value={settings.height}
            onChange={(e) => onSettingsChange('height', parseInt(e.target.value))}
            min="480"
            max="2160"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {VIDEO_PRESETS.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => applyPreset(preset.width, preset.height)}
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  )
} 