import { supabase } from '@/lib/supabaseClient'
import type { ResourceListItem } from '@/types/resources'
import { normalizeResource } from '@/utils/resources'


export type ResourceDetail = {
  id: string
  title: string
  slug: string
  description: string | null
  short_description: string | null
  full_description: string | null
  thumbnail_url: string | null
  resource_type: string
  is_verified: boolean
  is_premium: boolean
  is_featured: boolean
  tags: string[] | null
  duration_seconds: number | null
  pages: number | null
  file_size_mb: number | null
  is_public: boolean
  is_published: boolean
  is_downloadable: boolean
  external_url: string | null
  file_url: string | null
  created_at: string
  contributor: {
    id: string
    name: string
    slug: string
    short_bio: string | null
    specialty: string | null
    avatar_url: string | null
    website_url: string | null
  } | null
  category: {
    id: string
    name: string
    slug: string
  } | null
}

export async function getPublishedResourceBySlug(
  slug: string,
): Promise<ResourceDetail | null> {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      id,
      title,
      slug,
      description,
      short_description,
      full_description,
      thumbnail_url,
      resource_type,
      is_verified,
      is_premium,
      is_featured,
      tags,
      duration_seconds,
      pages,
      file_size_mb,
      is_public,
      is_published,
      is_downloadable,
      external_url,
      file_url,
      created_at,
      contributor:contributors (
        id,
        name,
        slug,
        short_bio,
        specialty,
        avatar_url,
        website_url
      ),
      category:categories (
        id,
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('is_public', true)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data as ResourceDetail
}

export async function getRelatedResources(
  contributorId: string,
  currentResourceId: string,
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
    .eq('is_public', true)
    .eq('is_published', true)
    .eq('contributor_id', contributorId)
    .neq('id', currentResourceId)
    .limit(3)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ResourceListItem[]
}


export type ResourceCategory = {
  id: string
  name: string
  slug: string
}

export async function getPublishedResources(): Promise<ResourceListItem[]> {
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
    .eq('is_public', true)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ResourceListItem[]
}

export async function getActiveResourceCategories(): Promise<ResourceCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ResourceCategory[]
}

export async function getFeaturedResources(): Promise<ResourceListItem[]> {
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
    .eq('is_public', true)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((item) => normalizeResource(item as RawResourceListItem))
}