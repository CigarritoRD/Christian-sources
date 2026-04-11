import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ContributorForm from '@/components/admin/ContributorForm'
import {
  getContributorById,
  updateContributor,
  uploadContributorAvatar,
  type AdminContributorInput,
} from '@/lib/api/contributors'

type ContributorRecord = {
  id: string
  name: string
  slug: string
  short_bio?: string | null
  full_bio?: string | null
  specialty?: string | null
  avatar_url?: string | null
  website_url?: string | null
  instagram_url?: string | null
  facebook_url?: string | null
  linkedin_url?: string | null
  youtube_url?: string | null
  is_featured: boolean
  is_active: boolean
}

export default function AdminContributorEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [contributor, setContributor] = useState<ContributorRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadContributor() {
      if (!id) {
        setError('Contributor id is missing.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getContributorById(id)
        setContributor(data as ContributorRecord)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contributor.')
      } finally {
        setLoading(false)
      }
    }

    void loadContributor()
  }, [id])

  async function handleSubmit(
    values: AdminContributorInput,
    avatarFile: File | null,
  ) {
    if (!id) {
      throw new Error('Contributor id is missing.')
    }

    let avatarUrl = values.avatar_url ?? contributor?.avatar_url ?? null

    if (avatarFile) {
      avatarUrl = await uploadContributorAvatar(avatarFile, values.slug)
    }

    await updateContributor(id, {
      ...values,
      avatar_url: avatarUrl,
    })

    navigate('/admin/contributors')
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-surface-border bg-white p-6">
          <p className="text-sm text-text-secondary">Loading contributor...</p>
        </div>
      </div>
    )
  }

  if (error || !contributor) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-700">
            Could not load contributor
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {error ?? 'Contributor not found.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Edit contributor
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Update this collaborator profile managed by Flourish.
        </p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-white p-6">
        <ContributorForm
          initialValues={{
            name: contributor.name,
            slug: contributor.slug,
            short_bio: contributor.short_bio ?? '',
            full_bio: contributor.full_bio ?? '',
            specialty: contributor.specialty ?? '',
            avatar_url: contributor.avatar_url ?? '',
            website_url: contributor.website_url ?? '',
            instagram_url: contributor.instagram_url ?? '',
            facebook_url: contributor.facebook_url ?? '',
            linkedin_url: contributor.linkedin_url ?? '',
            youtube_url: contributor.youtube_url ?? '',
            is_featured: contributor.is_featured,
            is_active: contributor.is_active,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </div>
    </div>
  )
}