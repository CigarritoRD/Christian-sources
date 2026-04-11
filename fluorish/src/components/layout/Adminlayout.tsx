import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}