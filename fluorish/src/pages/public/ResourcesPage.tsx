import { useEffect, useMemo, useState } from 'react'
import ResourceCard from '@/components/resources/ResourceCard'
import {
  getActiveResourceCategories,
  getPublishedResources,
  type ResourceCategory,
} from '@/lib/api/resources'
import type { ResourceListItem } from '@/types/resources'
import { useSearchParams } from 'react-router-dom'
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

        setResources(resourceData)
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
      <section className="px-6 py-14 md:px-10 lg:px-16">
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

          <div className="mt-8 rounded-3xl border border-surface-border bg-surface p-5 shadow-soft">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título, colaborador o categoría..."
                className="w-full rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-text-primary outline-none transition focus:border-brand-accent"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-text-primary outline-none transition focus:border-brand-accent"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-text-primary outline-none transition focus:border-brand-accent"
              >
                {typeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="rounded-2xl border border-surface-border bg-bg-soft px-5 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Limpiar
              </button>
            </div>
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
              <h2 className="font-heading text-xl">No pudimos cargar los recursos</h2>
              <p className="mt-2 text-sm text-text-secondary">{error}</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="rounded-3xl border border-surface-border bg-surface p-8 text-center">
              <h2 className="font-heading text-2xl">No encontramos resultados</h2>
              <p className="mt-3 text-text-secondary">
                Intenta ajustar tu búsqueda o limpiar los filtros aplicados.
              </p>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex rounded-2xl bg-brand-primary px-5 py-3 text-white"
                >
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-text-secondary">
                  {filteredResources.length}{' '}
                  {filteredResources.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}
                </p>

                {hasActiveFilters ? (
                  <p className="text-sm text-text-secondary">
                    Filtros activos
                  </p>
                ) : null}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource) => (
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