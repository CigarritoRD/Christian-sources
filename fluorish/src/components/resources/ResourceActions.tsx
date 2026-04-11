import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { useResourceActions } from '@/hooks/useResourceActions'

type ResourceActionsProps = {
  resourceId: string
  fileUrl?: string | null
  externalUrl?: string | null
  isDownloadable?: boolean
  className?: string
}

export default function ResourceActions({
  resourceId,
  fileUrl,
  externalUrl,
  isDownloadable = true,
  className = '',
}: ResourceActionsProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    saved,
    favorite,
    loadingState,
    toggleSaved,
    toggleFavorite,
    registerDownload,
  } = useResourceActions({
    userId: user?.id ?? null,
    resourceId,
  })

  const handleRequireAuth = () => {
    navigate('/login')
  }

  const handleSaved = async () => {
    try {
      if (!user) {
        handleRequireAuth()
        return
      }
      await toggleSaved()
    } catch (error) {
      console.error(error)
    }
  }

  const handleFavorite = async () => {
    try {
      if (!user) {
        handleRequireAuth()
        return
      }
      await toggleFavorite()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDownload = async () => {
    const targetUrl = fileUrl || externalUrl
    if (!targetUrl) return

    try {
      if (!user) {
        handleRequireAuth()
        return
      }

      await registerDownload()
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <button
        type="button"
        onClick={handleSaved}
        disabled={loadingState === 'saved'}
        className={[
          'rounded-2xl px-4 py-2 text-sm font-medium transition',
          saved
            ? 'bg-brand-primary text-white'
            : 'border border-surface-border bg-bg-soft text-text-primary hover:bg-surface-hover',
        ].join(' ')}
      >
        {loadingState === 'saved'
          ? 'Guardando...'
          : saved
            ? 'Guardado'
            : 'Guardar'}
      </button>

      <button
        type="button"
        onClick={handleFavorite}
        disabled={loadingState === 'favorite'}
        className={[
          'rounded-2xl px-4 py-2 text-sm font-medium transition',
          favorite
            ? 'bg-brand-accent text-brand-ink'
            : 'border border-surface-border bg-bg-soft text-text-primary hover:bg-surface-hover',
        ].join(' ')}
      >
        {loadingState === 'favorite'
          ? 'Procesando...'
          : favorite
            ? 'Favorito'
            : 'Agregar a favoritos'}
      </button>

      {(fileUrl || externalUrl) && (
        <button
          type="button"
          onClick={handleDownload}
          disabled={loadingState === 'download'}
          className="rounded-2xl bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          {loadingState === 'download'
            ? 'Abriendo...'
            : isDownloadable
              ? 'Descargar'
              : 'Abrir'}
        </button>
      )}
    </div>
  )
}