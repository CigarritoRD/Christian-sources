import { useNavigate } from 'react-router-dom'
import CategoryForm from '@/components/admin/CategoryForm'
import { createCategory } from '@/lib/api/categories'

export default function AdminCategoryCreatePage() {
  const navigate = useNavigate()

  async function handleSubmit(values: {
    name: string
    slug: string
    is_active: boolean
  }) {
    await createCategory(values)
    navigate('/admin/categories')
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Create category
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Add a new category for organizing resources.
        </p>
      </div>
      <CategoryForm
        onSubmit={handleSubmit}
        submitLabel="Create category"
      />

    </div>
  )
}