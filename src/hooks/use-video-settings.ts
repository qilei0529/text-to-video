"use client"

import { useState, useEffect, useCallback } from 'react'
import { VideoSettings } from '../components/video/types'

const STORAGE_KEY = 'video-generator-settings'

const DEFAULT_SETTINGS: VideoSettings = {
  text: "Enter your article text here...\n\nThis is a sample text that will scroll from bottom to top in the video.\n\nYou can customize the font size, scroll speed, and other settings to create your perfect text video.",
  fontSize: 32,
  scrollSpeed: 20,
  width: 640,
  height: 400,
  backgroundColor: "#000000",
  textColor: "#ffffff",
  fontFamily: "Arial",
  lineHeight: 1.3,
  padding: 20,
  // Audio settings
  audioEnabled: false,
  audioFile: null,
  audioVolume: 50,
  audioStartTime: 0,
  audioFadeIn: false,
  audioFadeOut: false
}

export function useVideoSettings() {
  const [settings, setSettings] = useState<VideoSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedSettings = JSON.parse(stored) as VideoSettings

        // Validate that all required fields exist and merge with defaults
        const validatedSettings: VideoSettings = {
          ...DEFAULT_SETTINGS,
          ...parsedSettings
        }

        setSettings(validatedSettings)
      }
    } catch (error) {
      console.warn('Failed to load video settings from localStorage:', error)
      // Keep default settings if localStorage is corrupted
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage whenever they change
  const saveSettings = useCallback(async (newSettings: VideoSettings) => {
    setIsSaving(true)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
      // Small delay to show the saving indicator
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.warn('Failed to save video settings to localStorage:', error)
    } finally {
      setIsSaving(false)
    }
  }, [])

  // Update a specific setting
  const updateSetting = useCallback(<K extends keyof VideoSettings>(
    key: K,
    value: VideoSettings[K]
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    saveSettings(DEFAULT_SETTINGS)
  }, [saveSettings])

  // Update multiple settings at once
  const updateSettings = useCallback((newSettings: Partial<VideoSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      saveSettings(updated)
      return updated
    })
  }, [saveSettings])

  return {
    settings,
    updateSetting,
    resetSettings,
    updateSettings,
    isLoaded,
    isSaving
  }
} 