import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CategoryForm from '@/components/admin/CategoryForm'
import { getCategoryById, updateCategory } from '@/lib/api/categories'

type CategoryRecord = {
  id: string
  name: string
  slug: string
  is_active: boolean
}

export default function AdminCategoryEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [category, setCategory] = useState<CategoryRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategory() {
      if (!id) {
        setError('Category id is missing.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getCategoryById(id)
        setCategory(data as CategoryRecord)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load category.')
      } finally {
        setLoading(false)
      }
    }

    void loadCategory()
  }, [id])

  async function handleSubmit(values: {
    name: string
    slug: string
    is_active: boolean
  }) {
    if (!id) {
      throw new Error('Category id is missing.')
    }

    await updateCategory(id, values)
    navigate('/admin/categories')
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-surface-border bg-white p-6">
          <p className="text-sm text-text-secondary">Loading category...</p>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-700">
            Could not load category
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {error ?? 'Category not found.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Edit category
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Update this resource category.
        </p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-white p-6">
        <CategoryForm
          initialValues={{
            name: category.name,
            slug: category.slug,
            is_active: category.is_active,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </div>
    </div>
  )
}