// src/components/CardActions.tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { toggleLibrary } from '../lib/libraryApi'
import { useEffect, useState } from 'react'

type Props = {
  resourceId: string
  initial?: { saved?: boolean; favorite?: boolean } // opcional (en Library, por ejemplo)
  size?: 'sm' | 'md'
}

export default function CardActions({ resourceId, initial, size = 'md' }: Props) {
  const { user } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  const [saved, setSaved] = useState(!!initial?.saved)
  const [favorite, setFavorite] = useState(!!initial?.favorite)
  const [busy, setBusy] = useState<'saved' | 'favorite' | null>(null)

  useEffect(() => {
    if (initial) {
      setSaved(!!initial.saved)
      setFavorite(!!initial.favorite)
    }
  }, [initial?.saved, initial?.favorite])

  const iconBtn =
    size === 'sm'
      ? 'h-9 w-9 rounded-xl'
      : 'h-10 w-10 rounded-2xl'

  const gate = () => {
    if (!user) {
      nav('/login', { state: { from: loc } })
      return false
    }
    return true
  }

  return (
    <div className="flex items-center gap-2">
      <button
        title={saved ? 'Quitar de guardados' : 'Guardar'}
        disabled={busy !== null}
        onClick={async (e) => {
          e.preventDefault()
          if (!gate()) return
          try {
            setBusy('saved')
            const res = await toggleLibrary('saved', resourceId)
            setSaved(res.active)
          } finally {
            setBusy(null)
          }
        }}
        className={[
          iconBtn,
          'grid place-items-center border transition',
          saved
            ? 'border-white/25 bg-white/10 text-white'
            : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white',
          busy ? 'opacity-60' : '',
        ].join(' ')}
      >
        {/* bookmark icon simple */}
        <span className="text-sm">{saved ? '🔖' : '📑'}</span>
      </button>

      <button
        title={favorite ? 'Quitar de favoritos' : 'Favorito'}
        disabled={busy !== null}
        onClick={async (e) => {
          e.preventDefault()
          if (!gate()) return
          try {
            setBusy('favorite')
            const res = await toggleLibrary('favorite', resourceId)
            setFavorite(res.active)
          } finally {
            setBusy(null)
          }
        }}
        className={[
          iconBtn,
          'grid place-items-center border transition',
          favorite
            ? 'border-rose-400/30 bg-rose-500/15 text-rose-200'
            : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white',
          busy ? 'opacity-60' : '',
        ].join(' ')}
      >
        <span className="text-sm">{favorite ? '♥' : '♡'}</span>
      </button>
    </div>
  )
}
