import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

export default function Dashboard(){
    const {user, logout} = useAuthStore()
    const navigate = useNavigate()


    const handleLogout = () =>{
        logout(),
        navigate('/login');
    }

    

}