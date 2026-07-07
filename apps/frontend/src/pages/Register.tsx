import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore';
import { registerSchema, type RegisterInput } from '../lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '../api/auth';



export default function Register() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((s) => s.setAuth)


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    })



    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setAuth(data.user, data.token)
            navigate('/dashboard')
        },
    })


    const onSubmit = (data: RegisterInput) => mutation.mutate(data)


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
            <div className="w-full max-w-sm rounded-xl bg-gray-900 p-8 shadow-lg">
                <h1 className="mb-6 text-2xl font-bold text-white">Register</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <input
                            {...register('name')}
                            placeholder="Ad Soyad"
                            className="w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                    </div>

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
                            type='password'
                            placeholder='Password'
                            className='w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                        {errors.password && (
                            <p className='mt-1 text-sm text-red-400'>{errors.password.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            {...register('password_confirmation')}
                            type="password"
                            placeholder="Şifrəni təsdiqlə"
                            className="w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.password_confirmation.message}
                            </p>
                        )}
                    </div>

                    {mutation.isError && (
                        <p className="text-sm text-red-400">Qeydiyyat uğursuz oldu. Yenidən cəhd et.</p>
                    )}


                    <button
                        type='submit'
                        disabled={mutation.isPending}
                        className='w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50'
                    >
                        {mutation.isPending ? 'Sending...' : 'Register now'}
                    </button>
                </form>

                <p className='mt-4 text-center text-sm text-gray-400'>
                    Already have an account? <Link to="/login" className='text-indigo-600'> Log in </Link>
                </p>
            </div>
        </div>
    )
}
