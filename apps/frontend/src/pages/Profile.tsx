import { useState, useRef } from 'react'
import PageTransition from '../components/PageTransition'
import { useAuth } from '../auth/useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { uploadCv, getCvStatus, deleteCv } from '../api/cv'

export default function Profile() {
  const { user } = useAuth()

  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data: cvStatus } = useQuery({
    queryKey: ['cv-status'],
    queryFn: getCvStatus,
  })

  const uploadMutation = useMutation({
    mutationFn: uploadCv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cv-status'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cv-status'] })
      setFileName(null)
    },
  })

  const handleFile = (file: File | undefined) => {
    if (file && file.type === 'application/pdf') {
      setFileName(file.name)
      uploadMutation.mutate(file)
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-8 py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Profil
        </h1>

        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Şəxsi məlumat
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-text-secondary">Ad Soyad</p>
              <p className="text-sm font-medium">{user?.name}</p>
            </div>

            <div>
              <p className="text-xs text-text-secondary">Email</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            CV
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            CV-ni yüklə, AI sualları ona uyğunlaşdırsın.
          </p>

          {cvStatus?.hasCv && !fileName && (
            <div className="mt-4 flex items-center justify-between rounded-md border border-border bg-bg p-4">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  CV yüklənib
                </p>

                {cvStatus.uploadedAt && (
                  <p className="mt-1 text-xs text-text-secondary">
                    {new Date(cvStatus.uploadedAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Silinir...' : 'Sil'}
              </button>
            </div>
          )}

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleFile(e.dataTransfer.files?.[0])
            }}
            onClick={() => inputRef.current?.click()}
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed py-10 transition-colors ${
              isDragging
                ? 'border-accent bg-accent/5'
                : 'border-border'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {uploadMutation.isPending ? (
              <>
                <p className="text-sm font-medium text-text-primary">
                  CV yüklənir...
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Zəhmət olmasa gözlə
                </p>
              </>
            ) : fileName ? (
              <>
                <p className="font-mono text-sm text-text-primary">
                  {fileName}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Dəyişmək üçün klikləyin
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-text-primary">
                  PDF-i buraya sürüklə
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  və ya klikləyib seç
                </p>
              </>
            )}
          </div>

          {uploadMutation.isSuccess && (
            <p className="mt-3 text-sm text-green-600">
              CV uğurla yükləndi.
            </p>
          )}

          {uploadMutation.isError && (
            <p className="mt-3 text-sm text-red-500">
              CV yüklənərkən xəta baş verdi.
            </p>
          )}
        </div>
      </div>
    </PageTransition>
  )
}