import { useState, type DragEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Loader2, Trash2, Upload } from 'lucide-react'
import { deleteCv, getCvStatus, uploadCv } from '../api/cv'
import { useAuth } from '../auth/useAuth'
import { PageContainer, PageHeader } from '../components/shell/Page'
import { Badge, Button, Card, Eyebrow, Modal, Skeleton } from '../components/ui'
import { cn } from '../lib/cn'
import { getApiErrorMessage } from '../lib/errors'
import { getInitials } from '../lib/initials'
import { toast } from '../lib/toast'
import { formatDate } from '../lib/dates'

const MAX_CV_BYTES = 5 * 1024 * 1024

function isPdf(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export default function Profile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isDragging, setIsDragging] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: cv, isLoading } = useQuery({ queryKey: ['cv-status'], queryFn: getCvStatus })
  const uploadedOn = formatDate(cv?.uploadedAt, { year: true })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadCv(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cv-status'] })
      toast.success('CV yükləndi. Suallar indi təcrübənə uyğunlaşdırıla bilər.')
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, 'CV yüklənə bilmədi. Faylın PDF və 5 MB-dan kiçik olduğunu yoxla.'),
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteCv(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cv-status'] })
      setConfirmOpen(false)
      toast.success('CV silindi.')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'CV silinə bilmədi. Yenidən cəhd et.'))
    },
  })

  const handleFile = (file: File | undefined) => {
    if (!file) return

    if (!isPdf(file)) {
      toast.error('Yalnız PDF faylı yükləmək olar.')
      return
    }
    if (file.size > MAX_CV_BYTES) {
      toast.error('Fayl 5 MB-dan böyük ola bilməz.')
      return
    }

    uploadMutation.mutate(file)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleFile(event.dataTransfer.files?.[0])
  }

  const uploading = uploadMutation.isPending

  return (
    <PageContainer size="sm">
      <PageHeader title="Profil" description="Hesab məlumatların və CV-n." />

      <div className="mt-8 space-y-6">
        <Card className="flex items-center gap-4">
          <div
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted font-display text-base font-semibold"
          >
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="mt-0.5 truncate text-sm text-text-secondary">{user?.email}</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <Eyebrow>CV</Eyebrow>
            {cv?.hasCv && <Badge tone="positive">Aktiv</Badge>}
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            CV-ni yüklə, AI müsahibə sualları təcrübənə və layihələrinə uyğun olsun.
          </p>

          {isLoading ? (
            <Skeleton className="mt-4 h-14 w-full" />
          ) : (
            cv?.hasCv && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-border bg-surface-muted px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">CV yüklənib</p>
                    <p className="truncate text-xs text-text-secondary">
                      {uploadedOn ? `Yükləmə tarixi: ${uploadedOn}` : 'Suallar CV-yə uyğunlaşdırıla bilər'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Sil
                </Button>
              </div>
            )
          )}

          <label
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false)
            }}
            onDrop={handleDrop}
            className={cn(
              'mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-10 text-center transition-colors',
              'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
              isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50',
              uploading && 'pointer-events-none opacity-60',
            )}
          >
            <input
              type="file"
              accept="application/pdf,.pdf"
              aria-label="CV faylı (PDF)"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                handleFile(event.target.files?.[0])
                event.target.value = ''
              }}
            />
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-text-secondary" aria-hidden />
            ) : (
              <Upload className="h-5 w-5 text-text-secondary" aria-hidden />
            )}
            <span className="text-sm font-medium">
              {uploading ? 'Yüklənir...' : cv?.hasCv ? 'Yeni PDF ilə əvəz et' : 'PDF-i buraya sürüklə'}
            </span>
            <span className="text-xs text-text-secondary">və ya klikləyib seç · maksimum 5 MB</span>
          </label>
        </Card>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="CV-ni silmək?">
        <p className="text-sm leading-relaxed text-text-secondary">
          CV silinəcək və suallar artıq təcrübənə uyğunlaşdırılmayacaq. İstədiyin vaxt yenisini yükləyə bilərsən.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={deleteMutation.isPending}>
            Ləğv et
          </Button>
          <Button variant="danger" onClick={() => deleteMutation.mutate()} loading={deleteMutation.isPending}>
            Sil
          </Button>
        </div>
      </Modal>
    </PageContainer>
  )
}