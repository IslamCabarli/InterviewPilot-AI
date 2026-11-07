import { Cpu, FileText, Flame, Gauge, Lock, Mic, type LucideIcon } from 'lucide-react'
import { Card, Eyebrow } from '../ui'

const features: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Mic,
    title: 'Səsli müsahibə',
    text: 'Cavablarını danış, AI səni dinləyib səsli cavab versin. İstəsən yaza da bilərsən.',
  },
  {
    icon: Cpu,
    title: 'Lokal AI',
    text: 'Model Ollama ilə sənin kompüterində işləyir. Bulud xərci və API açarı yoxdur.',
  },
  {
    icon: FileText,
    title: 'CV-yə uyğun suallar',
    text: 'CV-ni yüklə, suallar real təcrübən və layihələrin əsasında qurulsun.',
  },
  {
    icon: Gauge,
    title: 'Ətraflı hesabat',
    text: 'Bal bölgüsü, güclü və zəif tərəflər, öyrənməli mövzular bir səhifədə.',
  },
  {
    icon: Flame,
    title: 'İrəliləyişin izlənir',
    text: 'XP, səviyyələr, gündəlik seriya və nailiyyətlər motivasiyanı saxlayır.',
  },
  {
    icon: Lock,
    title: 'Məlumatların səndə qalır',
    text: 'Səs, CV və cavablar üçüncü tərəfə göndərilmir, hamısı öz mühitində qalır.',
  },
]

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Xüsusiyyətlər</Eyebrow>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight">
          Hazırlaşmaq üçün lazım olan hər şey
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-muted text-accent">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}