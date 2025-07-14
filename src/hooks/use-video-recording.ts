"use client"

import { useCallback, useRef, useState } from 'react'
import { VideoSettings, VideoGenerationState } from '../components/video/types'
import { useVideoAnimation } from './use-video-animation'

export function useVideoRecording() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const { drawFrame } = useVideoAnimation()

  const [state, setState] = useState<VideoGenerationState>({
    isRecording: false,
    progress: 0,
    videoUrl: null,
    previewMode: false
  })

  // Check what video formats are supported
  const getSupportedMimeType = useCallback(() => {
    const types = [
      'video/mp4;codecs=h264',
      'video/mp4',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm'
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    // Fallback to basic webm
    return 'video/webm'
  }, [])

  const startRecording = useCallback(async (
    canvas: HTMLCanvasElement,
    settings: VideoSettings
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = settings.width
    canvas.height = settings.height

    // Get the best supported video format
    const mimeType = getSupportedMimeType()

    // Create video stream from canvas
    const videoStream = canvas.captureStream(30) // 30 FPS

    // Create combined stream with audio if enabled
    let finalStream = videoStream

    if (settings.audioEnabled && settings.audioFile) {
      try {
        // Create audio context for processing
        const audioContext = new AudioContext()
        audioContextRef.current = audioContext

        // Load and decode audio file
        const audioBuffer = await settings.audioFile.arrayBuffer()
        const decodedAudio = await audioContext.decodeAudioData(audioBuffer)

        // Create audio source and gain nodes for volume control
        const audioSource = audioContext.createBufferSource()
        const gainNode = audioContext.createGain()
        const destination = audioContext.createMediaStreamDestination()

        audioSource.buffer = decodedAudio
        audioSource.connect(gainNode)
        gainNode.connect(destination)

        // Apply volume setting
        gainNode.gain.value = settings.audioVolume / 100

        // Apply fade effects if enabled
        const currentTime = audioContext.currentTime
        if (settings.audioFadeIn) {
          gainNode.gain.setValueAtTime(0, currentTime)
          gainNode.gain.linearRampToValueAtTime(settings.audioVolume / 100, currentTime + 2) // 2 second fade in
        }

        if (settings.audioFadeOut && decodedAudio.duration > 2) {
          const fadeOutTime = currentTime + decodedAudio.duration - 2 // 2 seconds before end
          gainNode.gain.setValueAtTime(settings.audioVolume / 100, fadeOutTime)
          gainNode.gain.linearRampToValueAtTime(0, currentTime + decodedAudio.duration)
        }

        // Start audio with delay if specified
        audioSource.start(currentTime + settings.audioStartTime)

        // Combine video and audio streams
        const combinedStream = new MediaStream()

        // Add video tracks
        videoStream.getVideoTracks().forEach(track => {
          combinedStream.addTrack(track)
        })

        // Add audio tracks
        destination.stream.getAudioTracks().forEach(track => {
          combinedStream.addTrack(track)
        })

        finalStream = combinedStream

      } catch (error) {
        console.error('Failed to process audio:', error)
        // Fall back to video-only if audio processing fails
        finalStream = videoStream
      }
    }

    // Setup MediaRecorder with the final stream (video + audio or video only)
    const mediaRecorder = new MediaRecorder(finalStream, {
      mimeType: mimeType
    })

    mediaRecorderRef.current = mediaRecorder
    recordedChunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = async () => {
      // Clean up audio context if it exists
      if (audioContextRef.current) {
        await audioContextRef.current.close()
        audioContextRef.current = null
      }

      const blob = new Blob(recordedChunksRef.current, { type: mimeType })
      const url = URL.createObjectURL(blob)
      setState(prev => ({
        ...prev,
        videoUrl: url,
        isRecording: false,
        progress: 100
      }))
    }

    setState(prev => ({
      ...prev,
      isRecording: true,
      progress: 0
    }))

    mediaRecorder.start()

    // Calculate animation duration based on total scroll distance
    const inputLines = settings.text.split('\n')
    const wrappedLines: string[] = []

    // We need to calculate wrapped lines to get accurate text height
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    if (tempCtx) {
      tempCtx.font = `${settings.fontSize}px ${settings.fontFamily}`
      const contentWidth = settings.width - (settings.padding * 2)

      inputLines.forEach(line => {
        if (line.trim() === '') {
          wrappedLines.push('')
        } else {
          // Simple text wrapping calculation for duration
          const words = line.split(' ')
          let currentLine = ''

          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word
            const metrics = tempCtx.measureText(testLine)

            if (metrics.width <= contentWidth * 0.95) {
              currentLine = testLine
            } else {
              if (currentLine) {
                wrappedLines.push(currentLine)
                currentLine = word
              } else {
                wrappedLines.push(word)
                currentLine = ''
              }
            }
          }

          if (currentLine) {
            wrappedLines.push(currentLine)
          }
        }
      })
    }

    const lineSpacing = settings.fontSize * settings.lineHeight
    const totalTextHeight = wrappedLines.length * lineSpacing

    // Calculate total scroll distance: from below screen to above screen
    // With corrected formula (startY = height - scrollY):
    const totalScrollDistance = settings.height + totalTextHeight + (settings.padding * 2)
    const duration = (totalScrollDistance / (settings.scrollSpeed / 10)) * (1000 / 60) // Convert to milliseconds (assuming 60fps)

    let scrollY = -settings.padding
    const endScrollY = settings.height + totalTextHeight + settings.padding
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progressPercent = Math.min((scrollY - (-settings.padding)) / (endScrollY - (-settings.padding)) * 100, 100)

      setState(prev => ({
        ...prev,
        progress: progressPercent
      }))

      drawFrame(ctx, settings, scrollY)
      scrollY += settings.scrollSpeed / 10

      // Stop when animation is complete or time limit reached
      if (scrollY < endScrollY && elapsed < duration * 2) { // *2 as safety margin
        requestAnimationFrame(animate)
      } else {
        mediaRecorder.stop()
      }
    }

    animate()
  }, [drawFrame, getSupportedMimeType])

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop()
    }

    // Clean up audio context if still active
    if (audioContextRef.current) {
      await audioContextRef.current.close()
      audioContextRef.current = null
    }
  }, [state.isRecording])

  const downloadVideo = useCallback(() => {
    if (!state.videoUrl) return

    // Create a timestamp for unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

    // Determine file extension based on the blob type
    const mimeType = getSupportedMimeType()
    const extension = mimeType.includes('mp4') ? 'mp4' : 'webm'
    const filename = `text-video-${timestamp}.${extension}`

    const a = document.createElement('a')
    a.href = state.videoUrl
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a)
    }, 100)
  }, [state.videoUrl, getSupportedMimeType])

  const setPreviewMode = useCallback((previewMode: boolean) => {
    setState(prev => ({ ...prev, previewMode }))
  }, [])

  return {
    state,
    startRecording,
    stopRecording,
    downloadVideo,
    setPreviewMode
  }
} 