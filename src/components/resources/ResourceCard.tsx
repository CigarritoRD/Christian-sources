import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpen, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type ResourceCardProps = {
  id: string
  title: string
  description?: string | null
  thumbnailUrl?: string | null
  type?: string | null
  contributorName?: string | null
  slug: string
}

export default function ResourceCard({
  title,
  description,
  thumbnailUrl,
  type,
  contributorName,
  slug,
}: ResourceCardProps) {
  const { t } = useTranslation()

  return (
    <article className="group overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <Link to={`/resources/${slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-soft">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-primary/10 via-brand-accent/10 to-bg-soft">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border bg-surface text-text-secondary shadow-[var(--shadow-soft)]">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          )}

          {type ? (
            <div className="absolute left-4 top-4 rounded-full border border-surface-border bg-bg/90 px-3 py-1 text-xs font-medium uppercase tracking-wide text-text-primary backdrop-blur">
              {type}
            </div>
          ) : null}
        </div>
      </Link>

      <div className="p-5">
        <div className="min-h-[84px]">
          <Link to={`/resources/${slug}`} className="block">
            <h3 className="line-clamp-2 font-heading text-xl text-text-primary transition group-hover:text-brand-primary">
              {title}
            </h3>
          </Link>

          {description ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-secondary">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {contributorName ? (
              <div className="inline-flex min-w-0 items-center gap-2 text-sm text-text-secondary">
                <UserRound className="h-4 w-4 shrink-0" />
                <span className="truncate">{contributorName}</span>
              </div>
            ) : (
              <span className="text-sm text-text-secondary"> </span>
            )}
          </div>

          <Link
            to={`/resources/${slug}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-surface-border bg-bg-soft px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover hover:text-brand-primary"
          >
            {t('common.open')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}