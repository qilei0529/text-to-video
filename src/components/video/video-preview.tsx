"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoSettings } from "./types"
import { useVideoAnimation } from "@/hooks/use-video-animation"

interface VideoPreviewProps {
  settings: VideoSettings
  isPreviewActive: boolean
  onPreviewToggle: (active: boolean) => void
  onOpenGenerateModal: () => void
}

export function VideoPreview({ settings, isPreviewActive, onPreviewToggle, onOpenGenerateModal }: VideoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { startAnimation, stopAnimation } = useVideoAnimation()
  const [hasCompleted, setHasCompleted] = useState(false)

  // Set canvas dimensions whenever settings change to prevent size jumps
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = settings.width
      canvasRef.current.height = settings.height
    }
  }, [settings.width, settings.height])

  useEffect(() => {
    setHasCompleted(false) // Reset completion state when settings change
  }, [settings])

  useEffect(() => {
    if (isPreviewActive && canvasRef.current) {
      setHasCompleted(false)
      startAnimation(
        canvasRef.current,
        settings,
        (scrollY, totalHeight, isComplete) => {
          // Stop preview when animation is complete
          if (isComplete) {
            setHasCompleted(true)
            onPreviewToggle(false)
          }
        },
        () => isPreviewActive
      )
    } else {
      stopAnimation()
    }

    return () => stopAnimation()
  }, [isPreviewActive, settings, startAnimation, stopAnimation, onPreviewToggle])

  const handlePreviewToggle = () => {
    if (hasCompleted) {
      setHasCompleted(false)
    }
    onPreviewToggle(!isPreviewActive)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how your video will look</CardDescription>
          </div>
          <Button
            onClick={onOpenGenerateModal}
            size="sm"
            className="shrink-0"
          >
            🎬 Generate Video
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border rounded-lg bg-black mx-auto"
            style={{
              aspectRatio: `${settings.width}/${settings.height}`,
              // Display at actual size when it fits, but scale down for very large dimensions
              maxHeight: `min(${settings.height}px, 600px)`,
              maxWidth: `min(${settings.width}px, 100%)`,
              height: 'auto',
              width: 'auto'
            }}
          />

          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Button
                onClick={handlePreviewToggle}
                variant={isPreviewActive ? "outline" : "default"}
                className="flex-1"
              >
                {isPreviewActive ? "Stop Preview" : hasCompleted ? "Restart Preview" : "Start Preview"}
              </Button>
            </div>

            {hasCompleted && (
              <div className="text-sm text-green-600 text-center">
                ✅ Preview completed! Text scrolled from bottom to top.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 