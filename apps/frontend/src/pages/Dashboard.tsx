import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()


    const handleLogout = () => {
        logout(),
            navigate('/login');
    }

    return
    (
        <div className="min-h-screen bg-gray-950 p-8 text-white">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Xoş gəldin, {user?.name}</h1>
                <button
                    onClick={handleLogout}
                    className="rounded-md bg-red-600 px-4 py-2 hover:bg-red-500"
                >
                    Çıxış
                </button>
            </div>
        </div>
    )


}