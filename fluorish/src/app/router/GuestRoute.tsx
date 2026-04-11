import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'

export default function GuestRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-text-primary">
        <div className="rounded-3xl border border-surface-border bg-surface px-6 py-4 shadow-[var(--shadow-soft)]">
          Cargando...
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />
  }

  return <Outlet />
}