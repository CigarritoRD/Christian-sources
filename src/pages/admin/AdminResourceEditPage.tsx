import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ResourceForm from '@/components/admin/ResourceForm'
import {
  getResourceById,
  updateResource,
  uploadResourceFile,
  uploadResourceThumbnail,
  type AdminResourceInput,
} from '@/lib/api/resources'

type ResourceRecord = AdminResourceInput & {
  id: string
  file_url?: string | null
  external_url?: string | null
}

type ResourceFormValues = AdminResourceInput & {
  file_url?: string | null
  external_url?: string | null
}

export default function AdminResourceEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [resource, setResource] = useState<ResourceRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadResource() {
      if (!id) {
        setError('Resource id is missing.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getResourceById(id)
        setResource(data as ResourceRecord)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resource.')
      } finally {
        setLoading(false)
      }
    }

    void loadResource()
  }, [id])

  async function handleSubmit(
    values: ResourceFormValues,
    files: {
      thumbnailFile: File | null
      resourceFile: File | null
    },
  ) {
    if (!id) {
      throw new Error('Resource id is missing.')
    }

    let thumbnailUrl = values.thumbnail_url ?? resource?.thumbnail_url ?? null
    let fileUrl = values.file_url ?? resource?.file_url ?? null

    if (files.thumbnailFile) {
      thumbnailUrl = await uploadResourceThumbnail(files.thumbnailFile, values.slug)
    }

    if (files.resourceFile) {
      fileUrl = await uploadResourceFile(files.resourceFile, values.slug)
    }

    await updateResource(id, {
      ...values,
      thumbnail_url: thumbnailUrl,
      file_url: fileUrl,
    })

    navigate('/admin/resources')
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <p className="text-sm text-text-secondary">Loading resource...</p>
        </div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-700">
            Could not load resource
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {error ?? 'Resource not found.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Edit resource
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Update this resource and its publication settings.
        </p>
      </div>

      
        <ResourceForm
          initialValues={{
            title: resource.title,
            slug: resource.slug,
            description: resource.description ?? '',
            short_description: resource.short_description ?? '',
            thumbnail_url: resource.thumbnail_url ?? '',
            resource_type: resource.resource_type ?? '',
            contributor_id: resource.contributor_id,
            category_id: resource.category_id,
            file_url: resource.file_url ?? '',
            external_url: resource.external_url ?? '',
            is_featured: resource.is_featured,
            is_public: resource.is_public,
            is_published: resource.is_published,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      
    </div>
  )
}