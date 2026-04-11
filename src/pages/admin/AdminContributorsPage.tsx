import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  activateContributor,
  deactivateContributor,
  getAdminContributors,
} from '@/lib/api/contributors'

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Contributors</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage collaborator profiles shown across the platform.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search contributors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-white px-4 py-2 text-sm outline-none transition focus:border-brand-primary sm:w-72"
          />

          <Link
            to="/admin/contributors/new"
            className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            New contributor
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-surface-border bg-white p-4">
          <p className="text-sm text-text-secondary">Total</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">{items.length}</p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-white p-4">
          <p className="text-sm text-text-secondary">Active</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {items.filter((item) => item.is_active).length}
          </p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-white p-4">
          <p className="text-sm text-text-secondary">Featured</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {items.filter((item) => item.is_featured).length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white">
        <div className="border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-text-primary">Contributor list</h2>
        </div>

        {loading ? (
          <div className="px-4 py-8 text-sm text-text-secondary">Loading contributors...</div>
        ) : error ? (
          <div className="px-4 py-8 text-sm text-red-600">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="px-4 py-8 text-sm text-text-secondary">
            No contributors found.
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-surface-border bg-bg-soft text-sm font-medium text-text-secondary">
                      {item.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-text-primary">{item.name}</p>

                      {item.is_featured ? (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                          Featured
                        </span>
                      ) : null}

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-text-secondary">@{item.slug}</p>

                    {item.specialty ? (
                      <p className="mt-1 text-sm text-text-secondary">{item.specialty}</p>
                    ) : null}

                    {item.short_bio ? (
                      <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-text-secondary">
                        {item.short_bio}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
  <Link
    to={`/contributors/${item.slug}`}
    className="inline-flex items-center justify-center rounded-xl border border-surface-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-soft"
  >
    View
  </Link>

  <Link
    to={`/admin/contributors/${item.id}/edit`}
    className="inline-flex items-center justify-center rounded-xl border border-surface-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-bg-soft"
  >
    Edit
  </Link>

  <button
    type="button"
    onClick={async () => {
      const action = item.is_active ? 'deactivate' : 'activate'
      const confirmed = window.confirm(
        `${action === 'deactivate' ? 'Deactivate' : 'Activate'} "${item.name}"?`
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
            : 'Failed to update contributor status.'
        )
      } finally {
        setProcessingId(null)
      }
    }}
    disabled={processingId === item.id}
    className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
      item.is_active
        ? 'border-red-200 text-red-700 hover:bg-red-50'
        : 'border-green-200 text-green-700 hover:bg-green-50'
    }`}
  >
    {processingId === item.id
      ? item.is_active
        ? 'Deactivating...'
        : 'Activating...'
      : item.is_active
      ? 'Deactivate'
      : 'Activate'}
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