import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ResourceCard from '@/components/resources/ResourceCard'
import StatCard from '@/components/dashboard/StatCards'
import {
  getDashboardStats,
  getRecentDownloads,
  getRecentLibraryResources,
  type DashboardStats,
} from '@/lib/api/dashboard'
import { useAuth } from '@/auth/useAuth'
import type { ResourceListItem } from '@/types/resources'

export default function DashboardHomePage() {
  const { user, profile } = useAuth()

  const [stats, setStats] = useState<DashboardStats>({
    savedCount: 0,
    favoriteCount: 0,
    downloadCount: 0,
  })
  const [recentLibrary, setRecentLibrary] = useState<ResourceListItem[]>([])
  const [recentDownloads, setRecentDownloads] = useState<ResourceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      if (!user) return

      try {
        setLoading(true)
        setError(null)

        const [statsData, libraryData, downloadData] = await Promise.all([
          getDashboardStats(user.id),
          getRecentLibraryResources(user.id),
          getRecentDownloads(user.id),
        ])

        if (!active) return

        setStats(statsData)
        setRecentLibrary(libraryData)
        setRecentDownloads(downloadData as unknown as ResourceListItem[])
      } catch (err) {
        if (!active) return
        const message =
          err instanceof Error ? err.message : 'No se pudo cargar el dashboard.'
        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadDashboard()

    return () => {
      active = false
    }
  }, [user])

  return (
    <div className="bg-bg text-text-primary">
      <section className="px-0 py-2">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-surface-border bg-surface p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
              Dashboard
            </p>
            <h1 className="mt-3 font-heading text-4xl md:text-5xl">
              Bienvenida{profile?.full_name ? `, ${profile.full_name}` : ''}
            </h1>
            <p className="mt-4 max-w-2xl font-body text-lg text-text-secondary">
              Desde aquí puedes revisar tu actividad, encontrar tus recursos guardados
              y acceder rápidamente a tu biblioteca personal.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/resources"
                className="rounded-2xl bg-brand-primary px-5 py-3 font-medium text-white transition hover:opacity-90"
              >
                Explorar recursos
              </Link>

              <Link
                to="/dashboard/library"
                className="rounded-2xl border border-surface-border bg-bg-soft px-5 py-3 font-medium text-text-primary transition hover:bg-surface-hover"
              >
                Ver mi librería
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-0 py-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-surface-border bg-surface p-6"
                >
                  <div className="h-4 w-24 rounded bg-bg-soft" />
                  <div className="mt-4 h-10 w-16 rounded bg-bg-soft" />
                  <div className="mt-4 h-4 w-32 rounded bg-bg-soft" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
              <h2 className="font-heading text-xl">No pudimos cargar tu panel</h2>
              <p className="mt-2 text-sm text-text-secondary">{error}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <StatCard
                label="Guardados"
                value={stats.savedCount}
                helper="Recursos que has guardado."
              />
              <StatCard
                label="Favoritos"
                value={stats.favoriteCount}
                helper="Tus materiales destacados."
              />
              <StatCard
                label="Descargas"
                value={stats.downloadCount}
                helper="Recursos descargados recientemente."
              />
            </div>
          )}
        </div>
      </section>

      <section className="px-0 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                Tu actividad
              </p>
              <h2 className="mt-2 font-heading text-3xl">Recursos recientes</h2>
            </div>
            <Link to="/dashboard/library" className="text-sm text-brand-accent">
              Ver librería
            </Link>
          </div>

          {recentLibrary.length === 0 ? (
            <div className="rounded-3xl border border-surface-border bg-surface p-8 text-center">
              <h3 className="font-heading text-2xl">Tu librería está vacía</h3>
              <p className="mt-3 text-text-secondary">
                Guarda o desbloquea recursos para verlos aquí.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {recentLibrary.map((resource) => (
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
          )}
        </div>
      </section>

      <section className="px-0 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                Historial
              </p>
              <h2 className="mt-2 font-heading text-3xl">Últimas descargas</h2>
            </div>
            <Link to="/dashboard/downloads" className="text-sm text-brand-accent">
              Ver descargas
            </Link>
          </div>

          {recentDownloads.length === 0 ? (
            <div className="rounded-3xl border border-surface-border bg-surface p-8 text-center">
              <h3 className="font-heading text-2xl">Aún no tienes descargas</h3>
              <p className="mt-3 text-text-secondary">
                Cuando descargues recursos, aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {recentDownloads.map((resource) => (
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
          )}
        </div>
      </section>
    </div>
  )
}