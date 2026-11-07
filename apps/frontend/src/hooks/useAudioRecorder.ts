import { useCallback, useEffect, useRef, useState } from 'react'

function stopTracks(stream: MediaStream | null | undefined) {
  stream?.getTracks().forEach((track) => track.stop())
}

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(mediaStream)
    chunksRef.current = []

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data)
    }

    recorder.start()
    recorderRef.current = recorder
    setStream(mediaStream)
    setIsRecording(true)
  }, [])

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const recorder = recorderRef.current
      if (!recorder) {
        reject(new Error('Aktiv səs yazısı yoxdur'))
        return
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        stopTracks(recorder.stream)
        recorderRef.current = null
        setStream(null)
        setIsRecording(false)
        resolve(blob)
      }

      recorder.stop()
    })
  }, [])

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current
      if (!recorder) return

      recorder.onstop = null
      if (recorder.state !== 'inactive') recorder.stop()
      stopTracks(recorder.stream)
      recorderRef.current = null
    }
  }, [])

  return { isRecording, stream, startRecording, stopRecording }
}