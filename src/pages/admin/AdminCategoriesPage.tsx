import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Grid2x2, Plus, Shapes } from 'lucide-react'
import {
  activateCategory,
  deactivateCategory,
  getAllCategories,
} from '@/lib/api/categories'
import AppButton from '@/components/ui/AppButton'

import PageHeader from '@/components/ui/PageHeader'
import SectionCard from '@/components/ui/SectionCard'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { confirmAction } from '@/lib/api/confirm'
import SearchInput from '@/components/ui/SearchInput'
import EmptyState from '@/components/ui/EmptyState'

type CategoryItem = {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function loadCategories() {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllCategories()
      setItems((data ?? []) as CategoryItem[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCategories()
  }, [])

  const filteredItems = items.filter((item) => {
    const term = search.trim().toLowerCase()
    if (!term) return true

    return (
      item.name.toLowerCase().includes(term) ||
      item.slug.toLowerCase().includes(term)
    )
  })

  async function handleToggle(item: CategoryItem) {
    const action = item.is_active ? 'deactivate' : 'activate'
    const confirmed = await confirmAction({
      title: `${action === 'deactivate' ? 'Deactivate' : 'Activate'} category?`,
      text: item.name,
      confirmText: action === 'deactivate' ? 'Deactivate' : 'Activate',
    })

    if (!confirmed) return

    try {
      setProcessingId(item.id)

      if (item.is_active) {
        await deactivateCategory(item.id)
      } else {
        await activateCategory(item.id)
      }

      await loadCategories()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update category status.',
      )
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Categories"
        description="Manage categories used to organize resources across the platform."
        actions={
          <Link to="/admin/categories/new">
            <AppButton>
              <Plus className="h-4 w-4" />
              New category
            </AppButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total"
          value={items.length}
          icon={<Grid2x2 className="h-4 w-4" />}
        />
        <StatCard
          label="Active"
          value={items.filter((item) => item.is_active).length}
          icon={<Shapes className="h-4 w-4" />}
        />
        <StatCard
          label="Inactive"
          value={items.filter((item) => !item.is_active).length}
          icon={<Shapes className="h-4 w-4" />}
        />
      </div>

      <SectionCard className="p-4">
        <div className="max-w-md">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search categories..."
          />
        </div>
      </SectionCard>

      <SectionCard className="overflow-hidden">
        <div className="border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-text-primary">Category list</h2>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-sm text-brand-primary">
            Loading categories...
          </div>
        ) : error ? (
          <div className="px-4 py-6 text-sm text-red-600">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<Grid2x2 className="h-5 w-5" />}
              title="No categories found"
              description="Try a different search or create a new category."
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
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-surface-border bg-bg-soft text-brand-primary">
                    <Grid2x2 className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-text-primary">
                        {item.name}
                      </p>

                      <StatusBadge
                        label={item.is_active ? 'Active' : 'Inactive'}
                        tone={item.is_active ? 'success' : 'muted'}
                      />
                    </div>

                    <p className="mt-0.5 text-sm text-brand-primary">@{item.slug}</p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link to={`/admin/categories/${item.id}/edit`}>
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