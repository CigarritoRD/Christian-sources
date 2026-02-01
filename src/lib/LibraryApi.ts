import { supabase } from './supabaseClient'
import type { Resource } from '../types/resource'

export type LibraryKind = 'saved' | 'favorite'

export async function toggleLibrary(kind: LibraryKind, resourceId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('NOT_AUTH')

  const { data: existing, error: e1 } = await supabase
    .from('user_library')
    .select('id')
    .eq('user_id', user.id)
    .eq('resource_id', resourceId)
    .eq('kind', kind)
    .maybeSingle()

  if (e1) throw e1

  if (existing?.id) {
    const { error } = await supabase.from('user_library').delete().eq('id', existing.id)
    if (error) throw error
    return { active: false }
  } else {
    const { error } = await supabase.from('user_library').insert({ user_id: user.id, resource_id: resourceId, kind })
    if (error) throw error
    return { active: true }
  }
}

export async function getLibrary(kind: LibraryKind, page: number, pageSize: number) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('NOT_AUTH')

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('user_library')
    .select(`
      id, created_at,
      resource:resources (
        id,title,slug,description,thumbnail_url,type,is_verified,ministry,topic,
        rating_avg,rating_count,views_count,duration_seconds,pages,file_size_mb
      )
    `, { count: 'exact' })
    .eq('user_id', user.id)
    .eq('kind', kind)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  const items = (data ?? [])
    .map((row: any) => row.resource)
    .filter(Boolean) as Resource[]

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return { items, total, totalPages }
}

export async function getLibraryFlags(resourceId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { saved: false, favorite: false }

  const { data, error } = await supabase
    .from('user_library')
    .select('kind')
    .eq('user_id', user.id)
    .eq('resource_id', resourceId)

  if (error) throw error
  const kinds = new Set((data ?? []).map((x: any) => x.kind))
  return { saved: kinds.has('saved'), favorite: kinds.has('favorite') }
}
