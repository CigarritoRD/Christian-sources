import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import SectionCard from '@/components/ui/SectionCard'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import AppTextarea from '@/components/ui/AppTextarea'
import { createTag } from '@/lib/api/tags'


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

export default function AdminTagCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [groupKey, setGroupKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const generatedSlug = useMemo(() => slugify(name), [name])
  const finalSlug = slug.trim() || generatedSlug

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error(t('admin.tagForm.validation.name'))
      return
    }

    if (!finalSlug) {
      toast.error(t('admin.tagForm.validation.slug'))
      return
    }

    try {
      setIsSaving(true)

      await createTag({
        name: name.trim(),
        slug: finalSlug,
        description: description.trim() || null,
        group_key: groupKey.trim() || null,
      })

      toast.success(t('admin.tagForm.createSuccess'))
      navigate('/admin/tags')
    } catch (error) {
      console.error(error)
      toast.error(t('admin.tagForm.createError'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-brand-primary">
          {t('admin.tagForm.badge')}
        </p>
        <h1 className="mt-2 font-heading text-3xl md:text-4xl">
          {t('admin.tagForm.createTitle')}
        </h1>
        <p className="mt-3 text-sm text-text-secondary">
          {t('admin.tagForm.createSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <AppInput
              label={t('admin.tagForm.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('admin.tagForm.namePlaceholder')}
            />

            <AppInput
              label={t('admin.tagForm.slug')}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={generatedSlug || t('admin.tagForm.slugPlaceholder')}
            />

            <AppInput
              label={t('admin.tagForm.groupKey')}
              value={groupKey}
              onChange={(e) => setGroupKey(e.target.value)}
              placeholder={t('admin.tagForm.groupKeyPlaceholder')}
            />

            <div className="rounded-xl border border-surface-border bg-bg-soft px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-primary">
                {t('admin.tagForm.previewSlug')}
              </p>
              <p className="mt-2 text-sm text-text-primary">
                {finalSlug || '—'}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <AppTextarea
              label={t('admin.tagForm.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('admin.tagForm.descriptionPlaceholder')}
              rows={5}
            />
          </div>
        </SectionCard>

        <div className="flex flex-wrap gap-3">
          <AppButton type="submit" disabled={isSaving}>
            {isSaving ? t('common.saving') : t('common.save')}
          </AppButton>

          <AppButton
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/tags')}
          >
            {t('common.cancel')}
          </AppButton>
        </div>
      </form>
    </div>
  )
}