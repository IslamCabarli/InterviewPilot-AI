import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query'    
import { useAuthStore } from '../store/authStore';
import { registerSchema, type RegisterInput } from '../lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '../api/auth';



export default function Register(){
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
        mutationFn:registerUser,
        onSuccess: (data) => {
            setAuth(data.user, data.token)
            navigate('/dashboard')
        },
    })


    const onSubmit = (data: RegisterInput) => mutation.mutate(data)












    }
