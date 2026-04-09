import { useCallback, useEffect, useState } from 'react'
import {
  hasLibraryEntry,
  recordDownload,
  toggleLibraryEntry,
} from '@/lib/api/library'

type UseResourceActionsParams = {
  userId?: string | null
  resourceId?: string | null
}

export function useResourceActions({
  userId,
  resourceId,
}: UseResourceActionsParams) {
  const [saved, setSaved] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [loadingState, setLoadingState] = useState<
    null | 'saved' | 'favorite' | 'download'
  >(null)

  useEffect(() => {
    let active = true

    const loadState = async () => {
      if (!userId || !resourceId) {
        if (!active) return
        setSaved(false)
        setFavorite(false)
        return
      }

      try {
        const [savedExists, favoriteExists] = await Promise.all([
          hasLibraryEntry(userId, resourceId, 'saved'),
          hasLibraryEntry(userId, resourceId, 'favorite'),
        ])

        if (!active) return

        setSaved(savedExists)
        setFavorite(favoriteExists)
      } catch (error) {
        console.error('Error loading resource actions:', error)
      }
    }

    void loadState()

    return () => {
      active = false
    }
  }, [userId, resourceId])

  const toggleSaved = useCallback(async () => {
    if (!userId) {
      throw new Error('Debes iniciar sesión para guardar recursos.')
    }

    if (!resourceId) {
      throw new Error('No se encontró el recurso.')
    }

    setLoadingState('saved')
    try {
      const next = await toggleLibraryEntry(userId, resourceId, 'saved')
      setSaved(next)
      return next
    } finally {
      setLoadingState(null)
    }
  }, [userId, resourceId])

  const toggleFavorite = useCallback(async () => {
    if (!userId) {
      throw new Error('Debes iniciar sesión para marcar favoritos.')
    }

    if (!resourceId) {
      throw new Error('No se encontró el recurso.')
    }

    setLoadingState('favorite')
    try {
      const next = await toggleLibraryEntry(userId, resourceId, 'favorite')
      setFavorite(next)
      return next
    } finally {
      setLoadingState(null)
    }
  }, [userId, resourceId])

  const registerDownload = useCallback(async () => {
    if (!userId) {
      throw new Error('Debes iniciar sesión para descargar recursos.')
    }

    if (!resourceId) {
      throw new Error('No se encontró el recurso.')
    }

    setLoadingState('download')
    try {
      await recordDownload(userId, resourceId)
    } finally {
      setLoadingState(null)
    }
  }, [userId, resourceId])

  return {
    saved,
    favorite,
    loadingState,
    toggleSaved,
    toggleFavorite,
    registerDownload,
  }
}