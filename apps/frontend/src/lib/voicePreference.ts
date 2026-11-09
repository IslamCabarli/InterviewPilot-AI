import { create } from 'zustand'

const STORAGE_KEY = 'voice-output'

function readEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

interface VoicePreferenceState {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
}

export const useVoicePreference = create<VoicePreferenceState>((set) => ({
  enabled: readEnabled(),
  setEnabled: (enabled) => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
    } catch {
      /* seçim yadda saxlanmadı, sessiya ərzində işləyir */
    }
    set({ enabled })
  },
}))