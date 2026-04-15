import { useEffect, useMemo, useState } from 'react'
import { Tag } from 'lucide-react'
import { toast } from 'sonner'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { createTag, getTags, updateTag, type TagRecord } from '@/lib/api/tags'

export default function AdminTagsPage() {
  const [items, setItems] = useState<TagRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getTags()
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tags.')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return items

    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(normalized) ||
        item.slug.toLowerCase().includes(normalized)
      )
    })
  }, [items, query])

  const handleCreate = async () => {
    const normalized = newTagName.trim()
    if (!normalized) {
      toast.error('Write a tag name first.')
      return
    }

    try {
      setCreating(true)
      const created = await createTag(normalized)
      setItems((current) => [created, ...current].sort((a, b) => a.name.localeCompare(b.name)))
      setNewTagName('')
      toast.success('Tag created successfully.')
    } catch (err) {
      console.error(err)
      toast.error('Could not create tag.')
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (item: TagRecord) => {
    try {
      setUpdatingId(item.id)
      const updated = await updateTag(item.id, {
        is_active: !item.is_active,
      })

      setItems((current) =>
        current.map((row) => (row.id === item.id ? updated : row)),
      )
      toast.success(updated.is_active ? 'Tag activated.' : 'Tag deactivated.')
    } catch (err) {
      console.error(err)
      toast.error('Could not update tag.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tags"
        description="Create and manage tags to improve resource search and discovery."
      />

      <SectionCard className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search tags..."
          />

          <div className="flex gap-3">
            <AppInput
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New tag name"
            />
            <AppButton type="button" onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Create tag'}
            </AppButton>
          </div>
        </div>
      </SectionCard>

      {loading ? (
        <SectionCard className="p-6">
          <p className="text-sm text-text-secondary">Loading tags...</p>
        </SectionCard>
      ) : error ? (
        <SectionCard className="border-red-200 bg-red-50 p-6">
          <h2 className="font-heading text-lg text-red-700">Could not load tags</h2>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </SectionCard>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-5 w-5" />}
          title="No tags found"
          description="Create a tag to start organizing resource topics."
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <SectionCard key={item.id} className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-heading text-lg text-text-primary">
                      {item.name}
                    </h2>
                    <StatusBadge
                      label={item.is_active ? 'Active' : 'Inactive'}
                      tone={item.is_active ? 'success' : 'muted'}
                    />
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{item.slug}</p>
                </div>

                <div>
                  <AppButton
                    type="button"
                    variant="secondary"
                    onClick={() => handleToggle(item)}
                    disabled={updatingId === item.id}
                  >
                    {updatingId === item.id
                      ? 'Updating...'
                      : item.is_active
                      ? 'Deactivate'
                      : 'Activate'}
                  </AppButton>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  )
}