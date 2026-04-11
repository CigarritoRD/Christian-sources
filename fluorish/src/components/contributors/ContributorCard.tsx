import { Link } from 'react-router-dom'

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
  return (
    <article className="group flex h-full shadow-soft hover:shadow-card hover:-translate-y-0.5 flex-col rounded-3xl border border-surface-border bg-surface p-6 shadow-soft transition duration-300 hover:bg-surface-hover hover:shadow-card">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-bg-soft">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-text-secondary">
              {name.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-xl text-text-primary">{name}</h3>
          {specialty ? (
            <p className="mt-1 text-sm text-brand-accent">{specialty}</p>
          ) : null}
        </div>
      </div>

      {shortBio ? (
        <p className="mt-5 text-sm leading-6 text-text-secondary">
          {shortBio}
        </p>
      ) : null}

      <div className="mt-auto pt-6 flex flex-wrap gap-3">
        <Link
          to={`/contributors/${slug}`}
          className="inline-flex rounded-2xl border border-surface-border bg-bg-soft px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
        >
          Ver perfil
        </Link>

        {websiteUrl ? (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-2xl bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Visitar web
          </a>
        ) : null}
      </div>
    </article>
  )
}