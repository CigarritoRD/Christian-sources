import { useNavigate } from 'react-router-dom'
import ResourceForm from '@/components/admin/ResourceForm'
import {
  createResource,
  uploadResourceFile,
  uploadResourceThumbnail,
  type AdminResourceInput,
} from '@/lib/api/resources'
import PageHeader from '@/components/ui/PageHeader'

type ResourceFormValues = AdminResourceInput & {
  file_url?: string | null
  external_url?: string | null
}

export default function AdminResourceCreatePage() {
  const navigate = useNavigate()

  async function handleSubmit(
    values: ResourceFormValues,
    files: {
      thumbnailFile: File | null
      resourceFile: File | null
    },
  ) {
    let thumbnailUrl = values.thumbnail_url ?? null
    let fileUrl = values.file_url ?? null

    if (files.thumbnailFile) {
      thumbnailUrl = await uploadResourceThumbnail(files.thumbnailFile, values.slug)
    }

    if (files.resourceFile) {
      fileUrl = await uploadResourceFile(files.resourceFile, values.slug)
    }

    await createResource({
      ...values,
      thumbnail_url: thumbnailUrl,
      file_url: fileUrl,
    })

    navigate('/admin/resources')
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Create resource"
        description="Add a new resource and connect it to a contributor and category."
      />

      <ResourceForm
        onSubmit={handleSubmit}
        submitLabel="Create resource"
      />
    </div>
  )
}