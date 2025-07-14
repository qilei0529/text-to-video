"use client"

import { useState } from "react"
import { useVideoRecording, useVideoSettings } from "@/hooks"
import { VideoSettingsPanel } from "@/components/video/video-settings-panel"
import { VideoPreview } from "@/components/video/video-preview"
import { VideoGenerationModal } from "@/components/video/video-generation-modal"

export default function VideoPage() {
  const {
    settings,
    updateSetting,
    resetSettings,
    isLoaded,
    isSaving
  } = useVideoSettings()

  const {
    state: generationState,
    startRecording,
    stopRecording,
    downloadVideo,
    setPreviewMode
  } = useVideoRecording()

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)

  const handleStartRecording = (canvas: HTMLCanvasElement) => {
    startRecording(canvas, settings)
  }

  const handlePreviewToggle = (active: boolean) => {
    setPreviewMode(active)
  }

  const handleOpenGenerateModal = () => {
    setIsGenerateModalOpen(true)
  }

  // Show loading state while settings are being loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading settings...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Text to Video Converter</h1>
            <p className="text-muted-foreground">
              Convert your text content into a scrolling video with customizable settings
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isSaving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Combined Settings Panel */}
        <VideoSettingsPanel
          resetSettings={resetSettings}
          settings={settings}
          onSettingsChange={updateSetting}
        />

        {/* Preview Panel Only */}
        <VideoPreview
          settings={settings}
          isPreviewActive={generationState.previewMode}
          onPreviewToggle={handlePreviewToggle}
          onOpenGenerateModal={handleOpenGenerateModal}
        />
      </div>

      {/* Video Generation Modal */}
      <VideoGenerationModal
        isOpen={isGenerateModalOpen}
        onOpenChange={setIsGenerateModalOpen}
        settings={settings}
        generationState={generationState}
        onStartRecording={handleStartRecording}
        onStopRecording={stopRecording}
        onDownloadVideo={downloadVideo}
      />
    </div>
  )
}