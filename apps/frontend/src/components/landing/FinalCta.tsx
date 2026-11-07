import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '../ui'
import { buttonStyles } from '../ui/buttonStyles'

export default function FinalCta() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Card className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Növbəti müsahibəyə hazır ol
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Qeydiyyat bir dəqiqə çəkir. Kart və API açarı lazım deyil.
            </p>
          </div>
          <Link to="/register" className={buttonStyles({ size: 'lg' })}>
            İlk müsahibəni başlat
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Card>
      </div>
    </section>
  )
}