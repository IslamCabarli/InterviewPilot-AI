import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { GITHUB_URL } from '../../lib/links'
import { Badge } from '../ui'
import { buttonStyles } from '../ui/buttonStyles'
import HeroPreview from './HeroPreview'

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge tone="accent">Açıq mənbə · Lokal işləyir</Badge>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Texniki müsahibəyə AI müsahibəçi ilə hazırlaş
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary">
            Səslə danış, AI real vaxtda sual versin, cavabını qiymətləndirsin və sonda ətraflı hesabat
            hazırlasın. Hamısı sənin kompüterində işləyir: API açarı da, abunə də yoxdur.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/register" className={buttonStyles({ size: 'lg' })}>
              Pulsuz başla
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles({ variant: 'secondary', size: 'lg' })}
            >
              GitHub-da bax
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>

          <p className="mt-8 font-mono text-xs text-text-secondary">
            Laravel 13 · React 19 · Ollama · Whisper · Piper
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  )
}