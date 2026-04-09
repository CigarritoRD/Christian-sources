import { supabase } from '@/lib/supabaseClient'

export type ProfileUpdateInput = {
  full_name: string
}

export async function updateMyProfile(
  userId: string,
  input: ProfileUpdateInput,
) {
  const normalizedName = input.full_name.trim()

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: normalizedName,
    })
    .eq('id', userId)
    .select()
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('No se encontró el perfil del usuario.')
  }

  return data
}