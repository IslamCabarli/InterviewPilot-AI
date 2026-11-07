import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { getCvStatus } from '../../api/cv'
import { startInterview } from '../../api/interview'
import { cn } from '../../lib/cn'
import { getApiErrorMessage } from '../../lib/errors'
import PageTransition from '../PageTransition'
import { Button, Card, Eyebrow } from '../ui'
import OptionCard from './OptionCard'
import { difficulties, getDifficultyLabel, getTypeLabel, interviewTypes } from './options'
import { seedFromStart } from './seed'
import type { SessionSeed } from './types'

const STEPS = [
  {
    label: 'Növ',
    title: 'Müsahibə növünü seç',
    description: 'AI sualları seçdiyin sahəyə uyğun verəcək.',
  },
  {
    label: 'Çətinlik',
    title: 'Çətinlik səviyyəsini seç',
    description: 'Hazırlıq səviyyənə uyğun olanı seç.',
  },
  {
    label: 'Başla',
    title: 'Hər şey hazırdır',
    description: 'Seçimlərini yoxla və müsahibəni başlat.',
  },
] as const

const LAST_STEP = STEPS.length - 1

interface StartInput {
  type: string
  difficulty: string
  useCv: boolean
}

function LevelDots({ level }: { level: number }) {
  return (
    <span aria-hidden className="flex items-center gap-1">
      {Array.from({ length: 4 }, (_, index) => (
        <span
          key={index}
          className={cn('h-1.5 w-1.5 rounded-full', index < level ? 'bg-accent' : 'bg-border')}
        />
      ))}
    </span>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  )
}

export default function InterviewSetup({ onStarted }: { onStarted: (seed: SessionSeed) => void }) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState(0)
  const [type, setType] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<string | null>(null)
  const [cvChoice, setCvChoice] = useState<boolean | null>(null)

  const { data: cvStatus } = useQuery({ queryKey: ['cv-status'], queryFn: getCvStatus })
  const hasCv = cvStatus?.hasCv ?? false
  const useCv = hasCv && (cvChoice ?? true)

  const startMutation = useMutation({
    mutationFn: ({ type, difficulty, useCv }: StartInput) => startInterview(type, difficulty, useCv),
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ['active-interview'] })
      onStarted(seedFromStart(data.interview, data.question))
    },
  })

  const pending = startMutation.isPending
  const canContinue = step === 0 ? type !== null : step === 1 ? difficulty !== null : true
  const current = STEPS[step]

  const handleStart = () => {
    if (!type || !difficulty) return
    startMutation.mutate({ type, difficulty, useCv })
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Yeni müsahibə</h1>

        <ol aria-label="Addımlar" className="mt-8 grid grid-cols-3 gap-3">
          {STEPS.map((item, index) => (
            <li key={item.label} aria-current={index === step ? 'step' : undefined}>
              <span
                className={cn(
                  'block h-0.5 rounded-full transition-colors',
                  index <= step ? 'bg-accent' : 'bg-border',
                )}
              />
              <span
                className={cn(
                  'mt-2 block font-mono text-xs',
                  index === step ? 'text-text-primary' : 'text-text-secondary',
                )}
              >
                {String(index + 1).padStart(2, '0')} · {item.label}
              </span>
            </li>
          ))}
        </ol>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-10"
        >
          <Eyebrow>{`Addım ${step + 1} / ${STEPS.length}`}</Eyebrow>
          <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">{current.title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{current.description}</p>

          <div className="mt-6">
            {step === 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {interviewTypes.map((item) => (
                  <OptionCard
                    key={item.value}
                    selected={type === item.value}
                    onSelect={() => setType(item.value)}
                    title={item.label}
                    description={item.description}
                    icon={item.icon}
                  />
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {difficulties.map((item) => (
                  <OptionCard
                    key={item.value}
                    selected={difficulty === item.value}
                    onSelect={() => setDifficulty(item.value)}
                    title={item.label}
                    description={item.description}
                    meta={<LevelDots level={item.level} />}
                  />
                ))}
              </div>
            )}

            {step === LAST_STEP && (
              <Card className="divide-y divide-border p-0">
                <dl>
                  <SummaryRow label="Növ" value={type ? getTypeLabel(type) : '—'} />
                  <SummaryRow label="Çətinlik" value={difficulty ? getDifficultyLabel(difficulty) : '—'} />
                </dl>

                {hasCv ? (
                  <label className="flex cursor-pointer items-start gap-3 px-5 py-4">
                    <input
                      type="checkbox"
                      checked={useCv}
                      onChange={(event) => setCvChoice(event.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
                    />
                    <span>
                      <span className="block text-sm font-medium">Sualları CV-mə uyğunlaşdır</span>
                      <span className="mt-0.5 block text-xs text-text-secondary">
                        AI təcrübən və layihələrin əsasında suallar verəcək.
                      </span>
                    </span>
                  </label>
                ) : (
                  <p className="px-5 py-4 text-xs text-text-secondary">
                    CV yükləsən, suallar təcrübənə uyğunlaşdırıla bilər.{' '}
                    <Link to="/profile" className="font-medium text-accent hover:underline">
                      Profilə keç
                    </Link>
                  </p>
                )}
              </Card>
            )}
          </div>

          {startMutation.isError && (
            <p role="alert" className="mt-4 text-sm text-danger">
              {getApiErrorMessage(
                startMutation.error,
                'Müsahibəni başlatmaq mümkün olmadı.',
                'AI xidməti cavab vermir. Ollama-nın işlədiyinə əmin ol.',
              )}
            </p>
          )}

          {pending && (
            <p role="status" className="mt-4 text-sm text-text-secondary">
              İnterviewer ilk sualı hazırlayır. Bu bir neçə saniyə çəkə bilər.
            </p>
          )}
        </motion.div>

        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((value) => value - 1)}
            disabled={step === 0 || pending}
            className={cn(step === 0 && 'invisible')}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Geri
          </Button>

          {step < LAST_STEP ? (
            <Button onClick={() => setStep((value) => value + 1)} disabled={!canContinue}>
              Davam et
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          ) : (
            <Button size="lg" onClick={handleStart} loading={pending}>
              Müsahibəyə başla
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}