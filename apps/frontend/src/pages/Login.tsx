import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router'
import { LoginSchema, type LoginInput } from '../lib/validation'
import { useLogin } from '../auth/queries'

export default function Login() {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) })

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate('/dashboard'),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold">Daxil ol</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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

          {loginMutation.isError && (
            <p className="text-xs text-red-500">Email və ya şifrə yanlışdır.</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-md bg-accent py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {loginMutation.isPending ? 'Yoxlanılır...' : 'Daxil ol'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Hesabın yoxdur?{' '}
          <Link to="/register" className="text-accent">
            Qeydiyyatdan keç
          </Link>
        </p>
      </div>
    </div>
  )
}
