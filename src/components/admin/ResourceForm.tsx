import { useEffect, useMemo, useState } from 'react'
import type { AdminResourceInput } from '@/lib/api/resources'
import { getActiveContributors } from '@/lib/api/contributors'
import { getActiveCategories } from '@/lib/api/categories'

type ContributorOption = {
  id: string
  name: string
  slug: string
}

type CategoryOption = {
  id: string
  name: string
  slug: string
}

type ResourceFormValues = AdminResourceInput & {
  file_url?: string | null
  external_url?: string | null
}

type ResourceFormProps = {
  initialValues?: Partial<ResourceFormValues>
  onSubmit: (
    values: ResourceFormValues,
    files: {
      thumbnailFile: File | null
      resourceFile: File | null
    },
  ) => Promise<void>
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

export default function ResourceForm({
  initialValues,
  onSubmit,
  submitLabel = 'Save resource',
}: ResourceFormProps) {
  const defaults = useMemo(
    () => ({
      title: initialValues?.title ?? '',
      slug: initialValues?.slug ?? '',
      description: initialValues?.description ?? '',
      short_description: initialValues?.short_description ?? '',
      thumbnail_url: initialValues?.thumbnail_url ?? '',
      resource_type: initialValues?.resource_type ?? '',
      contributor_id: initialValues?.contributor_id ?? '',
      category_id: initialValues?.category_id ?? '',
      is_featured: initialValues?.is_featured ?? false,
      is_public: initialValues?.is_public ?? true,
      is_published: initialValues?.is_published ?? true,
      file_url: initialValues?.file_url ?? '',
      external_url: initialValues?.external_url ?? '',
    }),
    [initialValues],
  )

  const [values, setValues] = useState(defaults)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [resourceFile, setResourceFile] = useState<File | null>(null)
  const [contributors, setContributors] = useState<ContributorOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true)
        const [contributorsData, categoriesData] = await Promise.all([
          getActiveContributors(),
          getActiveCategories(),
        ])

        setContributors((contributorsData ?? []) as ContributorOption[])
        setCategories((categoriesData ?? []) as CategoryOption[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form options.')
      } finally {
        setLoadingOptions(false)
      }
    }

    void loadOptions()
  }, [])

  function updateField<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!values.title.trim()) {
      setError('Title is required.')
      return
    }

    if (!values.slug.trim()) {
      setError('Slug is required.')
      return
    }

    if (!values.contributor_id) {
      setError('Contributor is required.')
      return
    }

    if (!values.category_id) {
      setError('Category is required.')
      return
    }

    try {
      setIsSubmitting(true)

      await onSubmit(
        {
          ...values,
          title: values.title.trim(),
          slug: values.slug.trim(),
          description: values.description?.trim() || null,
          short_description: values.short_description?.trim() || null,
          thumbnail_url: values.thumbnail_url?.trim() || null,
          resource_type: values.resource_type?.trim() || null,
          contributor_id: values.contributor_id,
          category_id: values.category_id,
          file_url: values.file_url?.trim() || null,
          external_url: values.external_url?.trim() || null,
        },
        {
          thumbnailFile,
          resourceFile,
        },
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Basic information</h2>
          <p className="text-sm text-text-secondary">
            Main public information for this resource.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Title</label>
            <input
              className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
              value={values.title}
              onChange={(e) => {
                const nextTitle = e.target.value
                const currentSlugMatchesTitle =
                  !values.slug || values.slug === slugify(values.title)

                updateField('title', nextTitle)

                if (currentSlugMatchesTitle) {
                  updateField('slug', slugify(nextTitle))
                }
              }}
              placeholder="Toolkit for family mentoring"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Slug</label>
            <input
              className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
              value={values.slug}
              onChange={(e) => updateField('slug', slugify(e.target.value))}
              placeholder="toolkit-for-family-mentoring"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Resource type</label>
          <input
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            value={values.resource_type}
            onChange={(e) => updateField('resource_type', e.target.value)}
            placeholder="PDF, Guide, Video, Worksheet..."
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Descriptions</h2>
          <p className="text-sm text-text-secondary">
            Short preview text and full description.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Short description
          </label>
          <textarea
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            rows={3}
            value={values.short_description}
            onChange={(e) => updateField('short_description', e.target.value)}
            placeholder="Brief summary shown in cards and previews."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Description
          </label>
          <textarea
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            rows={6}
            value={values.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Detailed public description."
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Relationships</h2>
          <p className="text-sm text-text-secondary">
            Connect this resource to a contributor and a category.
          </p>
        </div>

        {loadingOptions ? (
          <p className="text-sm text-text-secondary">Loading options...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Contributor
              </label>
              <select
                className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
                value={values.contributor_id}
                onChange={(e) => updateField('contributor_id', e.target.value)}
              >
                <option value="">Select a contributor</option>
                {contributors.map((contributor) => (
                  <option key={contributor.id} value={contributor.id}>
                    {contributor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">
                Category
              </label>
              <select
                className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
                value={values.category_id}
                onChange={(e) => updateField('category_id', e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Thumbnail</h2>
          <p className="text-sm text-text-secondary">
            Upload the image used on public cards and previews.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Thumbnail image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-xl file:border-0 file:bg-bg-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-text-primary"
          />
        </div>

        {values.thumbnail_url ? (
          <div>
            <p className="mb-2 text-sm font-medium text-text-primary">Current thumbnail</p>
            <img
              src={values.thumbnail_url}
              alt={values.title || 'Resource thumbnail'}
              className="h-24 w-24 rounded-xl object-cover"
            />
          </div>
        ) : null}

        {thumbnailFile ? (
          <p className="text-sm text-text-secondary">Selected file: {thumbnailFile.name}</p>
        ) : null}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Access</h2>
          <p className="text-sm text-text-secondary">
            You can upload a file, use an external link, or both.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Resource file
          </label>
          <input
            type="file"
            onChange={(e) => setResourceFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-xl file:border-0 file:bg-bg-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-text-primary"
          />
          {resourceFile ? (
            <p className="mt-2 text-sm text-text-secondary">
              Selected file: {resourceFile.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            External URL
          </label>
          <input
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            value={values.external_url ?? ''}
            onChange={(e) => updateField('external_url', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Visibility</h2>
          <p className="text-sm text-text-secondary">
            Control how this resource appears in the platform.
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={values.is_featured}
              onChange={(e) => updateField('is_featured', e.target.checked)}
            />
            Featured
          </label>

          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={values.is_public}
              onChange={(e) => updateField('is_public', e.target.checked)}
            />
            Public
          </label>

          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={values.is_published}
              onChange={(e) => updateField('is_published', e.target.checked)}
            />
            Published
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}