import { supabase } from './supabaseClient'
import type { Resource } from '../types/resource'
import type { ExploreFilters } from './query'

export async function fetchHomeRows() {
  const { data, error } = await supabase
    .from('resources')
    .select('id,title,slug,description,thumbnail_url,type,is_verified,ministry,topic,rating_avg,rating_count,views_count,duration_seconds,pages,file_size_mb,video_url,pdf_url,created_at')
    .order('created_at', { ascending: false })
    .limit(80)

  if (error) throw error
  return (data ?? []) as Resource[]
}

export async function fetchExplore(filters: ExploreFilters) {
  let q = supabase
    .from('resources')
    .select('id,title,slug,description,thumbnail_url,type,is_verified,ministry,topic,rating_avg,rating_count,views_count,duration_seconds,pages,file_size_mb,video_url,pdf_url,created_at', { count: 'exact' })

  if (filters.q?.trim()) {
    // simple search: title OR topic OR ministry
    const term = filters.q.trim()
    q = q.or(`title.ilike.%${term}%,topic.ilike.%${term}%,ministry.ilike.%${term}%`)
  }

  if (filters.types.length) q = q.in('type', filters.types as any)
  if (filters.verifiedOnly) q = q.eq('is_verified', true)
  if (filters.ministries.length) q = q.in('ministry', filters.ministries)
  if (filters.topics.length) q = q.in('topic', filters.topics)

  if (filters.sort === 'most_viewed') q = q.order('views_count', { ascending: false, nullsFirst: false })
  else q = q.order('created_at', { ascending: false })

  const from = (filters.page - 1) * filters.pageSize
  const to = from + filters.pageSize - 1

  const { data, error, count } = await q.range(from, to)
  if (error) throw error

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize))
  return { items: (data ?? []) as Resource[], total, totalPages }
}

export async function fetchResourceBySlug(slug: string) {
  const { data, error } = await supabase
    .from('resources')
    .select('id,title,slug,description,thumbnail_url,type,is_verified,ministry,topic,tags,rating_avg,rating_count,views_count,duration_seconds,pages,file_size_mb,video_url,pdf_url,created_at,updated_at')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data as Resource | null
}

export async function fetchSuggested(topic?: string | null, ministry?: string | null, excludeId?: string) {
  let q = supabase
    .from('resources')
    .select('id,title,slug,description,thumbnail_url,type,is_verified,ministry,topic,rating_avg,rating_count,views_count,duration_seconds,pages,file_size_mb')
    .limit(10)

  if (excludeId) q = q.neq('id', excludeId)
  if (topic) q = q.eq('topic', topic)
  else if (ministry) q = q.eq('ministry', ministry)

  const { data, error } = await q.order('views_count', { ascending: false })
  if (error) throw error
  return (data ?? []) as Resource[]
}
