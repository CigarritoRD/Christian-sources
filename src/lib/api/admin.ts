import { supabase } from '@/lib/supabaseClient'

export type AdminDashboardStats = {
  totalContributors: number
  activeContributors: number
  totalResources: number
  publishedResources: number
  totalDownloads: number
}

export type AdminRecentContributor = {
  id: string
  name: string
  slug: string
  avatar_url?: string | null
  specialty?: string | null
  is_active: boolean
  created_at: string
}

export type AdminRecentResource = {
  id: string
  title: string
  slug: string
  thumbnail_url?: string | null
  resource_type?: string | null
  is_published: boolean
  is_featured: boolean
  created_at: string
  contributor?: {
    id: string
    name: string
    slug: string
  } | null
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [
    contributorsRes,
    activeContributorsRes,
    resourcesRes,
    publishedResourcesRes,
    downloadsRes,
  ] = await Promise.all([
    supabase
      .from('contributors')
      .select('*', { count: 'exact', head: true }),

    supabase
      .from('contributors')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),

    supabase
      .from('resources')
      .select('*', { count: 'exact', head: true }),

    supabase
      .from('resources')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),

    supabase
      .from('resource_downloads')
      .select('*', { count: 'exact', head: true }),
  ])

  const errors = [
    contributorsRes.error,
    activeContributorsRes.error,
    resourcesRes.error,
    publishedResourcesRes.error,
    downloadsRes.error,
  ].filter(Boolean)

  if (errors.length > 0) {
    throw new Error(errors[0]?.message ?? 'Failed to load dashboard stats.')
  }

  return {
    totalContributors: contributorsRes.count ?? 0,
    activeContributors: activeContributorsRes.count ?? 0,
    totalResources: resourcesRes.count ?? 0,
    publishedResources: publishedResourcesRes.count ?? 0,
    totalDownloads: downloadsRes.count ?? 0,
  }
}

export async function getRecentContributors(limit = 5) {
  const { data, error } = await supabase
    .from('contributors')
    .select(`
      id,
      name,
      slug,
      avatar_url,
      specialty,
      is_active,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as AdminRecentContributor[]
}

export async function getRecentResources(limit = 5) {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      id,
      title,
      slug,
      thumbnail_url,
      resource_type,
      is_published,
      is_featured,
      created_at,
      contributor:contributors (
        id,
        name,
        slug
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as AdminRecentResource[]
}