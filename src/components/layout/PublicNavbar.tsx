import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  LayoutDashboard,
  Library,
  LogOut,
  Shield,
  User,
} from 'lucide-react'
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
]

const adminNavItems = [
  { label: 'Recursos', to: '/resources' },
  { label: 'Colaboradores', to: '/contributors' },
]

export default function PublicNavbar() {
  const navigate = useNavigate()
  const { user, profile, signOut, loading } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const displayName =
    profile?.full_name?.trim() || user?.email?.split('@')[0] || 'Usuario'

  const initials = displayName.trim().slice(0, 1).toUpperCase()
  const avatarUrl = profile?.avatar_url ?? ''

  const isAuthenticated = !!user
  const isAdmin = profile?.role === 'admin'

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
      setMenuOpen(false)
      closeMobileMenu()
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error('No se pudo cerrar sesión.')
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border/60 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10 lg:px-16">
        <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/15 text-brand-accent shadow-[var(--shadow-soft)] transition hover:scale-[1.02]">
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
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-3 rounded-2xl border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary shadow-[var(--shadow-soft)] transition hover:bg-surface-hover"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-primary/15 text-xs font-semibold text-brand-primary">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="hidden text-left lg:block">
                  <p className="max-w-[140px] truncate text-sm font-medium text-text-primary">
                    {displayName}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {isAdmin ? 'Admin' : 'Usuario'}
                  </p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-text-secondary transition ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-[var(--shadow-card)]">
                  <div className="border-b border-surface-border px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-brand-primary/15 text-sm font-semibold text-brand-primary">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-text-primary">
                          {displayName}
                        </p>
                        <p className="truncate text-sm text-text-secondary">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                      >
                        <Shield className="h-4 w-4 text-text-secondary" />
                        Admin
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                        >
                          <LayoutDashboard className="h-4 w-4 text-text-secondary" />
                          Dashboard
                        </Link>

                        <Link
                          to="/dashboard/library"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                        >
                          <Library className="h-4 w-4 text-text-secondary" />
                          Mi librería
                        </Link>

                        <Link
                          to="/dashboard/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                        >
                          <User className="h-4 w-4 text-text-secondary" />
                          Perfil
                        </Link>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                    >
                      <LogOut className="h-4 w-4 text-text-secondary" />
                      Salir
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
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
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-brand-primary/15 text-sm font-semibold text-brand-primary">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-text-primary">
                          {displayName}
                        </p>
                        <p className="truncate text-sm text-text-secondary">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {isAdmin ? (
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-brand-primary">
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

                      <Link
                        to="/dashboard/library"
                        onClick={closeMobileMenu}
                        className="rounded-2xl border border-surface-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                      >
                        Mi librería
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={closeMobileMenu}
                        className="rounded-2xl border border-surface-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                      >
                        Perfil
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