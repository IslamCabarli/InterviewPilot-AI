import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import { PageContainer, PageHeader } from '../components/shell/Page'
import { Card, Eyebrow, Switch, ThemeToggle } from '../components/ui'
import { GITHUB_URL } from '../lib/links'
import { useVoicePreference } from '../lib/voicePreference'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <Eyebrow className="mb-3">{title}</Eyebrow>
      <Card className="divide-y divide-border p-0">{children}</Card>
    </section>
  )
}

function Row({
               title,
               description,
               children,
             }: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="mt-0.5 text-xs text-text-secondary">{description}</p>}
      </div>
      <div className="min-w-0 shrink-0">{children}</div>
    </div>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const voiceEnabled = useVoicePreference((state) => state.enabled)
  const setVoiceEnabled = useVoicePreference((state) => state.setEnabled)

  return (
    <PageContainer size="sm">
      <PageHeader title="Tənzimləmələr" description="Görünüş və səs seçimlərini idarə et." />

      <div className="mt-8 space-y-8">
        <Section title="Görünüş">
          <Row title="Tema" description="İşıqlı, tünd və ya sistem seçiminə uyğun.">
            <ThemeToggle />
          </Row>
        </Section>

        <Section title="Səs">
          <Row title="AI səsi" description="İnterviewer suallarını səslə oxusun.">
            <Switch aria-label="AI səsi" checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
          </Row>
        </Section>

        <Section title="Hesab">
          <Row title="Ad">
            <span className="block max-w-48 truncate text-sm text-text-secondary">{user?.name}</span>
          </Row>
          <Row title="Email">
            <span className="block max-w-48 truncate text-sm text-text-secondary">{user?.email}</span>
          </Row>
        </Section>

        <Section title="Haqqında">
          <Row title="InterviewPilot AI" description="Açıq mənbə · MIT lisenziyası">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </Row>
        </Section>
      </div>
    </PageContainer>
  )
}