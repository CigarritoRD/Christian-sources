import { useEffect, useMemo, useState } from 'react'
import ResourceCard from '@/components/resources/ResourceCard'
import { useAuth } from '@/auth/useAuth'
import { getUserDownloads } from '@/lib/api/dashboard'
import type { ResourceListItem } from '@/types/resources'

export default function DashboardDownloadsPage() {
  const { user } = useAuth()

  const [downloads, setDownloads] = useState<ResourceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true

    const loadDownloads = async () => {
      if (!user) return

      try {
        setLoading(true)
        setError(null)

        const data = await getUserDownloads(user.id)

        if (!active) return
        setDownloads(data)
      } catch (err) {
        if (!active) return

        const message =
          err instanceof Error ? err.message : 'No se pudieron cargar tus descargas.'

        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadDownloads()

    return () => {
      active = false
    }
  }, [user])

  const filteredDownloads = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) return downloads

    return downloads.filter((resource) => {
      const title = resource.title.toLowerCase()
      const description = (resource.short_description || resource.description || '').toLowerCase()
      const contributorName = resource.contributor?.name.toLowerCase() ?? ''
      const categoryName = resource.category?.name.toLowerCase() ?? ''

      return (
        title.includes(normalized) ||
        description.includes(normalized) ||
        contributorName.includes(normalized) ||
        categoryName.includes(normalized)
      )
    })
  }, [query, downloads])

  return (
    <div className="bg-bg text-text-primary">
      <section className="px-0 py-2">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-surface-border bg-surface p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
              Historial
            </p>
            <h1 className="mt-3 font-heading text-4xl md:text-5xl">
              Tus descargas
            </h1>
            <p className="mt-4 max-w-2xl font-body text-lg text-text-secondary">
              Aquí puedes ver los recursos que has descargado recientemente.
            </p>

            <div className="mt-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en tus descargas..."
                className="w-full rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-text-primary outline-none transition focus:border-brand-accent"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-0 py-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-surface-border bg-surface p-5"
                >
                  <div className="mb-4 h-44 rounded-2xl bg-bg-soft" />
                  <div className="mb-3 h-6 w-20 rounded-full bg-bg-soft" />
                  <div className="h-6 w-3/4 rounded bg-bg-soft" />
                  <div className="mt-3 h-4 w-full rounded bg-bg-soft" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-bg-soft" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
              <h2 className="font-heading text-xl">No pudimos cargar tus descargas</h2>
              <p className="mt-2 text-sm text-text-secondary">{error}</p>
            </div>
          ) : filteredDownloads.length === 0 ? (
            <div className="rounded-3xl border border-surface-border bg-surface p-8 text-center">
              <h2 className="font-heading text-2xl">No tienes descargas aún</h2>
              <p className="mt-3 text-text-secondary">
                Cuando descargues recursos, aparecerán aquí.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-sm text-text-secondary">
                  {filteredDownloads.length}{' '}
                  {filteredDownloads.length === 1
                    ? 'descarga encontrada'
                    : 'descargas encontradas'}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {filteredDownloads.map((resource) => (
                  <ResourceCard
                  id={resource.id}
                    key={resource.id}
                    title={resource.title}
                    description={resource.short_description || resource.description}
                    thumbnailUrl={resource.thumbnail_url}
                    type={resource.resource_type}
                    contributorName={resource.contributor?.name ?? null}
                    slug={resource.slug}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}