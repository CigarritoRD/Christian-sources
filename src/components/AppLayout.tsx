import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import ThemeToggle from './ThemeToggle'

type ContainerWidth = '6xl' | '7xl' | 'full'

type Props = {
  children: React.ReactNode
  hero?: React.ReactNode
  title?: string
  subtitle?: string
  right?: React.ReactNode
  sidebar?: React.ReactNode
  mobileDrawer?: React.ReactNode
  showSearch?: boolean
  containerWidth?: ContainerWidth
  contentClassName?: string
}

export function AppLayout({
  children,
  hero,
  title,
  subtitle,
  right,
  sidebar,
  mobileDrawer,
  showSearch = true,
  containerWidth = '6xl',
  contentClassName = '',
}: Props) {
  const { user, signOut } = useAuth()
  const nav = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const containerClass =
    containerWidth === 'full'
      ? 'w-full px-4'
      : containerWidth === '7xl'
        ? 'mx-auto max-w-8xl px-4'
        : 'mx-auto max-w-7xl px-4'

  return (
    <div className="min-h-screen bg-app text-app">
      <header className="sticky top-0 z-40 border-b border-app bg-card ">

        <div className={`flex items-center gap-3 py-3 ${containerClass}`}>
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-app surface">
              ✦
            </span>
            <span className="text-app/90">Recursos</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 text-sm text-muted">
            <NavItem to="/explorar" label="Explorar" />
            <NavItem to="/perfil/biblioteca" label="Mi biblioteca" />
          </nav>

          {/* Search */}
          {showSearch ? (
            <div className="ml-auto hidden sm:flex flex-1 max-w-[520px] items-center gap-2 rounded-2xl border border-app surface px-3 py-2">
              <span className="text-muted">🔎</span>
              <input
                className="w-full bg-transparent text-sm text-app placeholder:text-muted outline-none"
                placeholder="Buscar por tema, ministerio o palabra clave…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value.trim()
                    if (!q) return
                    nav(`/buscar?q=${encodeURIComponent(q)}`)
                  }
                }}
              />
            </div>
          ) : (
            <div className="ml-auto" />
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {mobileDrawer ? (
              <button
                onClick={() => setDrawerOpen(true)}
                className="sm:hidden rounded-2xl border border-app surface px-3 py-2 text-sm text-muted hover:text-app surface-hover transition"
              >
                Filtros
              </button>
            ) : null}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="rounded-2xl border border-app surface px-3 py-2 text-sm text-muted hover:text-app surface-hover transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-2xl bg-brand px-3 py-2 text-sm font-semibold text-app hover:bg-brand-soft transition"
                >
                  Crear cuenta
                </Link>
              </>
            ) : (
              <button
                onClick={() => signOut()}
                className="rounded-2xl border border-app surface px-3 py-2 text-sm text-muted hover:text-app surface-hover transition"
              >
                Salir
              </button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        {showSearch ? (
          <div className={`sm:hidden border-t border-app py-3 ${containerClass}`}>
            <div className="flex items-center gap-2 rounded-2xl border border-app surface px-3 py-2">
              <span className="text-muted">🔎</span>
              <input
                className="w-full bg-transparent text-sm text-app placeholder:text-muted outline-none"
                placeholder="Buscar recursos…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value.trim()
                    if (!q) return
                    nav(`/buscar?q=${encodeURIComponent(q)}`)
                  }
                }}
              />
            </div>
          </div>
        ) : null}
      </header>


      {/* HERO FULL-BLEED */}
      {hero ? <div className="w-full">{hero}</div> : null}

      {/* CONTENT */}
      <div className={`${containerClass} pb-16 pt-6 ${contentClassName}`}>
        {(title || subtitle || right) && (
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              {title ? (
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h1>
              ) : null}
              {subtitle ? (
                <p className="mt-1 text-sm text-slate-600 dark:text-white/60">{subtitle}</p>
              ) : null}
            </div>
            {right ? <div className="shrink-0">{right}</div> : null}
          </div>
        )}

        {sidebar ? (
          <div className="flex gap-6">
            <aside className="hidden lg:block w-[280px] shrink-0">
              <div className="sticky top-[92px] rounded-2xl border border-surface-border bg-surface p-4 shadow-soft">
                {sidebar}
              </div>
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </div>

      {/* MOBILE DRAWER */}
      {mobileDrawer && drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/60"
            aria-label="Cerrar"
          />

          <div className="absolute right-0 top-0 h-full w-[92%] max-w-[380px] border-l border-surface-border bg-bg shadow-card">
            <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
              <div className="text-sm font-semibold text-slate-900 dark:text-white/90">Filtros</div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl border border-surface-border bg-surface/60 px-3 py-2 text-sm text-slate-700 hover:bg-surface/80 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Cerrar
              </button>
            </div>

            <div className="h-[calc(100%-56px)] overflow-y-auto p-4">
              {mobileDrawer}
              <div className="mt-4">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-soft transition"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-xl px-3 py-2 transition',
          isActive ? 'surface text-app' : 'text-muted hover:text-app surface-hover',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

