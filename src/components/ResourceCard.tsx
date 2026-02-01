import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Resource } from '../types/resource'
import { getResourceImage } from '../lib/resourceImages'
import { formatCompactNumber, formatDuration } from '../lib/format'

type Variant = 'grid' | 'carousel' | 'compact'

type Props = {
  resource: Resource
  variant?: Variant
  showDescription?: boolean
  showMeta?: boolean
  className?: string
  rightSlot?: React.ReactNode
  id?: string
}

function typeLabel(t: Resource['type']) {
  if (t === 'video') return 'VIDEO'
  if (t === 'pdf') return 'PDF'
  if (t === 'program') return 'PROGRAMA'
  return 'RECURSO'
}

export default function ResourceCard({
  resource,
  variant = 'grid',
  showDescription = true,
  showMeta = true,
  className = '',
  rightSlot,
}: Props) {
  const duration = formatDuration(resource.duration_seconds ?? null)
  const rating = resource.rating_avg ?? null
  const views = resource.views_count ?? null

  const sizeClasses =
    variant === 'carousel' ? 'w-[260px] sm:w-[280px] flex-none' : 'w-full'

  const thumbHeight =
    variant === 'compact'
      ? 'h-[220px]'
      : variant === 'carousel'
      ? 'h-[250px]'
      : 'h-[270px]'

  const fallbackSrc = getResourceImage(resource)
  const [imgSrc, setImgSrc] = useState(resource.thumbnail_url || fallbackSrc)

  useEffect(() => {
    setImgSrc(resource.thumbnail_url || fallbackSrc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource.thumbnail_url, resource.id])

  return (
    <Link
      to={`/recurso/${resource.slug}`}
      className={[
        'group block rounded-2xl border border-app bg-card shadow-md',
        'surface-hover transition',
        'shadow-soft overflow-hidden',
        sizeClasses,
        className,
      ].join(' ')}
    >
      {/* THUMB */}
      <div className={`relative ${thumbHeight} overflow-hidden`}>
        <img
          src={imgSrc}
          alt={resource.title}
          className="h-full w-full object-cover transition group-hover:scale-[1.04]"
          loading="lazy"
          onError={() => {
            // fallback ultra seguro (por si algo falla)
            setImgSrc('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3C/svg%3E')
          }}
        />

        {/* overlay suave: en light necesita menos negro */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent dark:from-black/45 dark:via-black/10" />

        {/* shimmer SOLO si no hay thumbnail real */}
        {!resource.thumbnail_url ? (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(99,102,241,0.12),transparent_55%)]" />
        ) : null}

        <div className="absolute left-3 top-3 flex gap-2">
          <Badge>{typeLabel(resource.type)}</Badge>
          {resource.is_verified ? <Badge tone="success">VERIFICADO</Badge> : null}
        </div>

        <div className="absolute right-3 top-3 flex gap-2 items-center">
          {resource.is_premium ? <Badge tone="gold">PREMIUM</Badge> : null}
          {resource.is_featured ? <Badge tone="info">DESTACADO</Badge> : null}
        </div>

        <div className="absolute bottom-3 right-3 flex gap-2">
          {duration ? <Pill>{duration}</Pill> : null}
          {resource.pages ? <Pill>{resource.pages} pág</Pill> : null}
          {resource.file_size_mb ? <Pill>{Number(resource.file_size_mb).toFixed(1)} MB</Pill> : null}
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[20px] font-semibold leading-snug text-app">
              <span className="line-clamp-2">{resource.title}</span>
            </h3>

            {(resource.ministry || resource.topic) && (
              <p className="mt-1 text-md text-muted opacity-90 line-clamp-1">
                {resource.ministry ? <span>{resource.ministry}</span> : null}
                {resource.ministry && resource.topic ? <span className="mx-1 opacity-70">•</span> : null}
                {resource.topic ? <span>{resource.topic}</span> : null}
              </p>
            )}
          </div>

          {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
        </div>

        {showDescription && resource.description ? (
          <p className="mt-3 text-sm text-muted leading-relaxed">
            <span className="line-clamp-2 opacity-95">{resource.description}</span>
          </p>
        ) : null}

        {showMeta ? (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted">
              {rating ? (
                <>
                  <span className="text-amber-500 dark:text-amber-300">★</span>
                  <span className="font-medium text-app opacity-90">{rating.toFixed(1)}</span>
                  {resource.rating_count ? (
                    <span className="opacity-80">({formatCompactNumber(resource.rating_count)})</span>
                  ) : null}
                </>
              ) : (
                <span className="opacity-80">Sin calificaciones</span>
              )}

              {views !== null ? (
                <>
                  <span className="opacity-40">•</span>
                  <span className="opacity-80">{formatCompactNumber(views)} vistas</span>
                </>
              ) : null}
            </div>

            <div className="text-xs text-muted opacity-70 group-hover:opacity-100 transition">
              Ver →
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  )
}

function Badge({
  children,
  tone = 'default',
}: {
  children: React.ReactNode
  tone?: 'default' | 'success' | 'info' | 'gold'
}) {
  const toneClass =
    tone === 'success'
      ? 'bg-emerald-500/12 text-emerald-700 border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-400/20'
      : tone === 'info'
      ? 'bg-sky-500/12 text-sky-700 border-sky-500/25 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-400/20'
      : tone === 'gold'
      ? 'bg-amber-500/12 text-amber-800 border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-400/20'
      : 'surface text-app border-app opacity-95'

  return (
    <span
      className={[
        'px-2 py-1 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-md',
        toneClass,
      ].join(' ')}
    >
      {children}
    </span>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 rounded-full text-[11px] font-medium border border-white/10 bg-black/45 text-white/90 backdrop-blur-md dark:border-white/10">
      {children}
    </span>
  )
}
