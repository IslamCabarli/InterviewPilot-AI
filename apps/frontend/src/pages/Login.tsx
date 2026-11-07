import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import AuthLayout from '../components/AuthLayout'
import { Button, Input } from '../components/ui'
import { useLogin } from '../auth/queries'
import { getAuthErrorMessage } from '../lib/errors'
import { loginSchema, type LoginInput } from '../lib/validation'

export default function Login() {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate('/dashboard'),
    })
  }

  return (
    <AuthLayout
      title="Yenidən xoş gəldin"
      subtitle="Hesabına daxil ol və təcrübəni davam etdir."
      footer={
        <>
          Hesabın yoxdur?{' '}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Qeydiyyatdan keç
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="ad@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Şifrə"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {loginMutation.isError && (
          <p role="alert" className="text-sm text-danger">
            {getAuthErrorMessage(loginMutation.error, 'Email və ya şifrə yanlışdır.')}
          </p>
        )}

        <Button type="submit" loading={loginMutation.isPending} className="w-full">
          Daxil ol
        </Button>
      </form>
    </AuthLayout>
  )
}