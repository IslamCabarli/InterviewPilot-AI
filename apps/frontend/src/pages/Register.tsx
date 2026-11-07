import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Link, useNavigate } from 'react-router'
import AuthLayout from '../components/AuthLayout'
import { Button, Input } from '../components/ui'
import { useRegister } from '../auth/queries'
import { getAuthErrorMessage } from '../lib/errors'
import { registerSchema, type RegisterInput } from '../lib/validation'

export default function Register() {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data, {
      onSuccess: () => navigate('/dashboard'),
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 422 && error.response.data?.errors?.email) {
          setError('email', { message: 'Bu email ilə hesab artıq mövcuddur' })
        }
      },
    })
  }

  return (
    <AuthLayout
      title="Hesab yarat"
      subtitle="Bir dəqiqəyə qeydiyyatdan keç və ilk müsahibəni başlat."
      footer={
        <>
          Artıq hesabın var?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Daxil ol
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Ad Soyad"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
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
          autoComplete="new-password"
          hint="Ən azı 8 simvol"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Şifrəni təsdiqlə"
          type="password"
          autoComplete="new-password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        {registerMutation.isError && !errors.email && (
          <p role="alert" className="text-sm text-danger">
            {getAuthErrorMessage(registerMutation.error, 'Qeydiyyat uğursuz oldu. Yenidən cəhd et.')}
          </p>
        )}

        <Button type="submit" loading={registerMutation.isPending} className="w-full">
          Qeydiyyatdan keç
        </Button>
      </form>
    </AuthLayout>
  )
}