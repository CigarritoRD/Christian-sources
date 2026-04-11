import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/auth/useAuth'
import { useResourceActions } from '@/hooks/useResourceActions'
import { getPublishedResourceBySlug } from '@/lib/api/resources'
import { openTrackedResource } from '@/lib/resourceAccess'

type ResourceDetail = {
  id: string
  title: string
  slug: string
  description: string | null
  short_description: string | null
  full_description?: string | null
  thumbnail_url: string | null
  resource_type: string
  file_url: string | null
  external_url: string | null
  is_downloadable?: boolean | null
  contributor: {
    id: string
    name: string
    slug: string
    short_bio?: string | null
    website_url?: string | null
  } | null
  category?: {
    id: string
    name: string
    slug: string
  } | null
}

function formatTypeLabel(type: string) {
  const normalized = type.toLowerCase()

  switch (normalized) {
    case 'pdf':
      return 'PDF'
    case 'video':
      return 'Video'
    case 'audio':
      return 'Audio'
    case 'link':
      return 'Enlace'
    case 'document':
      return 'Documento'
    default:
      return type
  }
}

export default function ResourceDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [resource, setResource] = useState<ResourceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpening, setIsOpening] = useState(false)

  const {
    saved,
    favorite,
    loadingState,
    toggleSaved,
    toggleFavorite,
  } = useResourceActions({
    userId: user?.id ?? null,
    resourceId: resource?.id ?? null,
  })

  useEffect(() => {
    let active = true

    const loadResource = async () => {
      if (!slug) {
        if (active) {
          setError('No se encontró el recurso.')
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        setError(null)

        const data = await getPublishedResourceBySlug(slug)

        if (!active) return

        if (!data) {
          setError('No encontramos este recurso.')
          setResource(null)
          return
        }

        setResource(data as unknown as ResourceDetail)
      } catch (err) {
        console.error(err)
        if (active) {
          setError('No se pudo cargar el recurso.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadResource()

    return () => {
      active = false
    }
  }, [slug])

  const description = useMemo(() => {
    return (
      resource?.full_description ||
      resource?.description ||
      resource?.short_description ||
      'Sin descripción disponible.'
    )
  }, [resource])

  const requireAuth = () => {
    toast.info('Debes iniciar sesión para usar esta acción.')
    navigate('/login')
  }

  const handleToggleSaved = async () => {
    try {
      if (!user) {
        requireAuth()
        return
      }

      const next = await toggleSaved()

      toast.success(
        next
          ? 'Recurso guardado en tu librería.'
          : 'Recurso eliminado de tu librería.',
      )
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar tu librería.')
    }
  }

  const handleToggleFavorite = async () => {
    try {
      if (!user) {
        requireAuth()
        return
      }

      const next = await toggleFavorite()

      toast.success(
        next
          ? 'Recurso agregado a favoritos.'
          : 'Recurso eliminado de favoritos.',
      )
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar favoritos.')
    }
  }

  const handleOpenResource = async () => {
    if (!resource) return

    const targetUrl = resource.file_url || resource.external_url

    if (!targetUrl) {
      toast.error('Este recurso no tiene un archivo disponible todavía.')
      return
    }

    try {
      if (!user) {
        requireAuth()
        return
      }

      setIsOpening(true)

      await openTrackedResource({
        id: resource.id,
        file_url: resource.file_url,
        external_url: resource.external_url,
      })
    } catch (err) {
      console.error(err)
      toast.error('No se pudo abrir el recurso.')
    } finally {
      setIsOpening(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-bg text-text-primary">
        <section className="px-6 py-12 md:px-10 lg:px-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-pulse rounded-3xl border border-surface-border bg-surface p-6 shadow-[var(--shadow-soft)]">
              <div className="h-80 rounded-3xl bg-bg-soft" />
            </div>

            <div className="animate-pulse space-y-4 rounded-3xl border border-surface-border bg-surface p-6 shadow-[var(--shadow-soft)]">
              <div className="h-5 w-24 rounded bg-bg-soft" />
              <div className="h-10 w-3/4 rounded bg-bg-soft" />
              <div className="h-4 w-full rounded bg-bg-soft" />
              <div className="h-4 w-5/6 rounded bg-bg-soft" />
              <div className="h-12 w-full rounded-2xl bg-bg-soft" />
              <div className="h-12 w-full rounded-2xl bg-bg-soft" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="bg-bg text-text-primary">
        <section className="px-6 py-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-surface-border bg-surface p-10 text-center shadow-[var(--shadow-soft)]">
            <h1 className="font-heading text-3xl text-text-primary">
              No pudimos mostrar este recurso
            </h1>
            <p className="mt-3 text-text-secondary">
              {error || 'Este recurso no está disponible.'}
            </p>
            <Link
              to="/resources"
              className="mt-6 inline-flex rounded-2xl bg-brand-primary px-5 py-3 font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90"
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
      <section className="px-6 py-8 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <Link to="/" className="hover:text-text-primary">
              Inicio
            </Link>
            <span>/</span>
            <Link to="/resources" className="hover:text-text-primary">
              Recursos
            </Link>
            <span>/</span>
            <span className="text-text-primary">{resource.title}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-[var(--shadow-soft)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-soft">
                {resource.thumbnail_url ? (
                  <img
                    src={resource.thumbnail_url}
                    alt={resource.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-primary/15 to-brand-accent/10 text-6xl">
                    📚
                  </div>
                )}

                <div className="absolute left-4 top-4 rounded-full border border-surface-border bg-surface px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
                  {formatTypeLabel(resource.resource_type)}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-surface-border bg-surface p-6 shadow-[var(--shadow-soft)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-surface-border bg-bg-soft px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
                  {formatTypeLabel(resource.resource_type)}
                </span>

                {resource.category ? (
                  <span className="rounded-full border border-surface-border bg-bg-soft px-3 py-1 text-xs text-text-secondary">
                    {resource.category.name}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 font-heading text-3xl leading-tight md:text-4xl">
                {resource.title}
              </h1>

              <p className="mt-5 text-base leading-7 text-text-secondary">
                {description}
              </p>

              {resource.contributor ? (
                <div className="mt-6 rounded-3xl border border-surface-border bg-bg-soft p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                    Colaborador
                  </p>

                  <div className="mt-3">
                    <Link
                      to={`/contributors/${resource.contributor.slug}`}
                      className="font-heading text-xl text-text-primary hover:text-brand-accent"
                    >
                      {resource.contributor.name}
                    </Link>

                    {resource.contributor.short_bio ? (
                      <p className="mt-2 text-sm text-text-secondary">
                        {resource.contributor.short_bio}
                      </p>
                    ) : null}

                    {resource.contributor.website_url ? (
                      <a
                        href={resource.contributor.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-sm font-medium text-brand-accent hover:underline"
                      >
                        Visitar sitio web
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleOpenResource}
                  disabled={isOpening}
                  className="inline-flex items-center justify-center rounded-2xl bg-brand-primary px-5 py-3 font-medium text-white shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:opacity-60"
                >
                  {isOpening
                    ? 'Abriendo...'
                    : resource.file_url
                    ? 'Descargar / abrir'
                    : 'Abrir enlace'}
                </button>

                <button
                  type="button"
                  onClick={handleToggleSaved}
                  disabled={loadingState === 'saved'}
                  className={`inline-flex items-center justify-center rounded-2xl border px-5 py-3 font-medium transition disabled:opacity-60 ${
                    saved
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-surface-border bg-bg-soft text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  {loadingState === 'saved'
                    ? 'Guardando...'
                    : saved
                    ? 'Guardado'
                    : 'Guardar'}
                </button>

                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  disabled={loadingState === 'favorite'}
                  className={`inline-flex items-center justify-center rounded-2xl border px-5 py-3 font-medium transition disabled:opacity-60 sm:col-span-2 ${
                    favorite
                      ? 'border-brand-accent bg-brand-accent text-brand-ink'
                      : 'border-surface-border bg-bg-soft text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  {loadingState === 'favorite'
                    ? 'Actualizando...'
                    : favorite
                    ? 'En favoritos'
                    : 'Agregar a favoritos'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-surface-border bg-surface p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-heading text-2xl text-text-primary">
              Sobre este recurso
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-surface-border bg-bg-soft p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Tipo
                </p>
                <p className="mt-2 text-text-primary">
                  {formatTypeLabel(resource.resource_type)}
                </p>
              </div>

              <div className="rounded-2xl border border-surface-border bg-bg-soft p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Disponibilidad
                </p>
                <p className="mt-2 text-text-primary">
                  {resource.file_url || resource.external_url
                    ? 'Disponible'
                    : 'Pendiente'}
                </p>
              </div>

              <div className="rounded-2xl border border-surface-border bg-bg-soft p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Colaborador
                </p>
                <p className="mt-2 text-text-primary">
                  {resource.contributor?.name || 'No especificado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}