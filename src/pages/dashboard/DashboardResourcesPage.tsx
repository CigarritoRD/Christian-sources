import { useEffect, useMemo, useState } from 'react'
import { Filter, FolderKanban} from 'lucide-react'
import ResourceCard from '@/components/resources/ResourceCard'
import FadeIn from '@/components/ui/FadeIn'
import EmptyState from '@/components/ui/EmptyState'
import SearchInput from '@/components/ui/SearchInput'
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

export default function DashboardResourcesPage() {
  const [resources, setResources] = useState<ResourceListItem[]>([])
  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    let active = true

    const loadData = async () => {
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

    void loadData()

    return () => {
      active = false
    }
  }, [])

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
        <section className="px-0 py-2">
          <div className="mx-auto max-w-7xl">
            <SectionCard className="p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                Dashboard
              </p>
              <h1 className="mt-3 font-heading text-4xl md:text-5xl">
                Explorar recursos
              </h1>
              <p className="mt-4 max-w-2xl font-body text-lg text-text-secondary">
                Descubre materiales desde tu panel personal y encuentra recursos útiles
                por tema, tipo o colaborador.
              </p>
            </SectionCard>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.06}>
        <section className="px-0 py-8">
          <div className="mx-auto max-w-7xl">
            <SectionCard className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg text-text-primary">Filtros</h2>
                  <p className="text-sm text-text-secondary">
                    Ajusta tu búsqueda rápidamente.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
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
              </div>

              {hasActiveFilters ? (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-2xl border border-surface-border bg-bg-soft px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : null}
            </SectionCard>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section className="px-0 py-2">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]"
                  >
                    <div className="mb-4 aspect-[4/3] rounded-2xl bg-bg-soft" />
                    <div className="h-5 w-20 rounded bg-bg-soft" />
                    <div className="mt-4 h-6 w-3/4 rounded bg-bg-soft" />
                    <div className="mt-2 h-4 w-full rounded bg-bg-soft" />
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
                description="Prueba con otra búsqueda o ajusta los filtros."
              />
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-text-secondary">
                    {filteredResources.length}{' '}
                    {filteredResources.length === 1
                      ? 'recurso encontrado'
                      : 'recursos encontrados'}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredResources.map((resource, index) => (
                    <FadeIn key={resource.id} delay={0.02 * (index % 8)}>
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