import { useState, useRef, useCallback } from 'react'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    if (isRecording) return

    if (!window.MediaRecorder) {
      throw new Error('MediaRecorder is not supported in this browser.')
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      const recorder = new MediaRecorder(stream)

      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()

      setIsRecording(true)
    } catch {
      throw new Error('Microphone permission denied.')
    }
  }, [isRecording])

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current

      if (!recorder) {
        reject(new Error('No active recording found.'))
        return
      }

      if (recorder.state === 'inactive') {
        reject(new Error('Recorder is already stopped.'))
        return
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        })

        recorder.stream.getTracks().forEach((track) => track.stop())

        chunksRef.current = []
        mediaRecorderRef.current = null

        setIsRecording(false)

        resolve(blob)
      }

      recorder.stop()
    })
  }, [])

  return {
    isRecording,
    startRecording,
    stopRecording,
  }
}