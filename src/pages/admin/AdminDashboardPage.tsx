import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  Grid2x2,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  getAdminDashboardStats,
  getRecentContributors,
  getRecentResources,
  type AdminDashboardStats,
  type AdminRecentContributor,
  type AdminRecentResource,
} from '@/lib/api/admin'
import AppButton from '@/components/ui/AppButton'
import PageHeader from '@/components/ui/PageHeader'
import SectionCard from '@/components/ui/SectionCard'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [recentContributors, setRecentContributors] = useState<AdminRecentContributor[]>([])
  const [recentResources, setRecentResources] = useState<AdminRecentResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError(null)

        const [statsData, contributorsData, resourcesData] = await Promise.all([
          getAdminDashboardStats(),
          getRecentContributors(5),
          getRecentResources(5),
        ])

        setStats(statsData)
        setRecentContributors(contributorsData)
        setRecentResources(resourcesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admin dashboard.')
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionCard className="p-6">
          <p className="text-sm text-text-secondary">Loading dashboard...</p>
        </SectionCard>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <SectionCard className="border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-700">
            Could not load admin dashboard
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {error ?? 'Unknown error.'}
          </p>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin dashboard"
        description="Manage contributors, resources, categories, and platform activity."
        actions={
          <>
            <Link to="/admin/contributors/new">
              <AppButton variant="secondary">New contributor</AppButton>
            </Link>
            <Link to="/admin/resources/new">
              <AppButton>New resource</AppButton>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Contributors"
          value={stats.totalContributors}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Active contributors"
          value={stats.activeContributors}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Resources"
          value={stats.totalResources}
          icon={<FolderKanban className="h-4 w-4" />}
        />
        <StatCard
          label="Published"
          value={stats.publishedResources}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Downloads"
          value={stats.totalDownloads}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <QuickActionCard
          icon={<Users className="h-5 w-5" />}
          title="Create contributor"
          description="Add a new public contributor profile."
          to="/admin/contributors/new"
          actionLabel="New contributor"
        />

        <QuickActionCard
          icon={<FolderKanban className="h-5 w-5" />}
          title="Create resource"
          description="Publish a new resource and connect it to a contributor."
          to="/admin/resources/new"
          actionLabel="New resource"
        />

        <QuickActionCard
          icon={<Grid2x2 className="h-5 w-5" />}
          title="Manage categories"
          description="Create and organize categories used across resources."
          to="/admin/categories"
          actionLabel="Go to categories"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
            <div>
              <h2 className="font-heading text-lg text-text-primary">
                Recent contributors
              </h2>
              <p className="text-sm text-text-secondary">
                Latest contributor profiles created.
              </p>
            </div>

            <Link to="/admin/contributors">
              <AppButton variant="ghost">View all</AppButton>
            </Link>
          </div>

          <div className="divide-y divide-surface-border">
            {recentContributors.length === 0 ? (
              <div className="px-5 py-8 text-sm text-text-secondary">
                No contributors yet.
              </div>
            ) : (
              recentContributors.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {item.avatar_url ? (
                      <img
                        src={item.avatar_url}
                        alt={item.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-bg-soft text-sm font-medium text-text-secondary">
                        {item.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-medium text-text-primary">
                        {item.name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {item.specialty ?? 'No specialty'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge
                      label={item.is_active ? 'Active' : 'Inactive'}
                      tone={item.is_active ? 'success' : 'muted'}
                    />

                    <Link to={`/admin/contributors/${item.id}/edit`}>
                      <AppButton variant="secondary">Edit</AppButton>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
            <div>
              <h2 className="font-heading text-lg text-text-primary">
                Recent resources
              </h2>
              <p className="text-sm text-text-secondary">
                Latest resources added to the platform.
              </p>
            </div>

            <Link to="/admin/resources">
              <AppButton variant="ghost">View all</AppButton>
            </Link>
          </div>

          <div className="divide-y divide-surface-border">
            {recentResources.length === 0 ? (
              <div className="px-5 py-8 text-sm text-text-secondary">
                No resources yet.
              </div>
            ) : (
              recentResources.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-surface-border bg-bg-soft text-sm font-medium text-text-secondary">
                        {item.title.slice(0, 1).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-medium text-text-primary">
                        {item.title}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {item.contributor?.name ?? 'No contributor'} ·{' '}
                        {item.resource_type ?? 'No type'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.is_featured ? (
                      <StatusBadge label="Featured" tone="warning" />
                    ) : null}

                    <StatusBadge
                      label={item.is_published ? 'Published' : 'Draft'}
                      tone={item.is_published ? 'success' : 'muted'}
                    />

                    <Link to={`/admin/resources/${item.id}/edit`}>
                      <AppButton variant="secondary">Edit</AppButton>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

function QuickActionCard({
  icon,
  title,
  description,
  to,
  actionLabel,
}: {
  icon: React.ReactNode
  title: string
  description: string
  to: string
  actionLabel: string
}) {
  return (
    <SectionCard className="p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        {icon}
      </div>

      <h2 className="mt-4 font-heading text-lg text-text-primary">{title}</h2>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>

      <div className="mt-4">
        <Link to={to}>
          <AppButton>{actionLabel}</AppButton>
        </Link>
      </div>
    </SectionCard>
  )
}