"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { VideoSettings, VideoGenerationState } from "./types"

interface VideoGenerationProps {
  settings: VideoSettings
  generationState: VideoGenerationState
  onStartRecording: (canvas: HTMLCanvasElement) => void
  onStopRecording: () => Promise<void>
  onDownloadVideo: () => void
}

export function VideoGeneration({
  settings,
  generationState,
  onStartRecording,
  onStopRecording,
  onDownloadVideo
}: VideoGenerationProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Generate Video
          <Badge variant="secondary" className="text-xs">
            {supportedFormat}
          </Badge>
        </CardTitle>
        <CardDescription>Create and download your video</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden canvas for recording */}
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          width={settings.width}
          height={settings.height}
        />

        {generationState.isRecording && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Recording Progress</span>
              <span>{Math.round(generationState.progress)}%</span>
            </div>
            <Progress value={generationState.progress} />
          </div>
        )}

        <div className="flex gap-2">
          {!generationState.isRecording ? (
            <Button onClick={handleStartRecording} className="flex-1">
              Generate Video {settings.audioEnabled && settings.audioFile ? '🎵' : ''}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleStopRecording} className="flex-1">
              Stop Recording
            </Button>
          )}
        </div>

        {settings.audioEnabled && settings.audioFile && !generationState.isRecording && (
          <div className="text-xs text-green-600 text-center">
            🎵 Audio will be merged with video: {settings.audioFile.name}
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
              className="w-full rounded-lg"
              style={{ aspectRatio: `${settings.width}/${settings.height}` }}
            />

            <Button onClick={onDownloadVideo} className="w-full">
              {getDownloadText()}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 