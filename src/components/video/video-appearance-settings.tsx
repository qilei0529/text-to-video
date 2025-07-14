"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VideoSettings, FONT_FAMILIES } from "./types"

interface VideoAppearanceSettingsProps {
  settings: VideoSettings
  onSettingsChange: <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) => void
}

export function VideoAppearanceSettings({ settings, onSettingsChange }: VideoAppearanceSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fontSize">Font Size</Label>
          <Input
            id="fontSize"
            type="number"
            value={settings.fontSize}
            onChange={(e) => onSettingsChange('fontSize', parseInt(e.target.value))}
            min="12"
            max="200"
          />
        </div>
        <div>
          <Label htmlFor="lineHeight">Line Height</Label>
          <Input
            id="lineHeight"
            type="number"
            step="0.1"
            value={settings.lineHeight}
            onChange={(e) => onSettingsChange('lineHeight', parseFloat(e.target.value))}
            min="1"
            max="3"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="fontFamily">Font Family</Label>
        <Select value={settings.fontFamily} onValueChange={(value) => onSettingsChange('fontFamily', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="textColor">Text Color</Label>
          <Input
            id="textColor"
            type="color"
            value={settings.textColor}
            onChange={(e) => onSettingsChange('textColor', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => onSettingsChange('backgroundColor', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="padding">Text Padding</Label>
        <Input
          id="padding"
          type="number"
          value={settings.padding}
          onChange={(e) => onSettingsChange('padding', parseInt(e.target.value))}
          min="0"
          max="200"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Space around the text edges for better visual layout (in pixels)
        </p>
      </div>
    </div>
  )
} 