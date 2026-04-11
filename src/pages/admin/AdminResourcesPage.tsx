import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  activateResource,
  deactivateResource,
  getAdminResources,
} from '@/lib/api/resources'

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
      setItems((data ?? []) as ResourceListItem[])
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
    const confirmed = window.confirm(
      `${action === 'unpublish' ? 'Unpublish' : 'Publish'} "${item.title}"?`,
    )

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
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Resources</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage all resources published on the platform.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-white px-4 py-2 text-sm outline-none transition focus:border-brand-primary sm:w-72"
          />

          <Link
            to="/admin/resources/new"
            className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            New resource
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-surface-border bg-white p-4">
          <p className="text-sm text-text-secondary">Total</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">{items.length}</p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-white p-4">
          <p className="text-sm text-text-secondary">Published</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {items.filter((item) => item.is_published).length}
          </p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-white p-4">
          <p className="text-sm text-text-secondary">Featured</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {items.filter((item) => item.is_featured).length}
          </p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-white p-4">
          <p className="text-sm text-text-secondary">Public</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {items.filter((item) => item.is_public).length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
        <div className="border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-text-primary">Resource list</h2>
        </div>

        {loading ? (
          <div className="px-4 py-8 text-sm text-text-secondary">Loading resources...</div>
        ) : error ? (
          <div className="px-4 py-8 text-sm text-red-600">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="px-4 py-8 text-sm text-text-secondary">
            No resources found.
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-surface-border bg-bg-soft text-sm font-medium text-text-secondary">
                      {item.title.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-text-primary">{item.title}</p>

                      {item.is_featured ? (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                          Featured
                        </span>
                      ) : null}

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {item.is_published ? 'Published' : 'Unpublished'}
                      </span>

                      {item.is_public ? (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          Public
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 text-sm text-text-secondary">@{item.slug}</p>

                    <div className="mt-1 flex flex-wrap gap-3 text-sm text-text-secondary">
                      <span>{item.resource_type ?? 'No type'}</span>
                      <span>•</span>
                      <span>{item.contributor?.name ?? 'No contributor'}</span>
                      <span>•</span>
                      <span>{item.category?.name ?? 'No category'}</span>
                    </div>

                    {item.short_description ? (
                      <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-text-secondary">
                        {item.short_description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    to={`/resources/${item.slug}`}
                    className="inline-flex items-center justify-center rounded-xl border border-surface-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-soft"
                  >
                    View
                  </Link>

                  <Link
                    to={`/admin/resources/${item.id}/edit`}
                    className="inline-flex items-center justify-center rounded-xl border border-surface-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-soft"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleTogglePublished(item)}
                    disabled={processingId === item.id}
                    className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      item.is_published
                        ? 'border-red-200 text-red-700 hover:bg-red-50'
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {processingId === item.id
                      ? item.is_published
                        ? 'Unpublishing...'
                        : 'Publishing...'
                      : item.is_published
                      ? 'Unpublish'
                      : 'Publish'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}