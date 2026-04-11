import type { User } from '@supabase/supabase-js'

export type UserRole = 'user' | 'admin'

export type Profile = {
  id: string
  full_name: string | null
  email: string | null
  role: UserRole
  avatar_url: string | null
  created_at?: string
  updated_at?: string
}

export type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}