import { useMemo, useState } from 'react'
import type { AdminContributorInput } from '@/lib/api/contributors'

type ContributorFormProps = {
  initialValues?: Partial<AdminContributorInput>
  onSubmit: (
    values: AdminContributorInput,
    avatarFile: File | null,
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

export default function ContributorForm({
  initialValues,
  onSubmit,
  submitLabel = 'Save contributor',
}: ContributorFormProps) {
  const defaults = useMemo(
    () => ({
      name: initialValues?.name ?? '',
      slug: initialValues?.slug ?? '',
      short_bio: initialValues?.short_bio ?? '',
      full_bio: initialValues?.full_bio ?? '',
      specialty: initialValues?.specialty ?? '',
      avatar_url: initialValues?.avatar_url ?? '',
      website_url: initialValues?.website_url ?? '',
      instagram_url: initialValues?.instagram_url ?? '',
      facebook_url: initialValues?.facebook_url ?? '',
      linkedin_url: initialValues?.linkedin_url ?? '',
      youtube_url: initialValues?.youtube_url ?? '',
      is_featured: initialValues?.is_featured ?? false,
      is_active: initialValues?.is_active ?? true,
    }),
    [initialValues],
  )

  const [values, setValues] = useState(defaults)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
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

      await onSubmit(
        {
          ...values,
          name: values.name.trim(),
          slug: values.slug.trim(),
          short_bio: values.short_bio?.trim() || null,
          full_bio: values.full_bio?.trim() || null,
          specialty: values.specialty?.trim() || null,
          avatar_url: values.avatar_url?.trim() || null,
          website_url: values.website_url?.trim() || null,
          instagram_url: values.instagram_url?.trim() || null,
          facebook_url: values.facebook_url?.trim() || null,
          linkedin_url: values.linkedin_url?.trim() || null,
          youtube_url: values.youtube_url?.trim() || null,
        },
        avatarFile,
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.',
      )
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
          <h2 className="text-base font-semibold text-text-primary">
            Basic information
          </h2>
          <p className="text-sm text-text-secondary">
            Main public details for this contributor profile.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Name
            </label>
            <input
              className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
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
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Slug
            </label>
            <input
              className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
              value={values.slug}
              onChange={(e) => updateField('slug', slugify(e.target.value))}
              placeholder="jane-doe"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Specialty
          </label>
          <input
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            value={values.specialty}
            onChange={(e) => updateField('specialty', e.target.value)}
            placeholder="Education, family support, mentoring..."
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Bio</h2>
          <p className="text-sm text-text-secondary">
            Short and detailed public descriptions.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Short bio
          </label>
          <textarea
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            rows={3}
            value={values.short_bio}
            onChange={(e) => updateField('short_bio', e.target.value)}
            placeholder="A short summary for cards and previews."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Full bio
          </label>
          <textarea
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            rows={6}
            value={values.full_bio}
            onChange={(e) => updateField('full_bio', e.target.value)}
            placeholder="Longer description for the public contributor page."
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Avatar</h2>
          <p className="text-sm text-text-secondary">
            Upload the public profile image for this contributor.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Avatar image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-xl file:border-0 file:bg-bg-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-text-primary"
          />
        </div>

        {values.avatar_url ? (
          <div>
            <p className="mb-2 text-sm font-medium text-text-primary">
              Current avatar
            </p>
            <img
              src={values.avatar_url}
              alt={values.name || 'Contributor'}
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>
        ) : null}

        {avatarFile ? (
          <p className="text-sm text-text-secondary">
            Selected file: {avatarFile.name}
          </p>
        ) : null}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Links</h2>
          <p className="text-sm text-text-secondary">
            Public website and social media links.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            placeholder="Website URL"
            value={values.website_url}
            onChange={(e) => updateField('website_url', e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            placeholder="Instagram URL"
            value={values.instagram_url}
            onChange={(e) => updateField('instagram_url', e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            placeholder="Facebook URL"
            value={values.facebook_url}
            onChange={(e) => updateField('facebook_url', e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary"
            placeholder="LinkedIn URL"
            value={values.linkedin_url}
            onChange={(e) => updateField('linkedin_url', e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 outline-none transition focus:border-brand-primary md:col-span-2"
            placeholder="YouTube URL"
            value={values.youtube_url}
            onChange={(e) => updateField('youtube_url', e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Visibility
          </h2>
          <p className="text-sm text-text-secondary">
            Control how this contributor appears in the platform.
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
              checked={values.is_active}
              onChange={(e) => updateField('is_active', e.target.checked)}
            />
            Active
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