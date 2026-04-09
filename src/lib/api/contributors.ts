import { supabase } from '@/lib/supabaseClient'
import type { ContributorListItem } from '@/types/contributors'
import type { ResourceListItem } from '@/types/resources'

export async function getActiveContributors(): Promise<ContributorListItem[]> {
  const { data, error } = await supabase
    .from('contributors')
    .select(`
      id,
      name,
      slug,
      short_bio,
      specialty,
      avatar_url,
      website_url,
      is_featured,
      is_active,
      created_at
    `)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ContributorListItem[]
}
export type ContributorDetail = {
  id: string
  name: string
  slug: string
  short_bio: string | null
  full_bio: string | null
  specialty: string | null
  avatar_url: string | null
  website_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  linkedin_url: string | null
  youtube_url: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export async function getContributorBySlug(
  slug: string,
): Promise<ContributorDetail | null> {
  const { data, error } = await supabase
    .from('contributors')
    .select(`
      id,
      name,
      slug,
      short_bio,
      full_bio,
      specialty,
      avatar_url,
      website_url,
      instagram_url,
      facebook_url,
      linkedin_url,
      youtube_url,
      is_featured,
      is_active,
      created_at
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data as ContributorDetail
}

export async function getContributorResources(
  contributorId: string,
): Promise<ResourceListItem[]> {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      id,
      title,
      slug,
      description,
      short_description,
      thumbnail_url,
      resource_type,
      contributor_id,
      category_id,
      is_featured,
      is_public,
      is_published,
      created_at,
      contributor:contributors (
        id,
        name,
        slug
      ),
      category:categories (
        id,
        name,
        slug
      )
    `)
    .eq('contributor_id', contributorId)
    .eq('is_public', true)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ResourceListItem[]
}

export async function getFeaturedContributors(): Promise<ContributorListItem[]> {
  const { data, error } = await supabase
    .from('contributors')
    .select(`
      id,
      name,
      slug,
      short_bio,
      specialty,
      avatar_url,
      website_url,
      is_featured,
      is_active,
      created_at
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('name', { ascending: true })
    .limit(3)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ContributorListItem[]
}