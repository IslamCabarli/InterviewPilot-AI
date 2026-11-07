import { Route, Routes } from 'react-router'
import { GuestRoute } from './auth/GuestRoute'
import { ProtectedRoute } from './auth/ProtectedRoute'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Interview from './pages/Interview'
import InterviewReport from './pages/InterviewReport'
import Landing from './pages/Landing'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Settings from './pages/Settings'
import UiKit from './pages/UiKit'

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/interviews/:id/report" element={<InterviewReport />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {import.meta.env.DEV && <Route path="/ui" element={<UiKit />} />}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}