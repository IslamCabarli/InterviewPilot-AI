import { useNavigate, Link } from 'react-router'
import { useAuthStore } from '../store/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '../lib/validation'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { loginUser } from '../api/auth'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate('/dashboard')
    },
  })

  const onSubmit = (data: LoginInput) => mutation.mutate(data)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-xl bg-gray-900 p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-semibold text-white">Daxil ol</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Şifrə"
              className="w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {mutation.isError && <p className="text-sm text-red-400">Email və ya şifrə yanlışdır.</p>}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {mutation.isPending ? 'Yoxlanılır...' : 'Daxil ol'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Hesabın yoxdur?{' '}
          <Link to="/register" className="text-indigo-400">
            Qeydiyyatdan keç
          </Link>
        </p>
      </div>
    </div>
  )
}
