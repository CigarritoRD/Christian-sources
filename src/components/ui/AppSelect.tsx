import type { SelectHTMLAttributes } from 'react'

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

      <select
        className={[
          'w-full rounded-xl border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition',
          'focus:border-brand-primary',
          error ? 'border-red-300 focus:border-red-400' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>

      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  )
}