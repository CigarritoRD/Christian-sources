import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft,
  FileSearch,
  FolderKanban,
  Grid2x2,
  LayoutDashboard,
  LogOut,
  Menu,
  Shapes,
  Tag,
  Users,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/auth/useAuth'
import AppButton from '@/components/ui/AppButton'

type AdminNavItem = {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  end?: boolean
}

const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Contributors', to: '/admin/contributors', icon: Users },
  { label: 'Applications', to: '/admin/contributor-applications', icon: FileSearch },
  { label: 'Resources', to: '/admin/resources', icon: FolderKanban },
  { label: 'Categories', to: '/admin/categories', icon: Grid2x2 },
  { label: 'Tags', to: '/admin/tags', icon: Tag }
]

function navLinkClass(isActive: boolean) {
  return [
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
    isActive
      ? 'bg-brand-primary text-white shadow-[var(--shadow-soft)]'
      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
  ].join(' ')
}

export default function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary font-heading">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-surface-border bg-surface xl:flex xl:flex-col">
          <div className="border-b border-surface-border px-6 py-6">
            <NavLink to="/admin" className="block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Shapes className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-heading text-xl text-text-primary">
                    Flourish Admin
                  </p>
                  <p className="text-sm text-text-secondary">Control panel</p>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {adminNavItems.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => navLinkClass(isActive)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>

            <div className="mt-8 rounded-2xl border border-surface-border bg-bg-soft p-4 shadow-[var(--shadow-soft)]">
              <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                Signed in as
              </p>
              <p className="mt-2 font-medium text-text-primary">
                {profile?.full_name || profile?.email || 'Admin'}
              </p>
              <p className="mt-1 text-sm capitalize text-text-secondary">
                {profile?.role || 'admin'}
              </p>
            </div>
          </div>

          <div className="border-t border-surface-border px-4 py-4">
            <div className="space-y-2">
              <NavLink
                to="/"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to site
              </NavLink>

              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="border-b border-surface-border bg-surface xl:hidden">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div>
                <NavLink to="/admin" className="font-heading text-xl text-text-primary">
                  Flourish Admin
                </NavLink>
                <p className="text-xs text-text-secondary">Admin panel</p>
              </div>

              <AppButton
                variant="secondary"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </AppButton>
            </div>

            <AnimatePresence>
              {isMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="overflow-hidden border-t border-surface-border px-4 py-4 sm:px-6"
                >
                  <nav className="space-y-2">
                    {adminNavItems.map((item) => {
                      const Icon = item.icon

                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.end}
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) => navLinkClass(isActive)}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </NavLink>
                      )
                    })}
                  </nav>

                  <div className="mt-4 space-y-2 border-t border-surface-border pt-4">
                    <NavLink
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to site
                    </NavLink>

                    <button
                      type="button"
                      onClick={() => void handleSignOut()}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </header>

          <main className="flex-1 px-4 py-3 sm:px-6 lg:px-8 font-heading">
            <Outlet />
          </main>

          <footer className="border-t border-surface-border bg-surface">
            <div className="flex flex-col gap-2 px-6 py-4 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
              <p>Flourish Admin Panel</p>
              <p>Manage contributors, resources, categories, and platform activity.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}