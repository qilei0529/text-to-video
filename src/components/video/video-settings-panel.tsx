"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoSettings } from "./types"
import { VideoTextInput } from "./video-text-input"
import { VideoSettingsForm } from "./video-settings-form"

interface VideoSettingsPanelProps {
  settings: VideoSettings
  onSettingsChange: <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) => void
  resetSettings: () => void
}

export function VideoSettingsPanel({ settings, onSettingsChange, resetSettings }: VideoSettingsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Video Configuration</CardTitle>
            <CardDescription>
              Configure your text content and video Settings
            </CardDescription>
          </div>
          <button
            onClick={resetSettings}
            className="text-sm text-blue-500 hover:text-foreground underline ml-4 mt-1"
          >
            Reset to Defaults
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Content</TabsTrigger>
            <TabsTrigger value="settings">Video Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-6">
            <VideoTextInput
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <VideoSettingsForm
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 