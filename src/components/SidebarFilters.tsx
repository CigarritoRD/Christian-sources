import type { ExploreFilters } from '../lib/query'
import type { ResourceType } from '../types/resource'

const MINISTRIES = ['Jóvenes', 'Parejas', 'Adoración', 'Liderazgo', 'Niños', 'Discipulado']
const TOPICS = ['Teología', 'Matrimonio', 'Oración', 'Misión', 'Soledad', 'Salud emocional']

export default function SidebarFilters({
  value,
  onChange,
}: {
  value: ExploreFilters
  onChange: (v: ExploreFilters) => void
}) {
  const toggleType = (t: ResourceType) => {
    const has = value.types.includes(t)
    const next = has ? value.types.filter((x) => x !== t) : [...value.types, t]
    onChange({ ...value, page: 1, types: next })
  }

  const toggleList = (key: 'ministries' | 'topics', item: string) => {
    const list = value[key]
    const has = list.includes(item)
    const next = has ? list.filter((x) => x !== item) : [...list, item]
    onChange({ ...value, page: 1, [key]: next } as ExploreFilters)
  }

  return (
    <aside className="hidden lg:block w-[280px] shrink-0">
      <div className="sticky top-[76px] rounded-2xl border border-app bg-card p-4 shadow-sm">
        <div className="text-xs font-heading font-extrabold text-muted tracking-wide">TIPO</div>
        <div className="mt-3 space-y-2">
          <Check label="Videos" checked={value.types.includes('video')} onChange={() => toggleType('video')} />
          <Check label="PDF" checked={value.types.includes('pdf')} onChange={() => toggleType('pdf')} />
          <Check label="Programas" checked={value.types.includes('program')} onChange={() => toggleType('program')} />
        </div>

        <div className="mt-7 text-xs font-heading font-extrabold text-muted tracking-wide">MINISTERIO</div>
        <div className="mt-3 space-y-2">
          {MINISTRIES.map((m) => (
            <Check
              key={m}
              label={m}
              checked={value.ministries.includes(m)}
              onChange={() => toggleList('ministries', m)}
            />
          ))}
        </div>

        <div className="mt-7 text-xs font-heading font-extrabold text-muted tracking-wide">TEMA</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => {
            const active = value.topics.includes(t)
            return (
              <button
                key={t}
                onClick={() => toggleList('topics', t)}
                className={[
                  'rounded-full border px-3 py-1 text-xs transition shadow-sm',
                  'border-app bg-card',
                  active
                    ? 'bg-[rgb(var(--surface2))]/10 border-[rgb(var(--surface))]/25 text-app'
                    : 'text-muted hover:text-app hover:bg-[rgb(var(--surface2))]/10',
                ].join(' ')}
              >
                {t}
              </button>
            )
          })}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <div className="text-xs font-heading font-extrabold text-muted tracking-wide">VERIFICADOS</div>

          <button
            onClick={() => onChange({ ...value, page: 1, verifiedOnly: !value.verifiedOnly })}
            className={[
              'h-6 w-11 rounded-full border transition relative',
              value.verifiedOnly
                ? 'border-[rgb(var(--surface))]/30 bg-[rgb(var(--surface))]/15'
                : 'border-app bg-card',
            ].join(' ')}
            aria-label="Solo verificados"
          >
            <span
              className={[
                'absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full transition shadow-sm',
                value.verifiedOnly
                  ? 'left-5 bg-[rgb(var(--surface))]'
                  : 'left-1 bg-[rgba(var(--text),0.25)]',
              ].join(' ')}
            />
          </button>
        </div>
      </div>
    </aside>
  )
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[rgb(var(--surface))]"
      />
      <span className="text-app opacity-85">{label}</span>
    </label>
  )
}