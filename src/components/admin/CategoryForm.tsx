import { useMemo, useState } from 'react'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import SectionCard from '@/components/ui/SectionCard'

type CategoryFormValues = {
  name: string
  slug: string
  is_active: boolean
}

type CategoryFormProps = {
  initialValues?: Partial<CategoryFormValues>
  onSubmit: (values: CategoryFormValues) => Promise<void>
  submitLabel?: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function CategoryForm({
  initialValues,
  onSubmit,
  submitLabel = 'Save category',
}: CategoryFormProps) {
  const defaults = useMemo(
    () => ({
      name: initialValues?.name ?? '',
      slug: initialValues?.slug ?? '',
      is_active: initialValues?.is_active ?? true,
    }),
    [initialValues],
  )

  const [values, setValues] = useState(defaults)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField<K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!values.name.trim()) {
      setError('Name is required.')
      return
    }

    if (!values.slug.trim()) {
      setError('Slug is required.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        name: values.name.trim(),
        slug: values.slug.trim(),
        is_active: values.is_active,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-heading">
      {error ? (
        <SectionCard className="border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </SectionCard>
      ) : null}

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">
              Basic information
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Define the public name and slug for this category.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AppInput
              label="Name"
              value={values.name}
              onChange={(e) => {
                const nextName = e.target.value
                const currentSlugMatchesName =
                  !values.slug || values.slug === slugify(values.name)

                updateField('name', nextName)

                if (currentSlugMatchesName) {
                  updateField('slug', slugify(nextName))
                }
              }}
              placeholder="Family support"
            />

            <AppInput
              label="Slug"
              value={values.slug}
              onChange={(e) => updateField('slug', slugify(e.target.value))}
              placeholder="family-support"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">
              Visibility
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Control whether this category is available for resources.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={values.is_active}
              onChange={(e) => updateField('is_active', e.target.checked)}
            />
            Active
          </label>
        </div>
      </SectionCard>

      <div className="flex items-center gap-3">
        <AppButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </AppButton>
      </div>
    </form>
  )
}