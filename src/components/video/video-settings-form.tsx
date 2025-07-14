"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoSettings } from "./types"
import { VideoAppearanceSettings } from "./video-appearance-settings"
import { VideoAnimationSettings } from "./video-animation-settings"
import { VideoDimensionsSettings } from "./video-dimensions-settings"
import { VideoAudioSettings } from "./video-audio-settings"

interface VideoSettingsFormProps {
  settings: VideoSettings
  onSettingsChange: <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) => void
}

export function VideoSettingsForm({ settings, onSettingsChange }: VideoSettingsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-1">Video Customization</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize your video appearance and behavior
        </p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="animation">Animation</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="mt-4">
          <VideoAppearanceSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </TabsContent>

        <TabsContent value="animation" className="mt-4">
          <VideoAnimationSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </TabsContent>

        <TabsContent value="dimensions" className="mt-4">
          <VideoDimensionsSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </TabsContent>

        <TabsContent value="audio" className="mt-4">
          <VideoAudioSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 