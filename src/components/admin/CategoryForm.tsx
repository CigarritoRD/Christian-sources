import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import SectionCard from '@/components/ui/SectionCard'

const categorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  slug: z.string().trim().min(1, 'Slug is required.'),
  is_active: z.boolean(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

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
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      slug: initialValues?.slug ?? '',
      is_active: initialValues?.is_active ?? true,
    },
  })

  useEffect(() => {
    reset({
      name: initialValues?.name ?? '',
      slug: initialValues?.slug ?? '',
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

  const isActiveValue = useWatch({
    control,
    name: 'is_active',
    defaultValue: initialValues?.is_active ?? true,
  })

  async function submit(values: CategoryFormValues) {
    await onSubmit({
      name: values.name.trim(),
      slug: values.slug.trim(),
      is_active: values.is_active,
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5 font-heading">
      <SectionCard className="p-5">
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg text-text-primary">
              Basic information
            </h2>
            <p className="mt-1 text-sm text-brand-primary">
              Define the public name and slug for this category.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AppInput
              label="Name"
              value={nameValue ?? ''}
              error={errors.name?.message}
              placeholder="Family support"
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
              placeholder="family-support"
              {...register('slug')}
              onChange={(e) => {
                setValue('slug', slugify(e.target.value), { shouldValidate: true })
              }}
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
            <p className="mt-1 text-sm text-brand-primary">
              Control whether this category is available for resources.
            </p>
          </div>

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
      </SectionCard>

      <div className="flex items-center gap-3">
        <AppButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </AppButton>
      </div>
    </form>
  )
}