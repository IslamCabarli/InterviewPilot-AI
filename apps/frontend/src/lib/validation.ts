import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Ad ən azı 2 simvol olmalıdır'),
    email: z.string().trim().email('Düzgün email daxil edin'),
    password: z.string().min(8, 'Şifrə ən azı 8 simvol olmalıdır'),
    password_confirmation: z.string().min(1, 'Şifrəni təsdiqləyin'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Şifrələr uyğun gəlmir',
    path: ['password_confirmation'],
  })

export const loginSchema = z.object({
  email: z.string().trim().email('Düzgün email daxil edin'),
  password: z.string().min(1, 'Şifrə tələb olunur'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>