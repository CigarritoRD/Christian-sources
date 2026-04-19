import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import AppTextarea from '@/components/ui/AppTextarea'

export type ContributorFormValues = {
  name: string
  slug: string
  short_bio?: string
  full_bio?: string
  website_url?: string
  instagram_url?: string
  facebook_url?: string
  linkedin_url?: string
  youtube_url?: string
  is_active: boolean
  is_featured: boolean
}

type ContributorFormProps = {
  initialValues?: Partial<ContributorFormValues>
  onSubmit: (values: ContributorFormValues) => Promise<void>
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

export default function ContributorForm({
  initialValues,
  onSubmit,
  submitLabel,
}: ContributorFormProps) {
  const { t } = useTranslation()

  const defaults = useMemo<ContributorFormValues>(
    () => ({
      name: initialValues?.name ?? '',
      slug: initialValues?.slug ?? '',
      short_bio: initialValues?.short_bio ?? '',
      full_bio: initialValues?.full_bio ?? '',
      website_url: initialValues?.website_url ?? '',
      instagram_url: initialValues?.instagram_url ?? '',
      facebook_url: initialValues?.facebook_url ?? '',
      linkedin_url: initialValues?.linkedin_url ?? '',
      youtube_url: initialValues?.youtube_url ?? '',
      is_active: initialValues?.is_active ?? true,
      is_featured: initialValues?.is_featured ?? false,
    }),
    [initialValues],
  )

  const [values, setValues] = useState<ContributorFormValues>(defaults)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField<K extends keyof ContributorFormValues>(
    key: K,
    value: ContributorFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!values.name.trim()) {
      setError(t('admin.contributorForm.validation.name'))
      return
    }

    if (!values.slug.trim()) {
      setError(t('admin.contributorForm.validation.slug'))
      return
    }

    try {
      setIsSubmitting(true)

      await onSubmit({
        ...values,
        name: values.name.trim(),
        slug: values.slug.trim(),
        short_bio: values.short_bio?.trim() || '',
        full_bio: values.full_bio?.trim() || '',
        website_url: values.website_url?.trim() || '',
        instagram_url: values.instagram_url?.trim() || '',
        facebook_url: values.facebook_url?.trim() || '',
        linkedin_url: values.linkedin_url?.trim() || '',
        youtube_url: values.youtube_url?.trim() || '',
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('admin.contributorForm.submitError'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-lg text-text-primary">
            {t('admin.contributorForm.basicInfoTitle')}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {t('admin.contributorForm.basicInfoBody')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AppInput
            label={t('admin.contributorForm.name')}
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
            placeholder={t('admin.contributorForm.namePlaceholder')}
          />

          <AppInput
            label={t('admin.contributorForm.slug')}
            value={values.slug}
            onChange={(e) => updateField('slug', slugify(e.target.value))}
            placeholder={t('admin.contributorForm.slugPlaceholder')}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-lg text-text-primary">
            {t('admin.contributorForm.contentTitle')}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {t('admin.contributorForm.contentBody')}
          </p>
        </div>

        <AppTextarea
          label={t('admin.contributorForm.shortBio')}
          value={values.short_bio || ''}
          onChange={(e) => updateField('short_bio', e.target.value)}
          placeholder={t('admin.contributorForm.shortBioPlaceholder')}
          rows={3}
        />

        <AppTextarea
          label={t('admin.contributorForm.fullBio')}
          value={values.full_bio || ''}
          onChange={(e) => updateField('full_bio', e.target.value)}
          placeholder={t('admin.contributorForm.fullBioPlaceholder')}
          rows={6}
        />
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-lg text-text-primary">
            {t('admin.contributorForm.linksTitle')}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {t('admin.contributorForm.linksBody')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AppInput
            label={t('admin.contributorForm.website')}
            value={values.website_url || ''}
            onChange={(e) => updateField('website_url', e.target.value)}
            placeholder="https://..."
          />

          <AppInput
            label={t('admin.contributorForm.instagram')}
            value={values.instagram_url || ''}
            onChange={(e) => updateField('instagram_url', e.target.value)}
            placeholder="https://instagram.com/..."
          />

          <AppInput
            label={t('admin.contributorForm.facebook')}
            value={values.facebook_url || ''}
            onChange={(e) => updateField('facebook_url', e.target.value)}
            placeholder="https://facebook.com/..."
          />

          <AppInput
            label={t('admin.contributorForm.linkedin')}
            value={values.linkedin_url || ''}
            onChange={(e) => updateField('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />

          <AppInput
            label={t('admin.contributorForm.youtube')}
            value={values.youtube_url || ''}
            onChange={(e) => updateField('youtube_url', e.target.value)}
            placeholder="https://youtube.com/..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-lg text-text-primary">
            {t('admin.contributorForm.visibilityTitle')}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {t('admin.contributorForm.visibilityBody')}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-surface-border bg-bg-soft px-4 py-3 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={values.is_active}
              onChange={(e) => updateField('is_active', e.target.checked)}
            />
            {t('admin.contributorForm.active')}
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-surface-border bg-bg-soft px-4 py-3 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={values.is_featured}
              onChange={(e) => updateField('is_featured', e.target.checked)}
            />
            {t('admin.contributorForm.featured')}
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <AppButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : submitLabel || t('common.save')}
        </AppButton>
      </div>
    </form>
  )
}