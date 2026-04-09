import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/auth/useAuth'
import { useResourceActions } from '@/hooks/useResourceActions'

type ResourceCardProps = {
  id: string
  title: string
  description?: string | null
  thumbnailUrl?: string | null
  type: string
  contributorName?: string | null
  slug?: string
}

function getTypeLabel(type: string) {
  const normalized = type.toLowerCase()

  switch (normalized) {
    case 'pdf':
      return 'PDF'
    case 'video':
      return 'VIDEO'
    case 'audio':
      return 'AUDIO'
    case 'image':
      return 'IMAGEN'
    case 'document':
      return 'DOCUMENTO'
    case 'link':
      return 'ENLACE'
    case 'download':
      return 'DESCARGA'
    default:
      return type.toUpperCase()
  }
}

function getTypeIcon(type: string) {
  const normalized = type.toLowerCase()

  switch (normalized) {
    case 'pdf':
      return '📄'
    case 'video':
      return '🎬'
    case 'audio':
      return '🎧'
    case 'image':
      return '🖼️'
    case 'document':
      return '📝'
    case 'link':
      return '🔗'
    case 'download':
      return '⬇️'
    default:
      return '📚'
  }
}

function getTypeAccent(type: string) {
  const normalized = type.toLowerCase()

  switch (normalized) {
    case 'pdf':
      return 'from-red-500/15 to-rose-500/10'
    case 'video':
      return 'from-cyan-500/15 to-sky-500/10'
    case 'audio':
      return 'from-violet-500/15 to-fuchsia-500/10'
    case 'image':
      return 'from-emerald-500/15 to-teal-500/10'
    case 'document':
      return 'from-amber-500/15 to-orange-500/10'
    case 'link':
      return 'from-blue-500/15 to-indigo-500/10'
    case 'download':
      return 'from-brand-primary/20 to-brand-accent/10'
    default:
      return 'from-brand-primary/15 to-brand-accent/10'
  }
}

export default function ResourceCard({
  id,
  title,
  description,
  thumbnailUrl,
  type,
  contributorName,
  slug,
}: ResourceCardProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { saved, favorite, loadingState, toggleSaved, toggleFavorite } =
    useResourceActions({
      userId: user?.id ?? null,
      resourceId: id,
    })

  const typeLabel = getTypeLabel(type)
  const typeIcon = getTypeIcon(type)
  const typeAccent = getTypeAccent(type)

  const requireAuth = () => {
    toast.info('Debes iniciar sesión para usar esta acción.')
    navigate('/login')
  }

  const handleSaved = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      if (!user) {
        requireAuth()
        return
      }

      const next = await toggleSaved()

      toast.success(
        next
          ? 'Recurso guardado en tu librería.'
          : 'Recurso eliminado de tu librería.',
      )
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar tu librería.')
    }
  }

  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      if (!user) {
        requireAuth()
        return
      }

      const next = await toggleFavorite()

      toast.success(
        next
          ? 'Recurso agregado a favoritos.'
          : 'Recurso eliminado de favoritos.',
      )
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar favoritos.')
    }
  }

  const cardContent = (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-0.5 hover:bg-surface-hover hover:shadow-[var(--shadow-card)]">
      <div className="relative h-44 w-full overflow-hidden bg-bg-soft">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col justify-between bg-gradient-to-br ${typeAccent} p-4`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="inline-flex rounded-full border border-surface-border bg-surface px-3 py-1 text-xs font-medium tracking-wide text-text-secondary">
                {typeLabel}
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-surface-border bg-surface text-lg shadow-[var(--shadow-soft)]">
                {typeIcon}
              </div>
            </div>

            <div>
              <p className="line-clamp-2 font-heading text-lg leading-snug text-text-primary">
                {title}
              </p>

              {contributorName ? (
                <p className="mt-2 text-sm text-text-secondary">
                  {contributorName}
                </p>
              ) : null}
            </div>
          </div>
        )}

        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={handleSaved}
            disabled={loadingState === 'saved'}
            className={`rounded-full border px-2.5 py-2 text-xs transition ${
              saved
                ? 'border-brand-primary bg-brand-primary text-white'
                : 'border-surface-border bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
            aria-label={saved ? 'Quitar de guardados' : 'Guardar recurso'}
            title={saved ? 'Quitar de guardados' : 'Guardar recurso'}
          >
            {loadingState === 'saved' ? '…' : '💾'}
          </button>

          <button
            type="button"
            onClick={handleFavorite}
            disabled={loadingState === 'favorite'}
            className={`rounded-full border px-2.5 py-2 text-xs transition ${
              favorite
                ? 'border-brand-accent bg-brand-accent text-brand-ink'
                : 'border-surface-border bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
            aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            title={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {loadingState === 'favorite' ? '…' : '⭐'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 inline-flex w-fit rounded-full border border-surface-border bg-bg-soft px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
          {typeLabel}
        </div>

        <h3 className="font-heading text-lg leading-snug text-text-primary">
          {title}
        </h3>

        {description ? (
          <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
            {description}
          </p>
        ) : null}

        <div className="mt-auto pt-4">
          {contributorName ? (
            <p className="text-xs text-neutral-muted">
              Por <span className="text-text-primary">{contributorName}</span>
            </p>
          ) : null}

          {slug ? (
            <span className="mt-3 inline-flex text-sm font-medium text-brand-accent transition hover:underline">
              Ver recurso →
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )

  if (!slug) {
    return cardContent
  }

  return <Link to={`/resources/${slug}`}>{cardContent}</Link>
}