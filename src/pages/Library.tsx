import { useEffect, useState } from 'react'
import { Tabs } from '../components/Tabs'
import PageHeader from '../components/PageHeader'
import { getLibrary, type LibraryKind } from '../lib/LibraryApi'
import ResourceCardSkeleton from '../components/ResourseCardSkeleton'
import ResourceCard from '../components/ResourceCard'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import { AppLayout } from '../components/AppLayout'


export default function Library() {
  const [tab, setTab] = useState<LibraryKind>('saved')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await getLibrary(tab, page, 12)
        if (!mounted) return
        setItems(res.items)
        setTotalPages(res.totalPages)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [tab, page])

  return (
    <AppLayout>
      <PageHeader
        title="Mi biblioteca"
        subtitle="Tu colección personal de recursos guardados."
        right={
          <Tabs
            value={tab}
            onChange={(v) => { setTab(v as LibraryKind); setPage(1) }}
            items={[
              { value: 'saved', label: 'Guardados' },
              { value: 'favorite', label: 'Favoritos' },
            ]}
          />
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => <ResourceCardSkeleton key={i} />)}
        </div>
      ) : items.length ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r: any) => <ResourceCard key={r.id} resource={r} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </>
      ) : (
        <EmptyState
          title={tab === 'saved' ? 'Aún no has guardado recursos' : 'Aún no tienes favoritos'}
          subtitle="Explora recursos y presiona Guardar o Favorito para verlos aquí."
        />
      )}
    </AppLayout>
  )
}
