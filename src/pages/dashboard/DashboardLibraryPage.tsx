import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/auth/useAuth'
import { getMyLibrary, type DashboardLibraryItem } from '@/lib/api/dashboard'
import { removeLibraryEntry } from '@/lib/api/library'

type FilterKind = 'all' | 'saved' | 'favorite'

export default function DashboardLibraryPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<DashboardLibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterKind>('all')
  const [updatingKey, setUpdatingKey] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadLibrary = async () => {
      if (!user?.id) {
        if (active) {
          setItems([])
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        const data = await getMyLibrary(user.id)

        if (!active) return
        setItems(data)
      } catch (error) {
        console.error(error)
        if (active) {
          toast.error('No se pudo cargar tu librería.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadLibrary()

    return () => {
      active = false
    }
  }, [user?.id])

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items
    return items.filter((item) => item.kind === filter)
  }, [items, filter])

  const handleRemove = async (
    resourceId: string,
    kind: 'saved' | 'favorite',
  ) => {
    if (!user?.id) return

    const actionKey = `${resourceId}-${kind}`

    try {
      setUpdatingKey(actionKey)
      await removeLibraryEntry(user.id, resourceId, kind)

      setItems((current) =>
        current.filter(
          (item) =>
            !(item.resource?.id === resourceId && item.kind === kind),
        ),
      )

      toast.success(
        kind === 'saved'
          ? 'Recurso eliminado de guardados.'
          : 'Recurso eliminado de favoritos.',
      )
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar tu librería.')
    } finally {
      setUpdatingKey(null)
    }
  }

  return (
    <div className="bg-bg text-text-primary">
      <section className="px-0 py-2">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-surface-border bg-surface p-8 shadow-[var(--shadow-soft)]">
            <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
              Librería
            </p>
            <h1 className="mt-3 font-heading text-4xl md:text-5xl">
              Mis recursos
            </h1>
            <p className="mt-4 max-w-2xl font-body text-lg text-text-secondary">
              Aquí encontrarás los recursos que has guardado o marcado como favoritos.
            </p>
          </div>
        </div>
      </section>

      <section className="px-0 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-brand-primary text-white'
                  : 'border border-surface-border bg-surface text-text-primary hover:bg-surface-hover'
              }`}
            >
              Todos
            </button>

            <button
              type="button"
              onClick={() => setFilter('saved')}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                filter === 'saved'
                  ? 'bg-brand-primary text-white'
                  : 'border border-surface-border bg-surface text-text-primary hover:bg-surface-hover'
              }`}
            >
              Guardados
            </button>

            <button
              type="button"
              onClick={() => setFilter('favorite')}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                filter === 'favorite'
                  ? 'bg-brand-primary text-white'
                  : 'border border-surface-border bg-surface text-text-primary hover:bg-surface-hover'
              }`}
            >
              Favoritos
            </button>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]"
                >
                  <div className="h-40 rounded-2xl bg-bg-soft" />
                  <div className="mt-4 h-5 w-24 rounded bg-bg-soft" />
                  <div className="mt-3 h-6 w-3/4 rounded bg-bg-soft" />
                  <div className="mt-2 h-4 w-full rounded bg-bg-soft" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-bg-soft" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-surface-border bg-surface p-10 text-center shadow-[var(--shadow-soft)]">
              <h2 className="font-heading text-2xl text-text-primary">
                Tu librería está vacía
              </h2>
              <p className="mt-3 text-text-secondary">
                Guarda recursos o márcalos como favoritos para encontrarlos aquí.
              </p>
              <Link
                to="/resources"
                className="mt-6 inline-flex rounded-2xl bg-brand-primary px-5 py-3 font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90"
              >
                Explorar recursos
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => {
                const resource = item.resource
                if (!resource) return null

                const actionKey = `${resource.id}-${item.kind}`

                return (
                  <article
                    key={item.library_id}
                    className="overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-bg-soft">
                      {resource.thumbnail_url ? (
                        <img
                          src={resource.thumbnail_url}
                          alt={resource.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                          Sin miniatura
                        </div>
                      )}

                      <div className="absolute left-3 top-3 rounded-full border border-surface-border bg-surface px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
                        {resource.resource_type}
                      </div>

                      <div className="absolute right-3 top-3 rounded-full border border-surface-border bg-bg/80 px-3 py-1 text-xs font-medium text-text-primary backdrop-blur">
                        {item.kind === 'saved' ? 'Guardado' : 'Favorito'}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-heading text-xl text-text-primary">
                        {resource.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                        {resource.short_description || resource.description || 'Sin descripción.'}
                      </p>

                      {resource.contributor ? (
                        <p className="mt-4 text-xs text-neutral-muted">
                          Por{' '}
                          <span className="text-text-primary">
                            {resource.contributor.name}
                          </span>
                        </p>
                      ) : null}

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          to={`/resources/${resource.slug}`}
                          className="inline-flex rounded-2xl bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                        >
                          Ver recurso
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleRemove(resource.id, item.kind)}
                          disabled={updatingKey === actionKey}
                          className="inline-flex rounded-2xl border border-surface-border bg-bg-soft px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover disabled:opacity-60"
                        >
                          {updatingKey === actionKey ? 'Quitando...' : 'Quitar'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}