import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '@/components/ui/EmptyState'
import { FolderKanban, Plus, TrendingUp } from 'lucide-react'
import {
  activateResource,
  deactivateResource,
  getAdminResources,
} from '@/lib/api/resources'
import AppButton from '@/components/ui/AppButton'

import PageHeader from '@/components/ui/PageHeader'
import SectionCard from '@/components/ui/SectionCard'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { confirmAction } from '@/lib/api/confirm'
import SearchInput from '@/components/ui/SearchInput'

type ResourceListItem = {
  id: string
  title: string
  slug: string
  short_description?: string | null
  thumbnail_url?: string | null
  resource_type?: string | null
  contributor_id: string
  category_id: string
  is_featured: boolean
  is_public: boolean
  is_published: boolean
  created_at: string
  contributor?: {
    id: string
    name: string
    slug: string
  } | null
  category?: {
    id: string
    name: string
    slug: string
  } | null
}

export default function AdminResourcesPage() {
  const [items, setItems] = useState<ResourceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function loadResources() {
    try {
      setLoading(true)
      setError(null)
      const data = await getAdminResources()
      setItems((data ?? []) as unknown as ResourceListItem[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resources.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadResources()
  }, [])

  const filteredItems = items.filter((item) => {
    const term = search.trim().toLowerCase()
    if (!term) return true

    return (
      item.title.toLowerCase().includes(term) ||
      item.slug.toLowerCase().includes(term) ||
      (item.resource_type ?? '').toLowerCase().includes(term) ||
      (item.contributor?.name ?? '').toLowerCase().includes(term) ||
      (item.category?.name ?? '').toLowerCase().includes(term)
    )
  })

  async function handleTogglePublished(item: ResourceListItem) {
    const action = item.is_published ? 'unpublish' : 'publish'
    const confirmed = await confirmAction({
      title: `${action === 'unpublish' ? 'Unpublish' : 'Publish'} resource?`,
      text: item.title,
      confirmText: action === 'unpublish' ? 'Unpublish' : 'Publish',
    })

    if (!confirmed) return

    try {
      setProcessingId(item.id)

      if (item.is_published) {
        await deactivateResource(item.id)
      } else {
        await activateResource(item.id)
      }

      await loadResources()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update resource status.',
      )
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Resources"
        description="Manage all resources published on the platform."
        actions={
          <Link to="/admin/resources/new">
            <AppButton>
              <Plus className="h-4 w-4" />
              New resource
            </AppButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          label="Total"
          value={items.length}
          icon={<FolderKanban className="h-4 w-4" />}
        />
        <StatCard
          label="Published"
          value={items.filter((item) => item.is_published).length}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Featured"
          value={items.filter((item) => item.is_featured).length}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Public"
          value={items.filter((item) => item.is_public).length}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <SectionCard className="p-4">
        <div className="max-w-md">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search resources..."
          />
        </div>
      </SectionCard>

      <SectionCard className="overflow-hidden">
        <div className="border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-text-primary">Resource list</h2>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-sm text-brand-primary">
            Loading resources...
          </div>
        ) : error ? (
          <div className="px-4 py-6 text-sm text-red-600">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<FolderKanban className="h-5 w-5" />}
              title="No resources found"
              description="Try a different search or add a new resource to the platform."
            />
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-surface-border bg-bg-soft text-sm font-medium text-brand-primary">
                      {item.title.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-text-primary">
                        {item.title}
                      </p>

                      {item.is_featured ? (
                        <StatusBadge label="Featured" tone="warning" />
                      ) : null}

                      <StatusBadge
                        label={item.is_published ? 'Published' : 'Draft'}
                        tone={item.is_published ? 'success' : 'muted'}
                      />

                      {item.is_public ? (
                        <StatusBadge label="Public" tone="info" />
                      ) : null}
                    </div>

                    <p className="mt-0.5 text-sm text-brand-primary">@{item.slug}</p>

                    <p className="mt-0.5 text-sm text-brand-primary">
                      {item.contributor?.name ?? 'No contributor'} ·{' '}
                      {item.category?.name ?? 'No category'} ·{' '}
                      {item.resource_type ?? 'No type'}
                    </p>

                    {item.short_description ? (
                      <p className="mt-1 line-clamp-1 max-w-2xl text-sm text-brand-primary">
                        {item.short_description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link to={`/resources/${item.slug}`}>
                    <AppButton variant="ghost">View</AppButton>
                  </Link>

                  <Link to={`/admin/resources/${item.id}/edit`}>
                    <AppButton variant="secondary">Edit</AppButton>
                  </Link>

                  <AppButton
                    variant={item.is_published ? 'danger' : 'success'}
                    disabled={processingId === item.id}
                    onClick={() => void handleTogglePublished(item)}
                  >
                    {processingId === item.id
                      ? item.is_published
                        ? 'Unpublishing...'
                        : 'Publishing...'
                      : item.is_published
                        ? 'Unpublish'
                        : 'Publish'}
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