import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { useAuth } from '@/auth/useAuth'

const guestNavItems = [
  { label: 'Recursos', to: '/resources' },
  { label: 'Colaboradores', to: '/contributors' },
]

const userNavItems = [
  { label: 'Recursos', to: '/resources' },
  { label: 'Colaboradores', to: '/contributors' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Mi librería', to: '/dashboard/library' },
  { label: 'Perfil', to: '/dashboard/profile' },
]

const adminNavItems = [
  { label: 'Recursos', to: '/resources' },
  { label: 'Colaboradores', to: '/contributors' },
  { label: 'Admin', to: '/admin' },
]

export default function PublicNavbar() {
  const navigate = useNavigate()
  const { user, profile, signOut, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const displayName =
    profile?.full_name?.trim() || user?.email?.split('@')[0] || 'Usuario'

  const isAuthenticated = !!user
  const isAdmin = profile?.role === 'admin'
  const isUser = profile?.role === 'user'

  const navItems = !isAuthenticated
    ? guestNavItems
    : isAdmin
      ? adminNavItems
      : userNavItems

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Sesión cerrada correctamente.')
      closeMobileMenu()
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error('No se pudo cerrar sesión.')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border/60 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10 lg:px-16">
        <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/15 text-brand-accent shadow-[var(--shadow-soft)]">
            <span className="font-heading text-sm font-semibold">TB</span>
          </div>

          <div>
            <p className="font-heading text-base leading-none text-text-primary">
              Toolkit Box
            </p>
            <p className="mt-1 text-xs leading-none text-text-secondary">
              Resource library
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/admin'}
              className={({ isActive }) =>
                [
                  'text-sm font-medium transition',
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {loading ? (
            <div className="rounded-2xl border border-surface-border bg-surface px-4 py-2 text-sm text-text-secondary">
              Cargando...
            </div>
          ) : !isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-2xl border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="inline-flex rounded-2xl bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90"
              >
                Crear cuenta
              </Link>
            </>
          ) : isAdmin ? (
            <>
              <div className="hidden rounded-2xl border border-surface-border bg-surface px-4 py-2 text-sm text-text-primary lg:inline-flex">
                {displayName}
              </div>

              <Link
                to="/admin"
                className="rounded-2xl border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
              >
                Admin
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex rounded-2xl bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90"
              >
                Salir
              </button>
            </>
          ) : isUser ? (
            <>
              <Link
                to="/dashboard/profile"
                className="hidden rounded-2xl border border-surface-border bg-surface px-4 py-2 text-sm text-text-primary transition hover:bg-surface-hover lg:inline-flex"
              >
                {displayName}
              </Link>

              <Link
                to="/dashboard"
                className="rounded-2xl border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex rounded-2xl bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90"
              >
                Salir
              </button>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-border bg-surface text-text-primary shadow-[var(--shadow-soft)] transition hover:bg-surface-hover"
          >
            <span className="text-lg">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-surface-border/60 bg-bg/95 px-6 py-5 shadow-[var(--shadow-soft)] md:hidden">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="rounded-2xl border border-surface-border bg-surface px-4 py-3 text-sm text-text-secondary">
                Cargando...
              </div>
            ) : (
              <>
                {isAuthenticated ? (
                  <div className="mb-4 rounded-3xl border border-surface-border bg-surface p-4 shadow-[var(--shadow-soft)]">
                    <p className="font-medium text-text-primary">{displayName}</p>
                    <p className="mt-1 text-sm text-text-secondary">{user?.email}</p>
                    {isAdmin ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-brand-primary">
                        Admin
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/dashboard' || item.to === '/admin'}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        [
                          'rounded-2xl px-4 py-3 text-sm font-medium transition',
                          isActive
                            ? 'bg-brand-primary text-white'
                            : 'border border-surface-border bg-surface text-text-primary hover:bg-surface-hover',
                        ].join(' ')
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-4 flex flex-col gap-2">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="rounded-2xl border border-surface-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                      >
                        Iniciar sesión
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="rounded-2xl bg-brand-primary px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90"
                      >
                        Crear cuenta
                      </Link>
                    </>
                  ) : isAdmin ? (
                    <>
                      <Link
                        to="/admin"
                        onClick={closeMobileMenu}
                        className="rounded-2xl border border-surface-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                      >
                        Ir al panel admin
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="rounded-2xl bg-brand-primary px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90"
                      >
                        Salir
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={closeMobileMenu}
                        className="rounded-2xl border border-surface-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                      >
                        Ir al dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="rounded-2xl bg-brand-primary px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90"
                      >
                        Salir
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}