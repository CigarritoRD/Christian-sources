import { supabase } from '@/lib/supabaseClient'

export type TagRecord = {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at?: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, slug, is_active, created_at')
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as TagRecord[]
}

export async function getActiveTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, slug, is_active, created_at')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as TagRecord[]
}

export async function createTag(name: string) {
  const normalizedName = name.trim()
  const slug = slugify(normalizedName)

  const { data, error } = await supabase
    .from('tags')
    .insert({
      name: normalizedName,
      slug,
      is_active: true,
    })
    .select('id, name, slug, is_active, created_at')
    .single()

  if (error) throw error
  return data as TagRecord
}

export async function updateTag(
  id: string,
  values: Partial<Pick<TagRecord, 'name' | 'slug' | 'is_active'>>,
) {
  const payload = {
    ...values,
    ...(values.name ? { slug: slugify(values.name) } : {}),
  }

  const { data, error } = await supabase
    .from('tags')
    .update(payload)
    .eq('id', id)
    .select('id, name, slug, is_active, created_at')
    .single()

  if (error) throw error
  return data as TagRecord
}

export async function setResourceTags(resourceId: string, tagIds: string[]) {
  const { error: deleteError } = await supabase
    .from('resource_tags')
    .delete()
    .eq('resource_id', resourceId)

  if (deleteError) throw deleteError

  if (tagIds.length === 0) return

  const rows = tagIds.map((tagId) => ({
    resource_id: resourceId,
    tag_id: tagId,
  }))

  const { error: insertError } = await supabase
    .from('resource_tags')
    .insert(rows)

  if (insertError) throw insertError
}

export async function getResourceTagIds(resourceId: string) {
  const { data, error } = await supabase
    .from('resource_tags')
    .select('tag_id')
    .eq('resource_id', resourceId)

  if (error) throw error
  return (data ?? []).map((item) => item.tag_id as string)
}