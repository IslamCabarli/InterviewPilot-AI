import { useId, type ComponentProps } from 'react'
import { cn } from '../../lib/cn'

interface FieldProps {
  label?: string
  error?: string
  hint?: string
}

const control =
  'w-full rounded-md border bg-bg px-3 text-sm text-text-primary outline-none transition-colors ' +
  'placeholder:text-text-secondary/70 focus:border-accent disabled:opacity-50'

function Message({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error)
    return (
      <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
        {error}
      </p>
    )
  if (hint)
    return (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-text-secondary">
        {hint}
      </p>
    )
  return null
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined
}

export function Input({
                        label,
                        error,
                        hint,
                        className,
                        id,
                        ...props
                      }: FieldProps & ComponentProps<'input'>) {
  const autoId = useId()
  const fieldId = id ?? autoId

  return (
    <div>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-xs font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, error, hint)}
        className={cn(control, 'h-10', error ? 'border-danger' : 'border-border', className)}
        {...props}
      />
      <Message id={fieldId} error={error} hint={hint} />
    </div>
  )
}

export function Textarea({
                           label,
                           error,
                           hint,
                           className,
                           id,
                           ...props
                         }: FieldProps & ComponentProps<'textarea'>) {
  const autoId = useId()
  const fieldId = id ?? autoId

  return (
    <div>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-xs font-medium text-text-secondary">
          {label}
        </label>
      )}
        <textarea
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(control, 'resize-none py-2', error ? 'border-danger' : 'border-border', className)}
          {...props}
        />
        <Message id={fieldId} error={error} hint={hint} />
    </div>
  )
}