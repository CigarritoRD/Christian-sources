import { useEffect, useMemo, useState } from 'react'
import ContributorCard from '@/components/contributors/ContributorCard'
import { getActiveContributors } from '@/lib/api/contributors'
import type { ContributorListItem } from '@/types/contributors'

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<ContributorListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true

    const loadContributors = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getActiveContributors()
        if (!active) return

        setContributors(data)
      } catch (err) {
        if (!active) return

        const message =
          err instanceof Error ? err.message : 'No se pudieron cargar los colaboradores.'

        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadContributors()

    return () => {
      active = false
    }
  }, [])

  const filteredContributors = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) return contributors

    return contributors.filter((contributor) => {
      const name = contributor.name.toLowerCase()
      const bio = (contributor.short_bio || '').toLowerCase()
      const specialty = (contributor.specialty || '').toLowerCase()

      return (
        name.includes(normalized) ||
        bio.includes(normalized) ||
        specialty.includes(normalized)
      )
    })
  }, [contributors, query])

  return (
    <div className="bg-bg text-text-primary">
      <section className="px-6 py-14 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
              Comunidad
            </p>
            <h1 className="mt-2 font-heading text-4xl md:text-5xl">
              Colaboradores
            </h1>
            <p className="mt-4 font-body text-lg text-text-secondary">
              Conoce a las personas y proyectos que comparten recursos dentro de
              Toolkit Box. Explora sus perfiles, descubre su enfoque y visita sus
              plataformas.
            </p>
          </div>

          <div className="mt-8">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, especialidad o descripción..."
              className="w-full rounded-2xl border border-surface-border bg-surface px-5 py-4 text-text-primary outline-none transition focus:border-brand-accent"
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-surface-border bg-surface p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-bg-soft" />
                    <div className="flex-1">
                      <div className="h-5 w-2/3 rounded bg-bg-soft" />
                      <div className="mt-3 h-4 w-1/2 rounded bg-bg-soft" />
                    </div>
                  </div>
                  <div className="mt-5 h-4 w-full rounded bg-bg-soft" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-bg-soft" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
              <h2 className="font-heading text-xl">No pudimos cargar los colaboradores</h2>
              <p className="mt-2 text-sm text-text-secondary">{error}</p>
            </div>
          ) : filteredContributors.length === 0 ? (
            <div className="rounded-3xl border border-surface-border bg-surface p-8 text-center">
              <h2 className="font-heading text-2xl">No encontramos resultados</h2>
              <p className="mt-3 text-text-secondary">
                Intenta buscar con otros términos o revisa más tarde.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-sm text-text-secondary">
                  {filteredContributors.length}{' '}
                  {filteredContributors.length === 1
                    ? 'colaborador encontrado'
                    : 'colaboradores encontrados'}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredContributors.map((contributor) => (
                  <ContributorCard
                    key={contributor.id}
                    name={contributor.name}
                    slug={contributor.slug}
                    shortBio={contributor.short_bio}
                    specialty={contributor.specialty}
                    avatarUrl={contributor.avatar_url}
                    websiteUrl={contributor.website_url}
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