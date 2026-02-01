import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchExplore } from '../lib/ResourcesApi'
import PageHeader from '../components/PageHeader'

import ResourceCard from '../components/ResourceCard'
import ResourceCardSkeleton from '../components/ResourseCardSkeleton'
import { defaultExploreFilters } from '../lib/query'
import { AppLayout } from '../components/AppLayout'


export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetchExplore({ ...defaultExploreFilters, q, pageSize: 18 })
        if (!mounted) return
        setItems(res.items)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [q])

  return (
    <AppLayout>
      <PageHeader title="Resultados" subtitle={q ? `Búsqueda: “${q}”` : 'Escribe una búsqueda…'} />

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => <ResourceCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r: any) => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </AppLayout>
  )
}
