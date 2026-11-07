import { useEffect, useRef } from 'react'

const BAR_COUNT = 28

export default function Waveform({ stream }: { stream: MediaStream | null }) {
  const barsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!stream) return

    const context = new AudioContext()
    const source = context.createMediaStreamSource(stream)
    const analyser = context.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.75
    source.connect(analyser)

    const data = new Uint8Array(analyser.frequencyBinCount)
    const usableBins = Math.floor(data.length * 0.6)
    let frame = 0

    const draw = () => {
      analyser.getByteFrequencyData(data)

      barsRef.current.forEach((bar, index) => {
        if (!bar) return
        const level = data[Math.floor((index / BAR_COUNT) * usableBins)] / 255
        bar.style.transform = `scaleY(${Math.min(1, Math.max(0.12, level * 1.4))})`
      })

      frame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(frame)
      source.disconnect()
      void context.close()
    }
  }, [stream])

  return (
    <div aria-hidden className="flex h-8 flex-1 items-center justify-center gap-[3px]">
      {Array.from({ length: BAR_COUNT }, (_, index) => (
        <span
          key={index}
          ref={(element) => {
            barsRef.current[index] = element
          }}
          className="h-full w-[3px] rounded-full bg-danger"
          style={{ transform: 'scaleY(0.12)' }}
        />
      ))}
    </div>
  )
}