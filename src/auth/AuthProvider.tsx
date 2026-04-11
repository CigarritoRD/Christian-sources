import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import type { AuthContextType, Profile } from '@/types/auth'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Session['user'] | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, avatar_url, created_at, updated_at')
      .eq('id', userId)
      .single()

    console.log('fetchProfile result', { userId, data, error })

    if (error) {
      console.error('Error loading profile:', error)
      return null
    }

    return data as Profile
  }, [])

  const hydrateAuth = useCallback(
    async (sessionUser: Session['user'] | null) => {
      setUser(sessionUser)

      if (!sessionUser) {
        setProfile(null)
        return
      }

      const nextProfile = await fetchProfile(sessionUser.id)
      setProfile(nextProfile)
    },
    [fetchProfile],
  )

  const refreshProfile = useCallback(async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      setProfile(null)
      return
    }

    const nextProfile = await fetchProfile(currentUser.id)
    setProfile(nextProfile)
  }, [fetchProfile])

  useEffect(() => {
    let isMounted = true

    async function initialize() {
      try {
        setLoading(true)

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
        }

        if (!isMounted) return

        await hydrateAuth(session?.user ?? null)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return

      void (async () => {
        try {
          setLoading(true)
          await hydrateAuth(session?.user ?? null)
        } finally {
          if (isMounted) {
            setLoading(false)
          }
        }
      })()
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [hydrateAuth])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }

    setUser(null)
    setProfile(null)
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      profile,
      loading,
      signOut,
      refreshProfile,
    }),
    [user, profile, loading, signOut, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}