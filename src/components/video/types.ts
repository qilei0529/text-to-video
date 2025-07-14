export interface VideoSettings {
  text: string
  fontSize: number
  scrollSpeed: number
  width: number
  height: number
  backgroundColor: string
  textColor: string
  fontFamily: string
  lineHeight: number
  padding: number
  duration?: number
  // Audio settings
  audioEnabled: boolean
  audioFile: File | null
  audioVolume: number
  audioStartTime: number
  audioFadeIn: boolean
  audioFadeOut: boolean
}

export interface VideoGenerationState {
  isRecording: boolean
  progress: number
  videoUrl: string | null
  previewMode: boolean
}

export interface VideoPreset {
  name: string
  width: number
  height: number
}

export const VIDEO_PRESETS: VideoPreset[] = [
  { name: "1080p", width: 1920, height: 1080 },
  { name: "720p", width: 1280, height: 720 },
  { name: "Vertical", width: 1080, height: 1920 },
]

export const FONT_FAMILIES = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Helvetica",
  "Verdana"
] as const

export type FontFamily = typeof FONT_FAMILIES[number] 