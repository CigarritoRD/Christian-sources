import { Upload, X } from 'lucide-react'

type FileInputProps = {
  label?: string
  accept?: string
  fileName?: string | null
  hint?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
}

export default function FileInput({
  label,
  accept,
  fileName,
  hint,
  onChange,
}: FileInputProps) {
  return (
    <div>
      {label ? (
        <p className="mb-2 text-sm font-medium text-text-primary">
          {label}
        </p>
      ) : null}

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-bg-soft px-6 py-6 text-center transition hover:border-brand-accent hover:bg-surface-hover">
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <Upload className="h-4 w-4" />
          </div>

          <p className="text-sm font-medium text-text-primary">
            {fileName ? 'Cambiar archivo' : 'Subir archivo'}
          </p>

          {hint ? (
            <p className="text-xs text-brand-primary">{hint}</p>
          ) : null}
        </div>
      </label>

      {fileName ? (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-surface-border bg-surface px-4 py-2 text-sm">
          <span className="truncate text-text-primary">{fileName}</span>

          <span className="flex h-6 w-6 items-center justify-center rounded-md text-brand-primary">
            <X className="h-4 w-4" />
          </span>
        </div>
      ) : null}
    </div>
  )
}