import { useEffect, useMemo, useState } from 'react'
import type { Resource } from '../types/resource'
import { fetchHomeRows } from '../lib/ResourcesApi'

import ResourceCardSkeleton from '../components/ResourseCardSkeleton'
import CarouselRow from '../components/CarouselRow'
import HeroFullBleed from '../components/HeroFullBleed'
import { AppLayout } from '../components/AppLayout'

export default function Home() {
  const [items, setItems] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const totalResources = 1250
  const totalVideos = 332
  const totalPdfs = 996

  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          setLoading(true)
          const data = await fetchHomeRows()
          if (mounted) setItems(data)
        } finally {
          if (mounted) setLoading(false)
        }
      })()
    return () => { mounted = false }
  }, [])

  const recent = useMemo(() => items.slice(0, 18), [items])
  const mostViewed = useMemo(
    () => [...items].sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0)).slice(0, 18),
    [items]
  )

  const byTopic = useMemo(() => {
    const map = new Map<string, Resource[]>()
    for (const r of items) {
      const key = r.topic?.trim() || 'Recursos'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(r)
    }
    return Array.from(map.entries()).slice(0, 5)
  }, [items])

  return (
    <AppLayout showSearch={false} hero={<HeroFullBleed
  bgImageUrl="/hero-church.jpg"
  stats={{
    totalResources,
    totalVideos,
    totalPdfs,
  }}
/>
    }>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResourceCardSkeleton key={i} variant="carousel" />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          <CarouselRow title="Más reciente" items={recent} />
          <CarouselRow title="Más vistos" items={mostViewed} />
          {byTopic.map(([topic, arr]) => (
            <CarouselRow key={topic} title={topic} items={arr.slice(0, 18)} />
          ))}
        </div>
      )}
    </AppLayout>
  )
}
