import { supabase } from '@/lib/supabaseClient'

export type LibraryKind =
  | 'saved'
  | 'favorite'
  | 'assigned'
  | 'unlocked'
  | 'downloaded'

export type UserLibraryRow = {
  id: string
  user_id: string
  resource_id: string
  kind: LibraryKind
  created_at: string
}

export async function hasLibraryEntry(
  userId: string | null | undefined,
  resourceId: string | null | undefined,
  kind: LibraryKind,
) {
  if (!userId || !resourceId) {
    return false
  }

  const { data, error } = await supabase
    .from('user_library')
    .select('id')
    .eq('user_id', userId)
    .eq('resource_id', resourceId)
    .eq('kind', kind)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return Boolean(data)
}

export async function addLibraryEntry(
  userId: string | null | undefined,
  resourceId: string | null | undefined,
  kind: LibraryKind,
) {
  if (!userId) {
    throw new Error('No se encontró el usuario.')
  }

  if (!resourceId) {
    throw new Error('No se encontró el recurso.')
  }

  const { error } = await supabase.from('user_library').insert({
    user_id: userId,
    resource_id: resourceId,
    kind,
  })

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function removeLibraryEntry(
  userId: string | null | undefined,
  resourceId: string | null | undefined,
  kind: LibraryKind,
) {
  if (!userId || !resourceId) {
    return false
  }

  const { error } = await supabase
    .from('user_library')
    .delete()
    .eq('user_id', userId)
    .eq('resource_id', resourceId)
    .eq('kind', kind)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function toggleLibraryEntry(
  userId: string | null | undefined,
  resourceId: string | null | undefined,
  kind: Extract<LibraryKind, 'saved' | 'favorite'>,
) {
  if (!userId) {
    throw new Error('No se encontró el usuario.')
  }

  if (!resourceId) {
    throw new Error('No se encontró el recurso.')
  }

  const exists = await hasLibraryEntry(userId, resourceId, kind)

  if (exists) {
    await removeLibraryEntry(userId, resourceId, kind)
    return false
  }

  await addLibraryEntry(userId, resourceId, kind)
  return true
}

export async function recordDownload(
  userId: string | null | undefined,
  resourceId: string | null | undefined,
) {
  if (!userId) {
    throw new Error('No se encontró el usuario.')
  }

  if (!resourceId) {
    throw new Error('No se encontró el recurso.')
  }

  const { error } = await supabase.from('resource_downloads').insert({
    user_id: userId,
    resource_id: resourceId,
  })

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function getLibraryEntriesByKind(
  userId: string | null | undefined,
  kind: LibraryKind,
) {
  if (!userId) {
    return []
  }

  const { data, error } = await supabase
    .from('user_library')
    .select('*')
    .eq('user_id', userId)
    .eq('kind', kind)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as UserLibraryRow[]
}

export async function getAllLibraryEntries(
  userId: string | null | undefined,
) {
  if (!userId) {
    return []
  }

  const { data, error } = await supabase
    .from('user_library')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as UserLibraryRow[]
}