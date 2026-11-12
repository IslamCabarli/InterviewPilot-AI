import { useState, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { Badge, Button, Card, Eyebrow, Input, Modal, Skeleton, Textarea, ThemeToggle } from '../components/ui'
import { toast } from '../lib/toast'

const swatches = [
  'bg',
  'surface',
  'surface-muted',
  'border',
  'border-strong'
  'text-secondary',
  'text-primary',
  'accent',
  'positive',
  'danger',
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <Eyebrow className="mb-3">{title}</Eyebrow>
      <Card>{children}</Card>
    </section>
  )
}

export default function UiKit() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight">UI Kit</h1>
        <ThemeToggle />
      </div>

      <Section title="Rənglər">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {swatches.map((name) => (
            <div key={name}>
              <div
                className="h-12 rounded-md border border-border"
                style={{ backgroundColor: `var(--${name})` }}
              />
              <p className="mt-1 font-mono text-[11px] text-text-secondary">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Düymələr">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Yüklənir</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Kiçik</Button>
          <Button size="lg">
            <Plus className="h-4 w-4" aria-hidden />
            Böyük
          </Button>
        </div>
      </Section>

      <Section title="Sahələr">
        <div className="space-y-4">
          <Input label="Email" placeholder="ad@example.com" hint="İş və ya şəxsi email" />
          <Input label="Şifrə" type="password" error="Şifrə ən azı 8 simvol olmalıdır" />
          <Textarea label="Cavab" rows={3} placeholder="Cavabını yaz..." />
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="positive">Positive</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </Section>

      <Section title="Skeleton">
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
      </Section>

      <Section title="Bildiriş və dialoq">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => toast.success('Yadda saxlanıldı')}>
            Success
          </Button>
          <Button variant="secondary" onClick={() => toast.error('Cavab göndərilə bilmədi')}>
            Error
          </Button>
          <Button variant="secondary" onClick={() => toast.info('Müsahibə davam edir')}>
            Info
          </Button>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Dialoq aç
          </Button>
        </div>
      </Section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Müsahibəni bitirmək?">
        <p className="text-sm text-text-secondary">
          Müsahibə bitəcək və AI nəticəni hesablayacaq. Bu əməliyyatı geri qaytarmaq olmur.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Ləğv et
          </Button>
          <Button onClick={() => setModalOpen(false)}>Bitir</Button>
        </div>
      </Modal>
    </div>
  )
}