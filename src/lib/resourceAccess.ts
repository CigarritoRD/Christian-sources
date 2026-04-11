import { trackResourceDownload } from '@/lib/api/downloads'

type ResourceAccessInput = {
  id: string
  file_url?: string | null
  external_url?: string | null
}

export async function openTrackedResource(resource: ResourceAccessInput) {
  const targetUrl = resource.file_url || resource.external_url

  if (!targetUrl) {
    throw new Error('This resource has no file or external link.')
  }

  await trackResourceDownload({
    resource_id: resource.id,
    action_type: resource.file_url ? 'download' : 'open_external',
  })

  window.open(targetUrl, '_blank', 'noopener,noreferrer')
}