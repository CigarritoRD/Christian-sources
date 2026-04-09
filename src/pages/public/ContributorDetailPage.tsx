import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ResourceCard from '@/components/resources/ResourceCard'
import {
  getContributorBySlug,
  getContributorResources,
  type ContributorDetail,
} from '@/lib/api/contributors'
import type { ResourceListItem } from '@/types/resources'

type ContributorLink = {
  label: string
  href: string
}

export default function ContributorDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const [contributor, setContributor] = useState<ContributorDetail | null>(null)
  const [resources, setResources] = useState<ResourceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadContributor = async () => {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)

        const contributorData = await getContributorBySlug(slug)

        if (!active) return

        if (!contributorData) {
          setContributor(null)
          setResources([])
          return
        }

        setContributor(contributorData)

        const resourceData = await getContributorResources(contributorData.id)

        if (!active) return
        setResources(resourceData)
      } catch (err) {
        if (!active) return

        const message =
          err instanceof Error ? err.message : 'No se pudo cargar el colaborador.'

        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadContributor()

    return () => {
      active = false
    }
  }, [slug])

  const links: ContributorLink[] = contributor
    ? [
        contributor.website_url
          ? { label: 'Sitio web', href: contributor.website_url }
          : null,
        contributor.instagram_url
          ? { label: 'Instagram', href: contributor.instagram_url }
          : null,
        contributor.facebook_url
          ? { label: 'Facebook', href: contributor.facebook_url }
          : null,
        contributor.linkedin_url
          ? { label: 'LinkedIn', href: contributor.linkedin_url }
          : null,
        contributor.youtube_url
          ? { label: 'YouTube', href: contributor.youtube_url }
          : null,
      ].filter(Boolean) as ContributorLink[]
    : []

  if (loading) {
    return (
      <div className="bg-bg text-text-primary">
        <section className="px-6 py-14 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl animate-pulse">
            <div className="h-10 w-1/3 rounded bg-surface" />
            <div className="mt-6 h-32 w-full rounded-3xl bg-surface" />
            <div className="mt-8 h-64 rounded-3xl bg-surface" />
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-bg text-text-primary">
        <section className="px-6 py-14 md:px-10 lg:px-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <h1 className="font-heading text-2xl">No pudimos cargar el colaborador</h1>
            <p className="mt-3 text-text-secondary">{error}</p>
          </div>
        </section>
      </div>
    )
  }

  if (!contributor) {
    return (
      <div className="bg-bg text-text-primary">
        <section className="px-6 py-14 md:px-10 lg:px-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-surface-border bg-surface p-8 text-center">
            <h1 className="font-heading text-3xl">Colaborador no encontrado</h1>
            <p className="mt-3 text-text-secondary">
              El perfil que buscas no está disponible.
            </p>
            <Link
              to="/contributors"
              className="mt-6 inline-flex rounded-2xl bg-brand-primary px-5 py-3 text-white"
            >
              Volver a colaboradores
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-bg text-text-primary">
      <section className="px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/contributors"
            className="text-sm text-brand-accent transition hover:underline"
          >
            ← Volver a colaboradores
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-surface-border bg-surface p-8 shadow-soft">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="h-28 w-28 overflow-hidden rounded-3xl bg-bg-soft">
                  {contributor.avatar_url ? (
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-heading text-3xl text-text-secondary">
                      {contributor.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                    Colaborador
                  </p>

                  <h1 className="mt-2 font-heading text-4xl leading-tight md:text-5xl">
                    {contributor.name}
                  </h1>

                  {contributor.specialty ? (
                    <p className="mt-4 text-lg text-brand-accent">
                      {contributor.specialty}
                    </p>
                  ) : null}

                  {contributor.short_bio ? (
                    <p className="mt-5 max-w-3xl font-body text-lg text-text-secondary">
                      {contributor.short_bio}
                    </p>
                  ) : null}
                </div>
              </div>

              {contributor.full_bio ? (
                <div className="mt-8 border-t border-surface-border pt-8">
                  <h2 className="font-heading text-2xl">Sobre este colaborador</h2>
                  <p className="mt-4 leading-8 text-text-secondary">
                    {contributor.full_bio}
                  </p>
                </div>
              ) : null}
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-surface-border bg-surface p-6 shadow-soft">
                <h2 className="font-heading text-xl">Conecta</h2>

                {links.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {links.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-2xl border border-surface-border bg-bg-soft px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-text-secondary">
                    Este colaborador aún no tiene enlaces externos disponibles.
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-surface-border bg-surface p-6 shadow-soft">
                <h2 className="font-heading text-xl">Recursos compartidos</h2>
                <p className="mt-3 text-sm text-text-secondary">
                  {resources.length}{' '}
                  {resources.length === 1 ? 'recurso publicado' : 'recursos publicados'}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
              Biblioteca del colaborador
            </p>
            <h2 className="mt-2 font-heading text-3xl">Recursos disponibles</h2>
          </div>

          {resources.length === 0 ? (
            <div className="rounded-3xl border border-surface-border bg-surface p-8 text-center">
              <h3 className="font-heading text-2xl">Aún no hay recursos publicados</h3>
              <p className="mt-3 text-text-secondary">
                Este colaborador todavía no tiene recursos visibles en la plataforma.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard
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
          )}
        </div>
      </section>
    </div>
  )
}