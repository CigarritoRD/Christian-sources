import { useNavigate } from 'react-router-dom'
import ContributorForm from '@/components/admin/ContributorForm'
import {
  createContributor,
  uploadContributorAvatar,
  type AdminContributorInput,
} from '@/lib/api/contributors'

export default function AdminContributorCreatePage() {
  const navigate = useNavigate()

  async function handleSubmit(
    values: AdminContributorInput,
    avatarFile: File | null,
  ) {
    let avatarUrl = values.avatar_url ?? null

    if (avatarFile) {
      avatarUrl = await uploadContributorAvatar(avatarFile, values.slug)
    }

    await createContributor({
      ...values,
      avatar_url: avatarUrl,
    })

    navigate('/admin/contributors')
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Create contributor
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Add a new collaborator profile managed by Flourish.
        </p>
      </div>


      <ContributorForm
        onSubmit={handleSubmit}
        submitLabel="Create contributor"
      />

    </div>
  )
}