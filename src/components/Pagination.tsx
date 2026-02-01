export default function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number
  totalPages: number
  onPage: (p: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        className={[
          'rounded-xl border border-app surface px-3 py-2 text-sm transition',
          'text-muted hover:text-app surface-hover',
          'disabled:opacity-40 disabled:cursor-not-allowed',
        ].join(' ')}
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
      >
        Prev
      </button>

      <div className="text-sm text-muted opacity-90">
        <span className="text-app font-semibold">{page}</span>
        <span className="opacity-60"> / </span>
        <span className="text-app font-semibold">{totalPages}</span>
      </div>

      <button
        className={[
          'rounded-xl border border-app surface px-3 py-2 text-sm transition',
          'text-muted hover:text-app surface-hover',
          'disabled:opacity-40 disabled:cursor-not-allowed',
        ].join(' ')}
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  )
}
