import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import CategoryForm from '@/components/admin/CategoryForm'
import SectionCard from '@/components/ui/SectionCard'
import { createCategory } from '@/lib/api/categories'

export default function AdminCategoryCreatePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  async function handleSubmit(values: {
    name: string
    slug: string
    is_active: boolean
  }) {
    try {
      await createCategory(values)
      toast.success(t('admin.categoryForm.createSuccess'))
      navigate('/admin/categories')
    } catch (error) {
      console.error(error)
      toast.error(t('admin.categoryForm.createError'))
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-brand-primary">
          {t('admin.categoryForm.badge')}
        </p>
        <h1 className="mt-2 font-heading text-3xl md:text-4xl">
          {t('admin.categoryForm.createTitle')}
        </h1>
        <p className="mt-3 text-sm text-text-secondary">
          {t('admin.categoryForm.createSubtitle')}
        </p>
      </div>

      <SectionCard className="p-6">
        <CategoryForm
          onSubmit={handleSubmit}
          submitLabel={t('admin.categoryForm.createAction')}
        />
      </SectionCard>
    </div>
  )
}