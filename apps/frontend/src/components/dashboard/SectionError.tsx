import { AlertCircle } from 'lucide-react'
import { Button, Card } from '../ui'

interface SectionErrorProps {
  message: string
  onRetry: () => void
  retrying?: boolean
}

export default function SectionError({ message, onRetry, retrying }: SectionErrorProps) {
  return (
    <Card role="alert" className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-4 w-4 shrink-0 text-danger" aria-hidden />
        <p className="text-sm">{message}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={onRetry} loading={retrying}>
        Yenidən yoxla
      </Button>
    </Card>
  )
}