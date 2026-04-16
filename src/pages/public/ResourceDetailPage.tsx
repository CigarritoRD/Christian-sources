import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,

  ExternalLink,
  Heart,
  Layers3,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/auth/useAuth'
import { useResourceActions } from '@/hooks/useResourceActions'
import FadeIn from '@/components/ui/FadeIn'
import EmptyState from '@/components/ui/EmptyState'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import AppButton from '@/components/ui/AppButton'
import { getPublishedResourceBySlug } from '@/lib/api/resources'
import { openTrackedResource } from '@/lib/resourceAccess'
import { useTranslation } from 'react-i18next'


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
  const { t } = useTranslation()
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
          <div className="mx-auto max-w-4xl">
            <EmptyState
              title="No pudimos mostrar este recurso"
              description={error || 'Este recurso no está disponible.'}
              actionLabel="Volver a recursos"
              onAction={() => navigate('/resources')}
            />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-bg text-text-primary">
      <section className="relative overflow-hidden px-6 py-8 md:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,116,115,0.10),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,171,199,0.10),transparent_30%)]" />
        <div className="mx-auto max-w-6xl">
          <FadeIn>
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
          </FadeIn>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <FadeIn>
              <div className="overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-[var(--shadow-card)]">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-soft">
                  {resource.thumbnail_url ? (
                    <img
                      src={resource.thumbnail_url}
                      alt={resource.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-primary/15 to-brand-accent/10">
                      <Layers3 className="h-16 w-16 text-text-secondary" />
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <StatusBadge
                      label={formatTypeLabel(resource.resource_type)}
                      tone="default"
                    />
                    {resource.category ? (
                      <StatusBadge label={resource.category.name} tone="info" />
                    ) : null}
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.06}>
              <div className="space-y-6">
                <SectionCard className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      label={formatTypeLabel(resource.resource_type)}
                      tone="default"
                    />
                    {resource.category ? (
                      <StatusBadge label={resource.category.name} tone="info" />
                    ) : null}
                  </div>

                  <h1 className="mt-5 font-heading text-3xl leading-tight md:text-4xl">
                    {resource.title}
                  </h1>

                  <p className="mt-5 text-base leading-7 text-text-secondary">
                    {description}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <AppButton
                      onClick={handleOpenResource}
                      disabled={isOpening}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4" />

                      {isOpening ? t('common.opening') : t('common.open')}
                    </AppButton>

                    <AppButton
                      variant={saved ? 'primary' : 'secondary'}
                      onClick={handleToggleSaved}
                      disabled={loadingState === 'saved'}
                      className="w-full"
                    >
                      <Bookmark className="h-4 w-4" />
                      {loadingState === 'saved'
                        ? 'Guardando...'
                        : saved
                          ? 'Guardado'
                          : 'Guardar'}
                    </AppButton>

                    <AppButton
                      variant={favorite ? 'primary' : 'secondary'}
                      onClick={handleToggleFavorite}
                      disabled={loadingState === 'favorite'}
                      className="w-full sm:col-span-2"
                    >
                      <Heart className="h-4 w-4" />
                      {loadingState === 'favorite'
                        ? 'Actualizando...'
                        : favorite
                          ? 'En favoritos'
                          : 'Agregar a favoritos'}
                    </AppButton>
                  </div>
                </SectionCard>

                {resource.contributor ? (
                  <SectionCard className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                        <UserRound className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                          Colaborador
                        </p>

                        <Link
                          to={`/contributors/${resource.contributor.slug}`}
                          className="mt-2 inline-flex font-heading text-xl text-text-primary hover:text-brand-accent"
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
                            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-accent hover:underline"
                          >
                            Visitar sitio web
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </SectionCard>
                ) : null}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <SectionCard className="p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Tipo
                </p>
                <p className="mt-2 text-text-primary">
                  {formatTypeLabel(resource.resource_type)}
                </p>
              </SectionCard>

              <SectionCard className="p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Disponibilidad
                </p>
                <p className="mt-2 text-text-primary">
                  {resource.file_url || resource.external_url
                    ? 'Disponible'
                    : 'Pendiente'}
                </p>
              </SectionCard>

              <SectionCard className="p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Colaborador
                </p>
                <p className="mt-2 text-text-primary">
                  {resource.contributor?.name || 'No especificado'}
                </p>
              </SectionCard>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <SectionCard className="mt-8 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl text-text-primary">
                    Sobre este recurso
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Descripción y contexto del material.
                  </p>
                </div>
              </div>

              <div className="mt-5 max-w-4xl text-base leading-8 text-text-secondary">
                {description}
              </div>

              <div className="mt-6">
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-accent hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a recursos
                </Link>
              </div>
            </SectionCard>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}