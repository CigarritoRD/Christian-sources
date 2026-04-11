import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import type { AdminContributorInput } from '@/lib/api/contributors'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import AppTextarea from '@/components/ui/AppTextarea'
import SectionCard from '@/components/ui/SectionCard'

const contributorSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  slug: z.string().trim().min(1, 'Slug is required.'),
  short_bio: z.string().optional().nullable(),
  full_bio: z.string().optional().nullable(),
  specialty: z.string().optional().nullable(),
  avatar_url: z.string().optional().nullable(),
  website_url: z.string().optional().nullable(),
  instagram_url: z.string().optional().nullable(),
  facebook_url: z.string().optional().nullable(),
  linkedin_url: z.string().optional().nullable(),
  youtube_url: z.string().optional().nullable(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
})

type ContributorFormValues = z.infer<typeof contributorSchema>

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContributorFormValues>({
    resolver: zodResolver(contributorSchema),
    defaultValues: {
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
    },
  })

  useEffect(() => {
    reset({
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
    })
  }, [initialValues, reset])

  const nameValue = useWatch({
    control,
    name: 'name',
    defaultValue: initialValues?.name ?? '',
  })

  const slugValue = useWatch({
    control,
    name: 'slug',
    defaultValue: initialValues?.slug ?? '',
  })

  const shortBioValue = useWatch({
    control,
    name: 'short_bio',
    defaultValue: initialValues?.short_bio ?? '',
  })

  const fullBioValue = useWatch({
    control,
    name: 'full_bio',
    defaultValue: initialValues?.full_bio ?? '',
  })

  const specialtyValue = useWatch({
    control,
    name: 'specialty',
    defaultValue: initialValues?.specialty ?? '',
  })

  const avatarUrlValue = useWatch({
    control,
    name: 'avatar_url',
    defaultValue: initialValues?.avatar_url ?? '',
  })

  const websiteUrlValue = useWatch({
    control,
    name: 'website_url',
    defaultValue: initialValues?.website_url ?? '',
  })

  const instagramUrlValue = useWatch({
    control,
    name: 'instagram_url',
    defaultValue: initialValues?.instagram_url ?? '',
  })

  const facebookUrlValue = useWatch({
    control,
    name: 'facebook_url',
    defaultValue: initialValues?.facebook_url ?? '',
  })

  const linkedinUrlValue = useWatch({
    control,
    name: 'linkedin_url',
    defaultValue: initialValues?.linkedin_url ?? '',
  })

  const youtubeUrlValue = useWatch({
    control,
    name: 'youtube_url',
    defaultValue: initialValues?.youtube_url ?? '',
  })

  const isFeaturedValue = useWatch({
    control,
    name: 'is_featured',
    defaultValue: initialValues?.is_featured ?? false,
  })

  const isActiveValue = useWatch({
    control,
    name: 'is_active',
    defaultValue: initialValues?.is_active ?? true,
  })

  async function submit(values: ContributorFormValues) {
    setSubmitError(null)

    try {
      await onSubmit(
        {
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
          is_featured: values.is_featured,
          is_active: values.is_active,
        },
        avatarFile,
      )
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5 font-heading">
      {submitError ? (
        <SectionCard className="border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{submitError}</p>
        </SectionCard>
      ) : null}

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">
              Basic information
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Main public details for this contributor profile.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AppInput
              label="Name"
              value={nameValue ?? ''}
              error={errors.name?.message}
              placeholder="Jane Doe"
              {...register('name')}
              onChange={(e) => {
                const nextName = e.target.value
                const currentSlugMatchesName =
                  !slugValue || slugValue === slugify(nameValue || '')

                setValue('name', nextName, { shouldValidate: true })

                if (currentSlugMatchesName) {
                  setValue('slug', slugify(nextName), { shouldValidate: true })
                }
              }}
            />

            <AppInput
              label="Slug"
              value={slugValue ?? ''}
              error={errors.slug?.message}
              placeholder="jane-doe"
              {...register('slug')}
              onChange={(e) => {
                setValue('slug', slugify(e.target.value), { shouldValidate: true })
              }}
            />
          </div>

          <AppInput
            label="Specialty"
            value={specialtyValue ?? ''}
            placeholder="Education, mentoring, family support..."
            {...register('specialty')}
            onChange={(e) => {
              setValue('specialty', e.target.value, { shouldValidate: true })
            }}
          />
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">Bio</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Short and detailed public descriptions.
            </p>
          </div>

          <AppTextarea
            label="Short bio"
            rows={3}
            value={shortBioValue ?? ''}
            {...register('short_bio')}
            onChange={(e) => {
              setValue('short_bio', e.target.value, { shouldValidate: true })
            }}
            placeholder="A short summary for cards and previews."
          />

          <AppTextarea
            label="Full bio"
            rows={6}
            value={fullBioValue ?? ''}
            {...register('full_bio')}
            onChange={(e) => {
              setValue('full_bio', e.target.value, { shouldValidate: true })
            }}
            placeholder="Longer description for the public contributor page."
          />
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">Avatar</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Upload the public profile image for this contributor.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Avatar image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-xl file:border-0 file:bg-bg-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-text-primary"
            />
          </div>

          {avatarUrlValue ? (
            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">
                Current avatar
              </p>
              <img
                src={avatarUrlValue}
                alt={nameValue || 'Contributor'}
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          ) : null}

          {avatarFile ? (
            <p className="text-sm text-text-secondary">
              Selected file: {avatarFile.name}
            </p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">Links</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Public website and social media links.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AppInput
              label="Website URL"
              value={websiteUrlValue ?? ''}
              {...register('website_url')}
              onChange={(e) => {
                setValue('website_url', e.target.value, { shouldValidate: true })
              }}
              placeholder="https://..."
            />

            <AppInput
              label="Instagram URL"
              value={instagramUrlValue ?? ''}
              {...register('instagram_url')}
              onChange={(e) => {
                setValue('instagram_url', e.target.value, { shouldValidate: true })
              }}
              placeholder="https://instagram.com/..."
            />

            <AppInput
              label="Facebook URL"
              value={facebookUrlValue ?? ''}
              {...register('facebook_url')}
              onChange={(e) => {
                setValue('facebook_url', e.target.value, { shouldValidate: true })
              }}
              placeholder="https://facebook.com/..."
            />

            <AppInput
              label="LinkedIn URL"
              value={linkedinUrlValue ?? ''}
              {...register('linkedin_url')}
              onChange={(e) => {
                setValue('linkedin_url', e.target.value, { shouldValidate: true })
              }}
              placeholder="https://linkedin.com/in/..."
            />

            <div className="md:col-span-2">
              <AppInput
                label="YouTube URL"
                value={youtubeUrlValue ?? ''}
                {...register('youtube_url')}
                onChange={(e) => {
                  setValue('youtube_url', e.target.value, { shouldValidate: true })
                }}
                placeholder="https://youtube.com/..."
              />
            </div>
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
              Control how this contributor appears in the platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={!!isFeaturedValue}
                {...register('is_featured')}
                onChange={(e) => {
                  setValue('is_featured', e.target.checked, { shouldValidate: true })
                }}
              />
              Featured
            </label>

            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={!!isActiveValue}
                {...register('is_active')}
                onChange={(e) => {
                  setValue('is_active', e.target.checked, { shouldValidate: true })
                }}
              />
              Active
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