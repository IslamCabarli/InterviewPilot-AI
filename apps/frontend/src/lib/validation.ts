import { z } from 'zod'

export const registerSchema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters long'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        password_confirmation: z.string().min(8,'Password must be same'),
    })
    .refine((data) => data.password === data.password_confirmation,{
        message: 'Passwords do not match',
        path : ['password_confirmation'],
    })

export const LoginSchema = z.object({
    email:z.string().email('Invalid email address'),
    password:z.string().min(1, 'Password is required'), 
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof LoginSchema>