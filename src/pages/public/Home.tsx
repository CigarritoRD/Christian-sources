import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Library,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import ResourceCard from '@/components/resources/ResourceCard'
import ContributorCard from '@/components/contributors/ContributorCard'
import FadeIn from '@/components/ui/FadeIn'
import {
  getActiveResourceCategories,
  getFeaturedResources,
  type ResourceCategory,
} from '@/lib/api/resources'
import { getFeaturedContributors } from '@/lib/api/contributors'
import type { ResourceListItem } from '@/types/resources'
import type { ContributorListItem } from '@/types/contributors'

export default function Home() {
  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [resources, setResources] = useState<ResourceListItem[]>([])
  const [contributors, setContributors] = useState<ContributorListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const normalized = searchQuery.trim()

    if (!normalized) {
      navigate('/resources')
      return
    }

    navigate(`/resources?q=${encodeURIComponent(normalized)}`)
  }

  useEffect(() => {
    let active = true

    const loadHomeData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [categoriesData, resourcesData, contributorsData] = await Promise.all([
          getActiveResourceCategories(),
          getFeaturedResources(),
          getFeaturedContributors(),
        ])

        if (!active) return

        setCategories(categoriesData.slice(0, 4))
        setResources(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resourcesData.map((resource: any) => ({
            ...resource,
            external_url: resource.external_url ?? '',
            file_url: resource.file_url ?? '',
          })),
        )
        setContributors(contributorsData)
      } catch (err) {
        if (!active) return
        const message =
          err instanceof Error ? err.message : 'No se pudo cargar la página inicial.'
        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadHomeData()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="bg-bg text-text-primary">
      <section className="relative overflow-hidden px-6 py-16 md:px-10 lg:px-16 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,116,115,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,171,199,0.12),transparent_30%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <FadeIn>
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-1 text-sm text-text-secondary shadow-[var(--shadow-soft)]">
                <Sparkles className="h-4 w-4" />
                Toolkit Box
              </span>

              <h1 className="font-heading text-4xl leading-tight md:text-5xl lg:text-6xl">
                Recursos útiles para aprender, acompañar y crecer en comunidad.
              </h1>

              <p className="mt-6 max-w-2xl font-body text-lg text-text-secondary md:text-xl">
                Explora materiales compartidos por colaboradores, descubre nuevas
                herramientas y encuentra recursos diseñados para apoyar procesos reales
                de formación, bienestar y liderazgo.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-medium text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:opacity-95"
                >
                  Explorar recursos
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/contributors"
                  className="rounded-2xl border border-surface-border bg-surface px-6 py-3 font-medium text-text-primary transition hover:bg-surface-hover"
                >
                  Ver colaboradores
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                    <Library className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg">Biblioteca viva</h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Recursos organizados para uso real y exploración continua.
                  </p>
                </div>

                <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg">Red de autores</h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Conoce a los colaboradores detrás de cada material.
                  </p>
                </div>

                <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg">Aprendizaje útil</h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Materiales pensados para procesos reales de acompañamiento.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-primary/10 via-brand-accent/10 to-transparent blur-3xl" />

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-48 animate-pulse rounded-3xl border border-surface-border bg-surface" />
                  <div className="h-48 animate-pulse rounded-3xl border border-surface-border bg-surface sm:translate-y-8" />
                  <div className="h-40 animate-pulse rounded-3xl border border-surface-border bg-surface sm:col-span-2" />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                    {resources[0]?.thumbnail_url ? (
                      <img
                        src={resources[0].thumbnail_url}
                        alt={resources[0].title}
                        className="h-28 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-between bg-gradient-to-br from-brand-primary/15 to-brand-accent/10 px-5">
                        <span className="rounded-full border border-surface-border bg-surface px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
                          {resources[0]?.resource_type ?? 'recurso'}
                        </span>
                        <BookOpen className="h-6 w-6 text-text-secondary" />
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="font-heading text-lg text-text-primary">
                        {resources[0]?.title ?? 'Recurso destacado'}
                      </h3>

                      <p className="mt-2 text-sm text-text-secondary">
                        {resources[0]?.short_description ||
                          resources[0]?.description ||
                          'Explora materiales útiles compartidos por colaboradores.'}
                      </p>

                      <p className="mt-4 text-xs text-neutral-muted">
                        Por{' '}
                        <span className="text-text-primary">
                          {resources[0]?.contributor?.name ?? 'Colaborador'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)] sm:translate-y-8">
                    {resources[1]?.thumbnail_url ? (
                      <img
                        src={resources[1].thumbnail_url}
                        alt={resources[1].title}
                        className="h-28 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-between bg-gradient-to-br from-cyan-500/15 to-sky-500/10 px-5">
                        <span className="rounded-full border border-surface-border bg-surface px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
                          {resources[1]?.resource_type ?? 'biblioteca'}
                        </span>
                        <Sparkles className="h-6 w-6 text-text-secondary" />
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="font-heading text-lg text-text-primary">
                        {resources[1]?.title ?? 'Descubre nuevos recursos'}
                      </h3>

                      <p className="mt-2 text-sm text-text-secondary">
                        {resources[1]?.short_description ||
                          resources[1]?.description ||
                          'Encuentra herramientas, guías y materiales para distintos contextos.'}
                      </p>

                      <p className="mt-4 text-xs text-neutral-muted">
                        Por{' '}
                        <span className="text-text-primary">
                          {resources[1]?.contributor?.name ?? 'Toolkit Box'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)] sm:col-span-2">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                          Comunidad
                        </p>
                        <h3 className="mt-2 font-heading text-2xl text-text-primary">
                          Colaboradores y recursos conectados
                        </h3>
                        <p className="mt-2 max-w-xl text-sm text-text-secondary">
                          Explora una biblioteca construida con materiales reales y conoce
                          a quienes los comparten.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <div className="min-w-[90px] rounded-2xl border border-surface-border bg-bg-soft px-4 py-4 text-center">
                          <p className="font-heading text-xl text-text-primary">
                            {resources.length}
                          </p>
                          <p className="mt-1 text-xs whitespace-nowrap text-text-secondary">
                            Recursos
                          </p>
                        </div>

                        <div className="min-w-[90px] rounded-2xl border border-surface-border bg-bg-soft px-4 py-4 text-center">
                          <p className="font-heading text-xl text-text-primary">
                            {contributors.length}
                          </p>
                          <p className="mt-1 text-xs whitespace-nowrap text-text-secondary">
                            Autores
                          </p>
                        </div>

                        <div className="min-w-[90px] rounded-2xl border border-surface-border bg-bg-soft px-4 py-4 text-center">
                          <p className="font-heading text-xl text-text-primary">
                            {categories.length}
                          </p>
                          <p className="mt-1 text-xs whitespace-nowrap text-text-secondary">
                            Temas
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <FadeIn delay={0.12}>
        <section className="px-6 pb-8 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <form
              onSubmit={handleSearch}
              className="rounded-3xl border border-surface-border bg-surface p-4 shadow-[var(--shadow-soft)] md:p-6"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar recursos, temas o colaboradores..."
                    className="w-full rounded-2xl border border-surface-border bg-bg-soft px-11 py-3 text-text-primary outline-none placeholder:text-text-secondary focus:border-brand-accent"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-medium text-white transition hover:opacity-90"
                >
                  Buscar
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </section>
      </FadeIn>

      {error ? (
        <section className="px-6 py-10 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <h2 className="font-heading text-xl">No pudimos cargar el inicio</h2>
            <p className="mt-2 text-sm text-text-secondary">{error}</p>
          </div>
        </section>
      ) : null}

      <FadeIn delay={0.15}>
        <section className="px-6 py-10 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Explora por tema
                </p>
                <h2 className="mt-2 font-heading text-2xl md:text-3xl">
                  Categorías destacadas
                </h2>
              </div>
              <Link to="/resources" className="text-sm text-brand-accent">
                Ver todo
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-2xl border border-surface-border bg-surface p-5"
                  >
                    <div className="h-6 w-24 rounded bg-bg-soft" />
                    <div className="mt-3 h-4 w-36 rounded bg-bg-soft" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/resources?category=${encodeURIComponent(category.slug)}`}
                    className="group rounded-2xl border border-surface-border bg-surface p-5 transition hover:-translate-y-1 hover:bg-surface-hover hover:shadow-[var(--shadow-card)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                      <Library className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 font-heading text-lg text-text-primary">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      Explora recursos de {category.name.toLowerCase()}.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-accent">
                      Explorar
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.2}>
        <section className="px-6 py-10 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Selección destacada
                </p>
                <h2 className="mt-2 font-heading text-2xl md:text-3xl">
                  Recursos recomendados
                </h2>
              </div>
              <Link to="/resources" className="text-sm text-brand-accent">
                Ver biblioteca
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
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
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                      contributorName={resource.contributor?.name ?? null}
                      slug={resource.slug}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.24}>
        <section className="px-6 py-10 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                  Comunidad
                </p>
                <h2 className="mt-2 font-heading text-2xl md:text-3xl">
                  Colaboradores destacados
                </h2>
              </div>
              <Link to="/contributors" className="text-sm text-brand-accent">
                Ver todos
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
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
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {contributors.map((contributor) => (
                  <div
                    key={contributor.id}
                    className="transition-transform duration-200 hover:-translate-y-1"
                  >
                    <ContributorCard
                      name={contributor.name}
                      slug={contributor.slug}
                      shortBio={contributor.short_bio}
                      specialty={contributor.specialty}
                      avatarUrl={contributor.avatar_url}
                      websiteUrl={contributor.website_url}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.28}>
        <section className="px-6 py-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl rounded-3xl border border-surface-border bg-surface p-8 text-center shadow-[var(--shadow-card)] md:p-12">
            <h2 className="font-heading text-3xl md:text-4xl">
              Encuentra recursos y descubre a quienes los comparten
            </h2>

            <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-text-secondary">
              Toolkit Box no solo reúne materiales útiles. También te conecta con
              colaboradores, ideas y plataformas que amplían el aprendizaje y el
              acompañamiento.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-medium text-white transition hover:opacity-90"
              >
                Explorar biblioteca
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/contributors"
                className="rounded-2xl border border-surface-border bg-bg-soft px-6 py-3 font-medium text-text-primary transition hover:bg-surface-hover"
              >
                Conocer colaboradores
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  )
}