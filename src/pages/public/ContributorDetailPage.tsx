import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Globe2,
  UserRound,
} from 'lucide-react'
import ResourceCard from '@/components/resources/ResourceCard'
import FadeIn from '@/components/ui/FadeIn'
import EmptyState from '@/components/ui/EmptyState'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
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
          <div className="mx-auto max-w-4xl">
            <EmptyState
              title="No pudimos cargar el colaborador"
              description={error}
            />
          </div>
        </section>
      </div>
    )
  }

  if (!contributor) {
    return (
      <div className="bg-bg text-text-primary">
        <section className="px-6 py-14 md:px-10 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <EmptyState
              title="Colaborador no encontrado"
              description="El perfil que buscas no está disponible."
              actionLabel="Volver a colaboradores"
              onAction={() => {
                window.location.href = '/contributors'
              }}
            />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-bg text-text-primary">
      <section className="relative overflow-hidden px-6 py-10 md:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,116,115,0.10),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,171,199,0.08),transparent_28%)]" />
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <Link
              to="/contributors"
              className="inline-flex items-center gap-2 text-sm text-brand-accent transition hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a colaboradores
            </Link>
          </FadeIn>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <FadeIn>
              <SectionCard className="p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="h-28 w-28 overflow-hidden rounded-3xl bg-bg-soft shadow-[var(--shadow-soft)]">
                    {contributor.avatar_url ? (
                      <img
                        src={contributor.avatar_url}
                        alt={contributor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 font-heading text-3xl text-text-secondary">
                        {contributor.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge label="Colaborador" />
                      {contributor.specialty ? (
                        <StatusBadge label={contributor.specialty} tone="info" />
                      ) : null}
                    </div>

                    <h1 className="mt-4 font-heading text-4xl md:text-5xl">
                      {contributor.name}
                    </h1>

                    {contributor.short_bio ? (
                      <p className="mt-5 text-lg text-text-secondary">
                        {contributor.short_bio}
                      </p>
                    ) : null}
                  </div>
                </div>

                {contributor.full_bio ? (
                  <div className="mt-8 border-t border-surface-border pt-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <h2 className="font-heading text-2xl">
                        Sobre este colaborador
                      </h2>
                    </div>

                    <p className="mt-5 max-w-4xl leading-8 text-text-secondary">
                      {contributor.full_bio}
                    </p>
                  </div>
                ) : null}
              </SectionCard>
            </FadeIn>

            <FadeIn delay={0.06}>
              <aside className="space-y-6">
                <SectionCard className="p-6">
                  <h2 className="font-heading text-xl">Enlaces</h2>

                  {links.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {links.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-bg-soft px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                        >
                          <Globe2 className="h-4 w-4" />
                          {item.label}
                          <ExternalLink className="h-4 w-4 text-text-secondary" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-text-secondary">
                      Este colaborador no tiene enlaces disponibles.
                    </p>
                  )}
                </SectionCard>

                <SectionCard className="p-6">
                  <h2 className="font-heading text-xl">Recursos</h2>
                  <p className="mt-2 text-3xl font-semibold">
                    {resources.length}
                  </p>
                </SectionCard>
              </aside>
            </FadeIn>
          </div>
        </div>
      </section>

      <FadeIn delay={0.1}>
        <section className="px-6 pb-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 font-heading text-3xl">
              Recursos del colaborador
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="transition-transform duration-200 hover:-translate-y-1"
                >
                  <ResourceCard
                    id={resource.id}
                    title={resource.title}
                    description={resource.short_description || resource.description}
                    thumbnailUrl={resource.thumbnail_url}
                    type={resource.resource_type}
                    contributorName={resource.contributor?.name ?? contributor.name}
                    slug={resource.slug}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  )
}