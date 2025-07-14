"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VideoSettings } from "./types"

interface VideoAnimationSettingsProps {
  settings: VideoSettings
  onSettingsChange: <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) => void
}

export function VideoAnimationSettings({ settings, onSettingsChange }: VideoAnimationSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="scrollSpeed">Scroll Speed</Label>
        <Input
          id="scrollSpeed"
          type="number"
          value={settings.scrollSpeed}
          onChange={(e) => onSettingsChange('scrollSpeed', parseInt(e.target.value))}
          min="10"
          max="200"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Higher values = faster scrolling
        </p>
      </div>
    </div>
  )
} 