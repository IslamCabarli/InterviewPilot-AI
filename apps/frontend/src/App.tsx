import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { GuestRoute } from './auth/GuestRoute'
import { ProtectedRoute } from './auth/ProtectedRoute'
import Layout from './components/Layout'
import LoadingScreen from './components/LoadingScreen'
import Landing from './pages/Landing'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Interview = lazy(() => import('./pages/Interview'))
const InterviewReport = lazy(() => import('./pages/InterviewReport'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const UiKit = lazy(() => import('./pages/UiKit'))

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

      {import.meta.env.DEV && (
        <Route
          path="/ui"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <UiKit />
            </Suspense>
          }
        />
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}