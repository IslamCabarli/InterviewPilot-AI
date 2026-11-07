import { Eyebrow } from '../ui'

const steps = [
  {
    title: 'Növ və çətinliyi seç',
    text: 'Backend, Frontend, DevOps, System Design və ya HR. Easy-dən Senior-a qədər.',
  },
  {
    title: 'Müsahibəni keçir',
    text: 'AI bir-bir sual verir və cavabına görə əlavə suallar soruşur.',
  },
  {
    title: 'Hesabatı oxu',
    text: 'Bal, zəif nöqtələr və növbəti addımlar bir səhifədə hazır olur.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-t border-border bg-surface-muted/50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Necə işləyir</Eyebrow>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight">
          Üç addımda real müsahibə təcrübəsi
        </h2>

        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-border pt-5">
              <p className="font-mono text-xs text-accent">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 font-display text-base font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}