import type { ComponentProps } from 'react'
import { Loader2 } from 'lucide-react'
import { buttonStyles, type ButtonSize, type ButtonVariant } from './buttonStyles'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export default function Button({
   variant,
   size,
   loading = false,
   disabled,
   className,
   children,
   type = 'button',
   ...props
 }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}