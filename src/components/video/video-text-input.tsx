"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { VideoSettings } from "./types"

interface VideoTextInputProps {
  settings: VideoSettings
  onSettingsChange: <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) => void
}

export function VideoTextInput({ settings, onSettingsChange }: VideoTextInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text-content" className="text-base font-medium">
          Article Text
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Enter the text you want to convert to video
        </p>
        <Textarea
          id="text-content"
          value={settings.text}
          onChange={(e) => onSettingsChange('text', e.target.value)}
          rows={12}
          placeholder="Enter your article text here..."
          className="min-h-[300px] resize-none"
        />
      </div>
    </div>
  )
} 