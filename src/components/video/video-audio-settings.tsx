"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { VideoSettings } from "./types"
import { useRef } from "react"

interface VideoAudioSettingsProps {
  settings: VideoSettings
  onSettingsChange: <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) => void
}

export function VideoAudioSettings({ settings, onSettingsChange }: VideoAudioSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    onSettingsChange('audioFile', file)
    if (file) {
      onSettingsChange('audioEnabled', true)
    }
  }

  const handleRemoveAudio = () => {
    onSettingsChange('audioFile', null)
    onSettingsChange('audioEnabled', false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="audioEnabled"
            checked={settings.audioEnabled}
            onCheckedChange={(checked) => onSettingsChange('audioEnabled', !!checked)}
          />
          <Label htmlFor="audioEnabled">Enable Audio</Label>
        </div>

        <div className="space-y-2">
          <Label>Audio File</Label>
          <div className="flex items-center space-x-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              disabled={!settings.audioEnabled}
              className="flex-1"
            />
            {settings.audioFile && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveAudio}
                disabled={!settings.audioEnabled}
              >
                Remove
              </Button>
            )}
          </div>
          {settings.audioFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {settings.audioFile.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="audioVolume">Volume: {settings.audioVolume}%</Label>
          <Input
            id="audioVolume"
            type="range"
            min="0"
            max="100"
            value={settings.audioVolume}
            onChange={(e) => onSettingsChange('audioVolume', Number(e.target.value))}
            disabled={!settings.audioEnabled}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audioStartTime">Start Time (seconds)</Label>
          <Input
            id="audioStartTime"
            type="number"
            min="0"
            step="0.1"
            value={settings.audioStartTime}
            onChange={(e) => onSettingsChange('audioStartTime', Number(e.target.value))}
            disabled={!settings.audioEnabled}
            placeholder="0"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="audioFadeIn"
              checked={settings.audioFadeIn}
              onCheckedChange={(checked) => onSettingsChange('audioFadeIn', !!checked)}
              disabled={!settings.audioEnabled}
            />
            <Label htmlFor="audioFadeIn">Fade In</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="audioFadeOut"
              checked={settings.audioFadeOut}
              onCheckedChange={(checked) => onSettingsChange('audioFadeOut', !!checked)}
              disabled={!settings.audioEnabled}
            />
            <Label htmlFor="audioFadeOut">Fade Out</Label>
          </div>
        </div>
      </div>
    </div>
  )
} 