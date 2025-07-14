"use client"

import { useCallback, useRef } from 'react'
import { VideoSettings } from '../components/video/types'

export function useVideoAnimation() {
  const animationRef = useRef<number>(-1)

  // Helper function to wrap text within a given width
  const wrapText = useCallback((
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)

      if (metrics.width <= maxWidth) {
        currentLine = testLine
      } else {
        // If current line is not empty, push it and start new line
        if (currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          // Single word is too long, we need to break it
          // For now, just add it as is - could be enhanced to break within word
          lines.push(word)
          currentLine = ''
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    return lines
  }, [])

  const drawFrame = useCallback((
    ctx: CanvasRenderingContext2D,
    settings: VideoSettings,
    scrollY: number
  ) => {
    const { width, height, backgroundColor, textColor, fontSize, fontFamily, lineHeight, padding } = settings

    // Clear canvas
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Set text properties
    ctx.fillStyle = textColor
    ctx.font = `${fontSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // Apply padding to the available area
    const contentWidth = width - (padding * 2)
    const contentHeight = height - (padding * 2)
    const centerX = padding + (contentWidth / 2)

    // Draw a subtle border to show the content area if padding > 0 (helpful for preview)
    if (padding > 0) {
      ctx.strokeStyle = textColor
      ctx.globalAlpha = 0.2
      ctx.lineWidth = 1
      ctx.strokeRect(padding, padding, contentWidth, contentHeight)
      ctx.globalAlpha = 1.0
    }

    // Process text with wrapping
    const inputLines = settings.text.split('\n')
    const wrappedLines: string[] = []

    // Wrap each input line to fit within content width
    inputLines.forEach(line => {
      if (line.trim() === '') {
        // Preserve empty lines
        wrappedLines.push('')
      } else {
        const wrapped = wrapText(ctx, line, contentWidth * 0.95) // Use 95% to leave some margin
        wrappedLines.push(...wrapped)
      }
    })

    const lineSpacing = fontSize * lineHeight
    const totalTextHeight = wrappedLines.length * lineSpacing

    // Calculate starting position - text should start completely below the screen
    // and scroll up until it's completely above the screen
    // As scrollY increases, text should move UP (decrease Y position)
    const startY = height - scrollY

    // Draw each wrapped line within the padded area
    wrappedLines.forEach((line, index) => {
      const y = startY + (index * lineSpacing) // Changed from minus to plus since we're now subtracting scrollY
      // Only draw if the line is within the visible area (including padding)
      if (y > -lineSpacing && y < height + lineSpacing) {
        ctx.fillText(line, centerX, y)
      }
    })

    return totalTextHeight
  }, [wrapText])

  const startAnimation = useCallback((
    canvas: HTMLCanvasElement,
    settings: VideoSettings,
    onFrame?: (scrollY: number, totalHeight: number, isComplete?: boolean) => void,
    shouldContinue?: () => boolean
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Canvas dimensions are now set in the preview component to prevent size jumps
    // No need to set them here again

    // Calculate total text height for proper animation bounds
    const inputLines = settings.text.split('\n')
    const wrappedLines: string[] = []

    // We need to set the font to measure text properly
    ctx.font = `${settings.fontSize}px ${settings.fontFamily}`

    inputLines.forEach(line => {
      if (line.trim() === '') {
        wrappedLines.push('')
      } else {
        const contentWidth = settings.width - (settings.padding * 2)
        const wrapped = wrapText(ctx, line, contentWidth * 0.95)
        wrappedLines.push(...wrapped)
      }
    })

    const lineSpacing = settings.fontSize * settings.lineHeight
    const totalTextHeight = wrappedLines.length * lineSpacing

    // Start with text completely below the screen
    let scrollY = -settings.padding

    // End when text has completely scrolled off the top
    // With the new formula (startY = height - scrollY), we need:
    // - Text starts below: height - (-padding) = height + padding
    // - Text ends above: height - endScrollY should be negative
    // So endScrollY should be height + totalTextHeight + padding
    const endScrollY = settings.height + totalTextHeight + settings.padding

    const animate = () => {
      const currentTotalHeight = drawFrame(ctx, settings, scrollY)

      // Check if animation is complete
      const isComplete = scrollY >= endScrollY

      onFrame?.(scrollY, currentTotalHeight, isComplete)

      if (!isComplete && shouldContinue?.() !== false) {
        scrollY += settings.scrollSpeed / 10
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()
  }, [drawFrame, wrapText])

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return {
    startAnimation,
    stopAnimation,
    drawFrame
  }
} 