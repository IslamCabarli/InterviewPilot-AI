import { useNavigate, Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "../lib/validation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { loginUser } from "../api/auth";

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
}