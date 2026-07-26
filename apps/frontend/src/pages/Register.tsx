import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '../lib/validation'
import { useRegister } from '../auth/queries'

export default function Register() {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data, {
      onSuccess: () => navigate('/dashboard'),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Qeydiyyat</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <input
              {...register('name')}
              placeholder="Ad Soyad"
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Şifrə"
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('password_confirmation')}
              type="password"
              placeholder="Şifrəni təsdiqlə"
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-xs text-red-500">{errors.password_confirmation.message}</p>
            )}
          </div>

          {registerMutation.isError && (
            <p className="text-xs text-red-500">Qeydiyyat uğursuz oldu. Yenidən cəhd et.</p>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-md bg-accent py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {registerMutation.isPending ? 'Göndərilir...' : 'Qeydiyyatdan keç'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Artıq hesabın var?{' '}
          <Link to="/login" className="text-accent">
            Daxil ol
          </Link>
        </p>
      </div>
    </div>
  )
}
