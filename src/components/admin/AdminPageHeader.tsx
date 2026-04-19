import type { ReactNode } from "react"


type Props = {
  badge?: string
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function AdminPageHeader({
  badge,
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {badge ? (
          <p className="text-sm uppercase tracking-[0.22em] text-brand-primary">
            {badge}
          </p>
        ) : null}

        <h1 className="mt-2 font-heading text-2xl md:text-3xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-2 text-sm text-text-secondary">
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  )
}