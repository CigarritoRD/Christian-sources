import type { TextareaHTMLAttributes } from 'react'

type AppTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string | null
}

export default function AppTextarea({
  label,
  error,
  className = '',
  ...props
}: AppTextareaProps) {
  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-text-primary">{label}</span>
      ) : null}

      <textarea
        className={[
          'w-full rounded-xl border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition',
          'placeholder:text-brand-primary/70 focus:border-brand-primary',
          error ? 'border-red-300 focus:border-red-400' : '',
          className,
        ].join(' ')}
        {...props}
      />

      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  )
}