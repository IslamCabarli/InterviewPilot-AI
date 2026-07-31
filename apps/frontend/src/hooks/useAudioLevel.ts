import { useEffect, useRef, useState, type RefObject } from 'react'

export function useAudioLevel(audioRef: RefObject<HTMLAudioElement | null>) {
  const [level, setLevel] = useState(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const audioEl = audioRef.current
    if (!audioEl) return

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    const ctx = audioCtxRef.current

    if (!sourceRef.current) {
      sourceRef.current = ctx.createMediaElementSource(audioEl)
      analyserRef.current = ctx.createAnalyser()
      analyserRef.current.fftSize = 256
      sourceRef.current.connect(analyserRef.current)
      analyserRef.current.connect(ctx.destination)
    }

    const analyser = analyserRef.current!
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const tick = () => {
      analyser.getByteFrequencyData(dataArray)
      const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length
      setLevel(avg / 255)
      rafRef.current = requestAnimationFrame(tick)
    }

    const handlePlay = () => {
      if (ctx.state === 'suspended') ctx.resume()
      tick()
    }
    const handleStop = () => {
      cancelAnimationFrame(rafRef.current)
      setLevel(0)
    }

    audioEl.addEventListener('play', handlePlay)
    audioEl.addEventListener('pause', handleStop)
    audioEl.addEventListener('ended', handleStop)

    return () => {
      audioEl.removeEventListener('play', handlePlay)
      audioEl.removeEventListener('pause', handleStop)
      audioEl.removeEventListener('ended', handleStop)
      cancelAnimationFrame(rafRef.current)
    }
  }, [audioRef])

  return level
}