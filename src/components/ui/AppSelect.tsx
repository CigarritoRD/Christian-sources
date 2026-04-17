import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

type AppSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string | null
}

export default function AppSelect({
  label,
  error,
  className = '',
  children,
  ...props
}: AppSelectProps) {
  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-text-primary">{label}</span>
      ) : null}

      <div className="relative">
        <select
          className={[
            'w-full appearance-none rounded-xl border border-surface-border bg-surface px-3 py-2 pr-10 text-sm text-text-primary outline-none transition',
            'focus:border-brand-primary',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error ? 'border-red-300 focus:border-red-400' : '',
            className,
          ].join(' ')}
          {...props}
        >
          {children}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-primary" />
      </div>

      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  )
}