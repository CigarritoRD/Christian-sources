import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchExplore } from '../lib/ResourcesApi'
import PageHeader from '../components/PageHeader'

import SidebarFilters from '../components/SidebarFilters'
import ResourceCard from '../components/ResourceCard'
import Pagination from '../components/Pagination'
import ResourceCardSkeleton from '../components/ResourseCardSkeleton'
import { defaultExploreFilters, type ExploreFilters } from '../lib/query'
import type { Resource } from '../types/resource'
import { AppLayout } from '../components/AppLayout'

export default function Explore() {
  const [params] = useSearchParams()
  const presetTopic = params.get('topic')

  const [filters, setFilters] = useState<ExploreFilters>(() => ({
    ...defaultExploreFilters,
    topics: presetTopic ? [presetTopic] : [],
  }))
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Resource[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetchExplore(filters)
        if (!mounted) return
        setItems(res.items)
        setTotalPages(res.totalPages)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [filters])

  const right = useMemo(() => {
    return (
      <div className="inline-flex rounded-2xl border border-app surface p-1">
        <button
          onClick={() => setFilters((f) => ({ ...f, page: 1, sort: 'recent' }))}
          className={[
            'rounded-xl px-4 py-2 text-sm transition',
            filters.sort === 'recent'
              ? 'surface-2 text-app'
              : 'surface text-muted hover:text-app surface-hover',
          ].join(' ')}
        >
          Reciente
        </button>
        <button
          onClick={() => setFilters((f) => ({ ...f, page: 1, sort: 'most_viewed' }))}
          className={[
            'rounded-xl px-4 py-2 text-sm transition',
            filters.sort === 'most_viewed'
              ? 'surface-2 text-app'
              : 'surface text-muted hover:text-app surface-hover',
          ].join(' ')}
        >
          Más visto
        </button>
      </div>
    )
  }, [filters.sort])

  return (
    <AppLayout>
      <PageHeader
        title="Explorar recursos"
        subtitle="Encuentra material verificado para tu ministerio."
        right={right}
      />

      <div className="flex gap-6">
        {/* Sidebar sticky + scroll */}
        <aside className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-auto">
          <SidebarFilters value={filters} onChange={setFilters} />
        </aside>

        {/* Sidebar en pantallas menores (sin sticky, pero visible) */}
        <div className="lg:hidden w-full">
          <SidebarFilters value={filters} onChange={setFilters} />
        </div>

        <main className="flex-1">
          {/* Search bar en contenido: SOLO móvil (para no duplicar con topbar) */}
          <div className="sm:hidden mb-5 flex items-center gap-2 rounded-2xl border border-app surface px-4 py-3">
            <span className="text-muted">🔎</span>
            <input
              value={filters.q ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, page: 1, q: e.target.value }))}
              className="w-full bg-transparent text-sm text-app placeholder:text-muted outline-none"
              placeholder="Buscar por tema, ministerio o palabra clave…"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ResourceCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          )}

          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPage={(p) => setFilters((f) => ({ ...f, page: p }))}
          />
        </main>
      </div>
    </AppLayout>
  )
}
