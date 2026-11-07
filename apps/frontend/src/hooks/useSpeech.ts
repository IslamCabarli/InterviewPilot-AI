import { useCallback, useEffect, useRef, useState } from 'react'
import { synthesizeSpeech } from '../api/speech'

const STORAGE_KEY = 'voice-output'

function readEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

export function useSpeech() {
  const [enabled, setEnabled] = useState(readEnabled)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const enabledRef = useRef(enabled)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)
  const requestRef = useRef(0)

  const releaseUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
  }, [])

  const teardown = useCallback(() => {
    requestRef.current += 1
    audioRef.current?.pause()
    releaseUrl()
  }, [releaseUrl])

  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current

    const audio = new Audio()
    audio.addEventListener('play', () => setIsSpeaking(true))
    audio.addEventListener('pause', () => setIsSpeaking(false))
    audio.addEventListener('error', () => setIsSpeaking(false))
    audio.addEventListener('ended', () => {
      setIsSpeaking(false)
      releaseUrl()
    })
    audioRef.current = audio
    return audio
  }, [releaseUrl])

  const speak = useCallback(
    async (text: string) => {
      if (!enabledRef.current || !text.trim()) return

      teardown()
      const requestId = requestRef.current

      try {
        const url = await synthesizeSpeech(text)
        if (requestId !== requestRef.current) {
          URL.revokeObjectURL(url)
          return
        }

        urlRef.current = url
        const audio = getAudio()
        audio.src = url
        await audio.play()
      } catch {
        // TTS servisi işləmir və ya brauzer avtomatik oxutmanı blokladı: səssiz davam edirik
        setIsSpeaking(false)
      }
    },
    [getAudio, teardown],
  )

  const stop = useCallback(() => {
    teardown()
    setIsSpeaking(false)
  }, [teardown])

  const toggle = useCallback(() => {
    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)

    try {
      localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
    } catch {
      /* seçim yadda saxlanmadı, sessiya ərzində işləyir */
    }

    if (!next) stop()
  }, [stop])

  useEffect(() => {
    return () => teardown()
  }, [teardown])

  return { enabled, isSpeaking, speak, stop, toggle }
}