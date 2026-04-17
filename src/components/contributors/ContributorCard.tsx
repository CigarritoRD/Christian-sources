import { Link } from 'react-router-dom'
import { ArrowUpRight, Globe, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type ContributorCardProps = {
  name: string
  slug: string
  shortBio?: string | null
  specialty?: string | null
  avatarUrl?: string | null
  websiteUrl?: string | null
}

export default function ContributorCard({
  name,
  slug,
  shortBio,
  specialty,
  avatarUrl,
  websiteUrl,
}: ContributorCardProps) {
  const { t } = useTranslation()

  return (
    <article className="group h-full rounded-xl border border-surface-border bg-surface p-6 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-surface-border bg-bg-soft">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound className="h-7 w-7 text-brand-primary" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Link to={`/contributors/${slug}`} className="block">
            <h3 className="font-heading text-2xl leading-tight text-text-primary transition group-hover:text-brand-primary">
              {name}
            </h3>
          </Link>

          {specialty ? (
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-brand-primary">
              {specialty}
            </p>
          ) : null}
        </div>
      </div>

      {shortBio ? (
        <p className="mt-5 line-clamp-4 text-sm leading-7 text-brand-primary">
          {shortBio}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        <Link
          to={`/contributors/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-accent transition hover:underline"
        >
          {t('contributors.viewProfile')}
          <ArrowUpRight className="h-4 w-4" />
        </Link>

        {websiteUrl ? (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-bg-soft px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
          >
            <Globe className="h-4 w-4 text-brand-primary" />
            {t('contributors.website')}
          </a>
        ) : null}
      </div>
    </article>
  )
}