import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      toast.error('Escribe tu correo electrónico.')
      return
    }

    if (!password) {
      toast.error('Escribe tu contraseña.')
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (error) {
        throw error
      }

      toast.success('Sesión iniciada correctamente.')
      navigate('/dashboard')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo iniciar sesión.'

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bg text-text-primary">
      <section className="px-6 py-16 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_460px] lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-surface-border bg-surface px-4 py-1 text-sm text-text-secondary shadow-[var(--shadow-soft)]">
              Toolkit Box
            </span>

            <h1 className="mt-5 font-heading text-4xl leading-tight md:text-5xl">
              Inicia sesión y continúa explorando tu biblioteca.
            </h1>

            <p className="mt-5 font-body text-lg text-text-secondary">
              Accede a tu panel personal para guardar recursos, revisar tus
              descargas y seguir descubriendo materiales y colaboradores.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Accede
                </p>
                <p className="mt-3 text-sm text-text-primary">
                  Entra a tu librería y encuentra tus recursos guardados.
                </p>
              </div>

              <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Organiza
                </p>
                <p className="mt-3 text-sm text-text-primary">
                  Lleva control de favoritos y materiales descargados.
                </p>
              </div>

              <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Descubre
                </p>
                <p className="mt-3 text-sm text-text-primary">
                  Sigue explorando nuevos recursos y perfiles de colaboradores.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-surface-border bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                Acceso
              </p>
              <h2 className="mt-2 font-heading text-3xl">Iniciar sesión</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-text-primary outline-none transition focus:border-brand-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-text-primary outline-none transition focus:border-brand-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-primary px-5 py-3 font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Entrando...' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="mt-6 text-sm text-text-secondary">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-medium text-brand-accent hover:underline"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}