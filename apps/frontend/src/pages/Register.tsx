import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';     
import { useAuthStore } from '../store/authStore';
import { registerSchema, type RegisterInput } from '../lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';



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


    
















    }
