import { useEffect, useMemo, useState } from 'react'
import type { AdminResourceInput } from '@/lib/api/resources'
import { getActiveContributors } from '@/lib/api/contributors'
import { getActiveCategories } from '@/lib/api/categories'
import {
  getActiveTags,
  getResourceTagIds,
  type TagRecord,
} from '@/lib/api/tags'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import AppSelect from '@/components/ui/AppSelect'
import AppTextarea from '@/components/ui/AppTextarea'
import FileInput from '@/components/ui/FileInput'
import SectionCard from '@/components/ui/SectionCard'

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
  id?: string
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
    selectedTagIds: string[],
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
      id: initialValues?.id,
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
  const [tags, setTags] = useState<TagRecord[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValues(defaults)
  }, [defaults])

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true)
        setError(null)

        const [contributorsData, categoriesData, tagsData] = await Promise.all([
          getActiveContributors(),
          getActiveCategories(),
          getActiveTags(),
        ])

        setContributors((contributorsData ?? []) as ContributorOption[])
        setCategories((categoriesData ?? []) as CategoryOption[])
        setTags((tagsData ?? []) as TagRecord[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form options.')
      } finally {
        setLoadingOptions(false)
      }
    }

    void loadOptions()
  }, [])

  useEffect(() => {
    async function loadExistingTags() {
      if (!initialValues?.id) {
        setSelectedTagIds([])
        return
      }

      try {
        const ids = await getResourceTagIds(initialValues.id)
        setSelectedTagIds(ids)
      } catch (err) {
        console.error(err)
      }
    }

    void loadExistingTags()
  }, [initialValues?.id])

  function updateField<K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    )
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
        selectedTagIds,
      )
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
              Main public information for this resource.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AppInput
              label="Title"
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

            <AppInput
              label="Slug"
              value={values.slug}
              onChange={(e) => updateField('slug', slugify(e.target.value))}
              placeholder="toolkit-for-family-mentoring"
            />
          </div>

          <AppInput
            label="Resource type"
            value={values.resource_type}
            onChange={(e) => updateField('resource_type', e.target.value)}
            placeholder="PDF, Guide, Video, Worksheet..."
          />
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">
              Descriptions
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Short preview text and full description.
            </p>
          </div>

          <AppTextarea
            label="Short description"
            rows={3}
            value={values.short_description}
            onChange={(e) => updateField('short_description', e.target.value)}
            placeholder="Brief summary shown in cards and previews."
          />

          <AppTextarea
            label="Description"
            rows={6}
            value={values.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Detailed public description."
          />
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">
              Relationships
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Connect this resource to a contributor and a category.
            </p>
          </div>

          {loadingOptions ? (
            <p className="text-sm text-text-secondary">Loading options...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <AppSelect
                label="Contributor"
                value={values.contributor_id}
                onChange={(e) => updateField('contributor_id', e.target.value)}
              >
                <option value="">Select a contributor</option>
                {contributors.map((contributor) => (
                  <option key={contributor.id} value={contributor.id}>
                    {contributor.name}
                  </option>
                ))}
              </AppSelect>

              <AppSelect
                label="Category"
                value={values.category_id}
                onChange={(e) => updateField('category_id', e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </AppSelect>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">Tags</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Assign tags to improve search and discovery.
            </p>
          </div>

          {loadingOptions ? (
            <p className="text-sm text-text-secondary">Loading tags...</p>
          ) : tags.length === 0 ? (
            <p className="text-sm text-text-secondary">No active tags available.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id)

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={[
                      'rounded-full border px-4 py-2 text-sm font-medium transition',
                      selected
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-surface-border bg-bg-soft text-text-primary hover:bg-surface-hover',
                    ].join(' ')}
                  >
                    {tag.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">
              Thumbnail
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Upload the image used on public cards and previews.
            </p>
          </div>

          <FileInput
            label="Thumbnail image"
            accept="image/*"
            fileName={thumbnailFile?.name ?? null}
            hint="PNG, JPG or WEBP"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
            onClear={() => setThumbnailFile(null)}
          />

          {values.thumbnail_url ? (
            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">
                Current thumbnail
              </p>
              <img
                src={values.thumbnail_url}
                alt={values.title || 'Resource thumbnail'}
                className="h-24 w-24 rounded-xl object-cover"
              />
            </div>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">Access</h2>
            <p className="mt-1 text-sm text-text-secondary">
              You can upload a file, use an external link, or both.
            </p>
          </div>

          <FileInput
            label="Resource file"
            fileName={resourceFile?.name ?? null}
            hint="PDF, DOC, ZIP, etc."
            onChange={(e) => setResourceFile(e.target.files?.[0] ?? null)}
            onClear={() => setResourceFile(null)}
          />

          <AppInput
            label="External URL"
            value={values.external_url ?? ''}
            onChange={(e) => updateField('external_url', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">
              Visibility
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
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