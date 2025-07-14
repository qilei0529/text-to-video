"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { VideoSettings, VideoGenerationState } from "./types"

interface VideoGenerationModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  settings: VideoSettings
  generationState: VideoGenerationState
  onStartRecording: (canvas: HTMLCanvasElement) => void
  onStopRecording: () => Promise<void>
  onDownloadVideo: () => void
}

export function VideoGenerationModal({
  isOpen,
  onOpenChange,
  settings,
  generationState,
  onStartRecording,
  onStopRecording,
  onDownloadVideo
}: VideoGenerationModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [supportedFormat, setSupportedFormat] = useState<string>('')

  // Check supported video format on component mount
  useEffect(() => {
    const checkFormat = () => {
      const types = [
        { mime: 'video/mp4;codecs=h264', name: 'MP4 (H.264)' },
        { mime: 'video/mp4', name: 'MP4' },
        { mime: 'video/webm;codecs=vp9', name: 'WebM (VP9)' },
        { mime: 'video/webm;codecs=vp8', name: 'WebM (VP8)' },
        { mime: 'video/webm', name: 'WebM' }
      ]

      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type.mime)) {
          setSupportedFormat(type.name)
          return
        }
      }
      setSupportedFormat('WebM (fallback)')
    }

    checkFormat()
  }, [])

  const handleStartRecording = () => {
    if (canvasRef.current) {
      onStartRecording(canvasRef.current)
    }
  }

  const handleStopRecording = async () => {
    try {
      await onStopRecording()
    } catch (error) {
      console.error('Failed to stop recording:', error)
    }
  }

  const getDownloadText = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const extension = supportedFormat.toLowerCase().includes('mp4') ? 'mp4' : 'webm'
    return `Download as text-video-${timestamp}.${extension}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Generate Video
          </DialogTitle>
          <DialogDescription>
            Create and download your scrolling text video
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hidden canvas for recording */}
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            width={settings.width}
            height={settings.height}
          />

          {generationState.isRecording && (
            <div className="flex flex-col gap-2 w-[300px]">
              <div className="flex justify-between text-sm mb-2">
                <span>Recording Progress</span>
                <span>{Math.round(generationState.progress)}%</span>
              </div>
              <Progress value={parseInt(generationState.progress.toString())} />
            </div>
          )}

          <div className="flex gap-2">
            {!generationState.isRecording ? (
              <Button onClick={handleStartRecording} className="flex-1">
                Start Recording {settings.audioEnabled && settings.audioFile ? '🎵' : ''}
                <Badge variant="secondary" className="text-xs h-4 px-1 ml-2">
                  .{supportedFormat.toLowerCase()}
                </Badge>
              </Button>
            ) : (
              <Button variant="outline" onClick={handleStopRecording} className="flex-1">
                ⏹️ Stop Recording
              </Button>
            )}
          </div>

          {settings.audioEnabled && settings.audioFile && !generationState.isRecording && (
            <div className="text-xs text-green-600 text-center">
              🎵 Audio will be merged: {settings.audioFile.name}
            </div>
          )}

          {!generationState.isRecording && !generationState.videoUrl && (
            <div className="text-xs text-muted-foreground text-center">
              {supportedFormat.includes('MP4') ? (
                <>✅ Your browser supports MP4 format</>
              ) : (
                <>ℹ️ Video will be saved as WebM format (widely supported)</>
              )}
            </div>
          )}

          {generationState.videoUrl && (
            <div className="space-y-3">
              <Alert>
                <AlertDescription>
                  Video generated successfully in {supportedFormat} format! You can preview it below and download it.
                </AlertDescription>
              </Alert>

              <video
                ref={videoRef}
                src={generationState.videoUrl}
                controls
                className="w-full max-w-[320px] mx-auto rounded-lg"
                style={{ aspectRatio: `${settings.width}/${settings.height}` }}
              />

              <Button onClick={onDownloadVideo} className="w-full">
                📥 {getDownloadText()}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 