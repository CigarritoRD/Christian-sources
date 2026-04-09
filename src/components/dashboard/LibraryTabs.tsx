type LibraryTabValue = 'all' | 'saved' | 'favorite' | 'assigned' | 'unlocked'

type LibraryTabsProps = {
  value: LibraryTabValue
  onChange: (value: LibraryTabValue) => void
}

const tabs: { label: string; value: LibraryTabValue }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Guardados', value: 'saved' },
  { label: 'Favoritos', value: 'favorite' },
  { label: 'Asignados', value: 'assigned' },
  { label: 'Desbloqueados', value: 'unlocked' },
]

export default function LibraryTabs({ value, onChange }: LibraryTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => {
        const isActive = tab.value === value

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={[
              'rounded-2xl px-4 py-2 text-sm font-medium transition',
              isActive
                ? 'bg-brand-primary text-white shadow-soft'
                : 'border border-surface-border bg-surface text-text-primary hover:bg-surface-hover',
            ].join(' ')}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}