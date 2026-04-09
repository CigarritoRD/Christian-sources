import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ResourceCard from '@/components/resources/ResourceCard'
import ResourceActions from '@/components/resources/ResourceActions'
import {
  getPublishedResourceBySlug,
  getRelatedResources,
  type ResourceDetail,
} from '@/lib/api/resources'
import type { ResourceListItem } from '@/types/resources'

export default function ResourceDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const [resource, setResource] = useState<ResourceDetail | null>(null)
  const [related, setRelated] = useState<ResourceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadResource = async () => {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)

        const data = await getPublishedResourceBySlug(slug)

        if (!active) return

        if (!data) {
          setResource(null)
          setRelated([])
          return
        }

        setResource(data)

        if (data.contributor?.id) {
          const relatedData = await getRelatedResources(data.contributor.id, data.id)
          if (!active) return
          setRelated(relatedData)
        } else {
          setRelated([])
        }
      } catch (err) {
        if (!active) return
        const message =
          err instanceof Error ? err.message : 'No se pudo cargar el recurso.'
        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadResource()

    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="bg-bg text-text-primary">
        <section className="px-6 py-14 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl animate-pulse">
            <div className="h-10 w-2/3 rounded bg-surface" />
            <div className="mt-4 h-6 w-1/2 rounded bg-surface" />
            <div className="mt-8 h-80 rounded-3xl bg-surface" />
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
            <h1 className="font-heading text-2xl">No pudimos cargar el recurso</h1>
            <p className="mt-3 text-text-secondary">{error}</p>
          </div>
        </section>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="bg-bg text-text-primary">
        <section className="px-6 py-14 md:px-10 lg:px-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-surface-border bg-surface p-8 text-center">
            <h1 className="font-heading text-3xl">Recurso no encontrado</h1>
            <p className="mt-3 text-text-secondary">
              El recurso que buscas no está disponible.
            </p>
            <Link
              to="/resources"
              className="mt-6 inline-flex rounded-2xl bg-brand-primary px-5 py-3 text-white"
            >
              Volver a recursos
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
            to="/resources"
            className="text-sm text-brand-accent transition hover:underline"
          >
            ← Volver a recursos
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
            <div>
              <div className="mb-4 flex flex-wrap gap-3">
                <span className="inline-flex rounded-full border border-surface-border bg-surface px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
                  {resource.resource_type}
                </span>

                {resource.category?.name ? (
                  <span className="inline-flex rounded-full border border-surface-border bg-surface px-3 py-1 text-xs text-text-secondary">
                    {resource.category.name}
                  </span>
                ) : null}
              </div>

              <h1 className="font-heading text-4xl leading-tight md:text-5xl">
                {resource.title}
              </h1>

              <p className="mt-5 max-w-3xl font-body text-xl text-text-secondary">
                {resource.full_description ||
                  resource.description ||
                  resource.short_description}
              </p>

              <div className="mt-8 overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-card">
                {resource.thumbnail_url ? (
                  <img
                    src={resource.thumbnail_url}
                    alt={resource.title}
                    className="h-[320px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[320px] items-center justify-center bg-bg-soft text-text-secondary">
                    Sin imagen disponible
                  </div>
                )}
              </div>

              {resource.tags?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-surface-border bg-surface px-3 py-1 text-xs text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-surface-border bg-surface p-6 shadow-soft">
                <h2 className="font-heading text-xl">Acceso al recurso</h2>

                
                  <ResourceActions
                    resourceId={resource.id}
                    fileUrl={resource.file_url}
                    externalUrl={resource.external_url}
                    isDownloadable={resource.is_downloadable}
                    className="mt-5"
                  />
              

                <div className="mt-5 space-y-2 text-sm text-text-secondary">
                  {resource.pages ? <p>Páginas: {resource.pages}</p> : null}
                  {resource.file_size_mb ? <p>Tamaño: {resource.file_size_mb} MB</p> : null}
                  {resource.duration_seconds ? (
                    <p>Duración: {Math.ceil(resource.duration_seconds / 60)} min</p>
                  ) : null}
                </div>
              </div>

              {resource.contributor ? (
                <div className="rounded-3xl border border-surface-border bg-surface p-6 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                    Colaborador
                  </p>

                  <div className="mt-4 flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-bg-soft overflow-hidden">
                      {resource.contributor.avatar_url ? (
                        <img
                          src={resource.contributor.avatar_url}
                          alt={resource.contributor.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div>
                      <h3 className="font-heading text-xl">{resource.contributor.name}</h3>
                      {resource.contributor.specialty ? (
                        <p className="mt-1 text-sm text-text-secondary">
                          {resource.contributor.specialty}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {resource.contributor.short_bio ? (
                    <p className="mt-4 text-sm text-text-secondary">
                      {resource.contributor.short_bio}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      to={`/contributors/${resource.contributor.slug}`}
                      className="inline-flex rounded-2xl border border-surface-border bg-bg-soft px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                    >
                      Ver perfil
                    </Link>

                    {resource.contributor.website_url ? (
                      <a
                        href={resource.contributor.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-2xl border border-surface-border bg-bg-soft px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                      >
                        Visitar web
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="px-6 pb-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                Más de este colaborador
              </p>
              <h2 className="mt-2 font-heading text-3xl">Recursos relacionados</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ResourceCard
                  key={item.id}
                  title={item.title}
                  description={item.short_description || item.description}
                  thumbnailUrl={item.thumbnail_url}
                  type={item.resource_type}
                  contributorName={item.contributor?.name ?? null}
                  slug={item.slug} id={''}                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}