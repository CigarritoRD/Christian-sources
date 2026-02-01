export function Tabs({
  value,
  onChange,
  items,
}: {
  value: string
  onChange: (v: string) => void
  items: { value: string; label: string }[]
}) {
  return (
    <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
      {items.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={[
            'px-4 py-2 text-sm rounded-xl transition',
            value === t.value ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white',
          ].join(' ')}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
