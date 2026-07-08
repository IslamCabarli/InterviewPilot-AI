import { Navigate, Route, Routes, useNavigate } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import type { ReactNode } from "react";
import { useAuthStore } from "./store/authStore";

function ProtectedRoute ({ children }: {children: ReactNode}){
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/Login" replace/>
}

export default function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        />
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
    </Routes>
  )
}