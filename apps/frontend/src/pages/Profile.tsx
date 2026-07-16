import { useState, useRef } from 'react'
import PageTransition from '../components/PageTransition'
import { useAuthStore } from '../store/authStore'

export default function Profile() {
  const user = useAuthStore((s) => s.user)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File | undefined) => {
    if (file && file.type === 'application/pdf') {
      setFileName(file.name)
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-8 py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Profil</h1>

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
              isDragging ? 'border-accent bg-accent/5' : 'border-border'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {fileName ? (
              <>
                <p className="font-mono text-sm text-text-primary">{fileName}</p>
                <p className="mt-1 text-xs text-text-secondary">Dəyişmək üçün klikləyin</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-text-primary">
                  PDF-i buraya sürüklə
                </p>
                <p className="mt-1 text-xs text-text-secondary">və ya klikləyib seç</p>
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}