export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
      <div className="text-lg font-semibold">{title}</div>
      {subtitle ? <div className="mt-2 text-sm text-white/60">{subtitle}</div> : null}
    </div>
  )
}
