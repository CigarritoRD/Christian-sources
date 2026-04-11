import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, UserPlus, Users } from 'lucide-react'
import {
  activateContributor,
  deactivateContributor,
  getAdminContributors,
} from '@/lib/api/contributors'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import PageHeader from '@/components/ui/PageHeader'
import SectionCard from '@/components/ui/SectionCard'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'

type ContributorListItem = {
  id: string
  name: string
  slug: string
  short_bio?: string | null
  specialty?: string | null
  avatar_url?: string | null
  website_url?: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export default function AdminContributorsPage() {
  const [items, setItems] = useState<ContributorListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function loadContributors() {
    try {
      setLoading(true)
      setError(null)
      const data = await getAdminContributors()
      setItems((data ?? []) as ContributorListItem[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contributors.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadContributors()
  }, [])

  const filteredItems = items.filter((item) => {
    const term = search.trim().toLowerCase()
    if (!term) return true

    return (
      item.name.toLowerCase().includes(term) ||
      item.slug.toLowerCase().includes(term) ||
      (item.specialty ?? '').toLowerCase().includes(term)
    )
  })

  async function handleToggle(item: ContributorListItem) {
    const action = item.is_active ? 'deactivate' : 'activate'
    const confirmed = window.confirm(
      `${action === 'deactivate' ? 'Deactivate' : 'Activate'} "${item.name}"?`,
    )
    if (!confirmed) return

    try {
      setProcessingId(item.id)

      if (item.is_active) {
        await deactivateContributor(item.id)
      } else {
        await activateContributor(item.id)
      }

      await loadContributors()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update contributor status.',
      )
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contributors"
        description="Manage collaborator profiles shown across the platform."
        actions={
          <Link to="/admin/contributors/new">
            <AppButton>
              <UserPlus className="h-4 w-4" />
              New contributor
            </AppButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total"
          value={items.length}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Active"
          value={items.filter((item) => item.is_active).length}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Featured"
          value={items.filter((item) => item.is_featured).length}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <SectionCard className="p-4">
        <div className="max-w-md">
          <AppInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contributors..."
            className="pl-10"
          />
          <Search className="pointer-events-none relative -mt-8 ml-3 h-4 w-4 text-text-secondary" />
        </div>
      </SectionCard>

      <SectionCard className="overflow-hidden">
        <div className="border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-text-primary">Contributor list</h2>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-sm text-text-secondary">
            Loading contributors...
          </div>
        ) : error ? (
          <div className="px-4 py-6 text-sm text-red-600">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="px-4 py-6 text-sm text-text-secondary">
            No contributors found.
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-bg-soft text-sm font-medium text-text-secondary">
                      {item.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-text-primary">
                        {item.name}
                      </p>

                      {item.is_featured ? (
                        <StatusBadge label="Featured" tone="warning" />
                      ) : null}

                      <StatusBadge
                        label={item.is_active ? 'Active' : 'Inactive'}
                        tone={item.is_active ? 'success' : 'muted'}
                      />
                    </div>

                    <p className="mt-0.5 text-sm text-text-secondary">@{item.slug}</p>

                    {item.specialty ? (
                      <p className="mt-0.5 text-sm text-text-secondary">
                        {item.specialty}
                      </p>
                    ) : null}

                    {item.short_bio ? (
                      <p className="mt-1 line-clamp-1 max-w-2xl text-sm text-text-secondary">
                        {item.short_bio}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link to={`/contributors/${item.slug}`}>
                    <AppButton variant="ghost">View</AppButton>
                  </Link>

                  <Link to={`/admin/contributors/${item.id}/edit`}>
                    <AppButton variant="secondary">Edit</AppButton>
                  </Link>

                  <AppButton
                    variant={item.is_active ? 'danger' : 'success'}
                    disabled={processingId === item.id}
                    onClick={() => void handleToggle(item)}
                  >
                    {processingId === item.id
                      ? item.is_active
                        ? 'Deactivating...'
                        : 'Activating...'
                      : item.is_active
                      ? 'Deactivate'
                      : 'Activate'}
                  </AppButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}