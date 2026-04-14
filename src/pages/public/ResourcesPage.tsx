import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Filter,
  FolderKanban,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import ResourceCard from '@/components/resources/ResourceCard'
import FadeIn from '@/components/ui/FadeIn'
import EmptyState from '@/components/ui/EmptyState'
import SearchInput from '@/components/ui/SearchInput'
import AppButton from '@/components/ui/AppButton'
import AppSelect from '@/components/ui/AppSelect'
import SectionCard from '@/components/ui/SectionCard'
import {
  getActiveResourceCategories,
  getPublishedResources,
  type ResourceCategory,
} from '@/lib/api/resources'
import type { ResourceListItem } from '@/types/resources'

const typeOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' },
  { label: 'Imagen', value: 'image' },
  { label: 'Documento', value: 'document' },
  { label: 'Enlace', value: 'link' },
  { label: 'Descarga', value: 'download' },
]

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceListItem[]>([])
  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') ?? 'all',
  )
  const [selectedType, setSelectedType] = useState(
    searchParams.get('type') ?? 'all',
  )

  useEffect(() => {
    let active = true

    const loadPageData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [resourceData, categoryData] = await Promise.all([
          getPublishedResources(),
          getActiveResourceCategories(),
        ])

        if (!active) return
        setResources(resourceData as unknown as ResourceListItem[])
        setCategories(categoryData)
      } catch (err) {
        if (!active) return

        const message =
          err instanceof Error ? err.message : 'No se pudieron cargar los recursos.'

        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadPageData()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const nextParams = new URLSearchParams()
    const normalizedQuery = query.trim()

    if (normalizedQuery) {
      nextParams.set('q', normalizedQuery)
    }

    if (selectedCategory !== 'all') {
      nextParams.set('category', selectedCategory)
    }

    if (selectedType !== 'all') {
      nextParams.set('type', selectedType)
    }

    setSearchParams(nextParams, { replace: true })
  }, [query, selectedCategory, selectedType, setSearchParams])

  const filteredResources = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return resources.filter((resource) => {
      const matchesQuery =
        !normalized ||
        resource.title.toLowerCase().includes(normalized) ||
        (resource.short_description || resource.description || '')
          .toLowerCase()
          .includes(normalized) ||
        (resource.contributor?.name || '').toLowerCase().includes(normalized) ||
        (resource.category?.name || '').toLowerCase().includes(normalized)

      const matchesCategory =
        selectedCategory === 'all' || resource.category?.slug === selectedCategory

      const matchesType =
        selectedType === 'all' || resource.resource_type === selectedType

      return matchesQuery && matchesCategory && matchesType
    })
  }, [query, resources, selectedCategory, selectedType])

  const hasActiveFilters =
    query.trim() !== '' || selectedCategory !== 'all' || selectedType !== 'all'

  const clearFilters = () => {
    setQuery('')
    setSelectedCategory('all')
    setSelectedType('all')
  }

  return (
    <div className="bg-bg text-text-primary">
      <FadeIn>
        <section className="relative overflow-hidden px-6 py-14 md:px-10 lg:px-16 lg:py-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,116,115,0.10),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,171,199,0.10),transparent_28%)]" />
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                Biblioteca
              </p>
              <h1 className="mt-2 font-heading text-4xl md:text-5xl">
                Explora recursos
              </h1>
              <p className="mt-4 font-body text-lg text-text-secondary">
                Encuentra materiales compartidos por colaboradores y accede a recursos
                útiles para formación, bienestar, liderazgo y acompañamiento.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SectionCard className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg">Biblioteca curada</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Recursos organizados para exploración clara y útil.
                </p>
              </SectionCard>

              <SectionCard className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg">Búsqueda flexible</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Filtra por tema, tipo y encuentra materiales relevantes rápido.
                </p>
              </SectionCard>

              <SectionCard className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Filter className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg">Exploración guiada</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Descubre recursos según tus intereses y necesidades reales.
                </p>
              </SectionCard>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="px-6 pb-10 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <SectionCard className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-soft text-text-secondary">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-heading text-lg text-text-primary">Filtros</h2>
                  <p className="text-sm text-text-secondary">
                    Ajusta tu búsqueda por nombre, categoría o tipo.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Buscar por título, colaborador o categoría..."
                />

                <AppSelect
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </AppSelect>

                <AppSelect
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {typeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </AppSelect>

                <AppButton
                  variant="secondary"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                >
                  Limpiar
                </AppButton>
              </div>
            </SectionCard>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.12}>
        <section className="px-6 pb-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
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
              <SectionCard className="border-red-500/20 bg-red-500/10 p-6">
                <h2 className="font-heading text-xl">No pudimos cargar los recursos</h2>
                <p className="mt-2 text-sm text-text-secondary">{error}</p>
              </SectionCard>
            ) : filteredResources.length === 0 ? (
              <EmptyState
                icon={<FolderKanban className="h-5 w-5" />}
                title="No encontramos resultados"
                description="Intenta ajustar tu búsqueda o limpiar los filtros aplicados."
                actionLabel={hasActiveFilters ? 'Limpiar filtros' : undefined}
                onAction={hasActiveFilters ? clearFilters : undefined}
              />
            ) : (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-text-secondary">
                      {filteredResources.length}{' '}
                      {filteredResources.length === 1
                        ? 'recurso encontrado'
                        : 'recursos encontrados'}
                    </p>

                    {hasActiveFilters ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-text-secondary">
                        Filtros activos
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredResources.map((resource, index) => (
                    <FadeIn key={resource.id} delay={0.02 * (index % 6)}>
                      <div className="transition-transform duration-200 hover:-translate-y-1">
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
                    </FadeIn>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </FadeIn>
    </div>
  )
}