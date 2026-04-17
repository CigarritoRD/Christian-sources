type StatCardProps = {
  label: string
  value: number
  helper?: string
}

export default function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-surface-border bg-surface p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.2em] text-brand-primary">
        {label}
      </p>
      <p className="mt-4 font-heading text-4xl text-text-primary">{value}</p>
      {helper ? <p className="mt-3 text-sm text-brand-primary">{helper}</p> : null}
    </article>
  )
}