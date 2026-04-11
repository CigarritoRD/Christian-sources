import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/auth/useAuth'
import { updateMyProfile } from '@/lib/api/profile'

export default function DashboardProfilePage() {
  const { user, profile } = useAuth()

  const initialName = useMemo(() => {
    return profile?.full_name?.trim() || user?.email?.split('@')[0] || ''
  }, [profile?.full_name, user?.email])

  const [fullName, setFullName] = useState(initialName)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFullName(initialName)
  }, [initialName])

  const hasChanges = fullName.trim() !== initialName.trim()

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) {
      toast.error('No encontramos tu sesión.')
      return
    }

    const normalizedName = fullName.trim()

    if (!normalizedName) {
      toast.error('Escribe tu nombre.')
      return
    }

    try {
      setLoading(true)
      await updateMyProfile(user.id, { full_name: normalizedName })
      toast.success('Perfil actualizado correctamente.')
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar el perfil.')
    } finally {
      setLoading(false)
    }
  }

  const displayInitial = (fullName.trim() || user?.email || 'U')
    .charAt(0)
    .toUpperCase()

  return (
    <div className="bg-bg text-text-primary">
      <section className="px-0 py-2">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-surface-border bg-surface p-8 shadow-[var(--shadow-soft)]">
            <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
              Perfil
            </p>
            <h1 className="mt-3 font-heading text-4xl md:text-5xl">
              Tu cuenta
            </h1>
            <p className="mt-4 max-w-2xl font-body text-lg text-text-secondary">
              Administra tu información básica dentro de Toolkit Box.
            </p>
          </div>
        </div>
      </section>

      <section className="px-0 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-[180px_1fr]">
            <div className="rounded-3xl border border-surface-border bg-surface p-6 text-center shadow-[var(--shadow-soft)]">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-bg-soft font-heading text-3xl text-text-primary">
                {displayInitial}
              </div>

              <p className="mt-4 font-medium text-text-primary">
                {fullName.trim() || 'Usuario'}
              </p>

              <p className="mt-1 break-all text-sm text-text-secondary">
                {user?.email}
              </p>
            </div>

            <div className="rounded-3xl border border-surface-border bg-surface p-6 shadow-[var(--shadow-soft)]">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
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
                      value={user?.email ?? ''}
                      disabled
                      className="w-full cursor-not-allowed rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-text-secondary outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-medium text-text-primary">
                      ID de usuario
                    </p>
                    <div className="rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-sm text-text-secondary">
                      <span className="break-all">{user?.id}</span>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-text-primary">
                      Estado de cuenta
                    </p>
                    <div className="rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-sm text-text-primary">
                      Activa
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={loading || !hasChanges}
                    className="inline-flex rounded-2xl bg-brand-primary px-5 py-3 font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                  </button>

                  <button
                    type="button"
                    disabled={loading || !hasChanges}
                    onClick={() => setFullName(initialName)}
                    className="inline-flex rounded-2xl border border-surface-border bg-bg-soft px-5 py-3 font-medium text-text-primary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Restablecer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}