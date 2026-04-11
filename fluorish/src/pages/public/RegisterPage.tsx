import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const normalizedName = fullName.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedName) {
      toast.error('Escribe tu nombre completo.')
      return
    }

    if (!normalizedEmail) {
      toast.error('Escribe tu correo electrónico.')
      return
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.')
      return
    }

    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: normalizedName,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        toast.success('Cuenta creada correctamente.')

        // Si tu proyecto requiere confirmación de email,
        // este mensaje le da claridad al usuario.
        if (!data.session) {
          toast.info('Revisa tu correo para confirmar tu cuenta.')
        }

        navigate('/login')
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo crear la cuenta.'

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
              Crea tu cuenta y empieza a guardar recursos útiles.
            </h1>

            <p className="mt-5 font-body text-lg text-text-secondary">
              Regístrate para explorar la biblioteca, guardar tus recursos
              favoritos, llevar tu historial de descargas y acceder a tu panel
              personal.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Guarda
                </p>
                <p className="mt-3 text-sm text-text-primary">
                  Organiza tus recursos en tu librería personal.
                </p>
              </div>

              <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Descarga
                </p>
                <p className="mt-3 text-sm text-text-primary">
                  Accede a materiales y lleva control de lo que usas.
                </p>
              </div>

              <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Descubre
                </p>
                <p className="mt-3 text-sm text-text-primary">
                  Conoce colaboradores y explora nuevas herramientas.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-surface-border bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                Registro
              </p>
              <h2 className="mt-2 font-heading text-3xl">Crear cuenta</h2>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Nombre completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-text-primary outline-none transition focus:border-brand-accent"
                />
              </div>

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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-text-primary outline-none transition focus:border-brand-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-text-primary outline-none transition focus:border-brand-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-primary px-5 py-3 font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <p className="mt-6 text-sm text-text-secondary">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-brand-accent hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}