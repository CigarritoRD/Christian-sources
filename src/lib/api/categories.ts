import { supabase } from '@/lib/supabaseClient'

export type Category = {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

export async function getActiveCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getCategoryById(id: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createCategory(input: {
  name: string
  slug: string
  is_active?: boolean
}) {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: input.name,
      slug: input.slug,
      is_active: input.is_active ?? true,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateCategory(
  id: string,
  input: {
    name: string
    slug: string
    is_active?: boolean
  },
) {
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: input.name,
      slug: input.slug,
      is_active: input.is_active ?? true,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deactivateCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function activateCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .update({ is_active: true })
    .eq('id', id)

  if (error) throw new Error(error.message)
}