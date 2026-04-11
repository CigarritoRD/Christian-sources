type StatusBadgeTone = 'default' | 'success' | 'warning' | 'muted' | 'danger' | 'info'

type StatusBadgeProps = {
  label: string
  tone?: StatusBadgeTone
}

function getToneClasses(tone: StatusBadgeTone) {
  switch (tone) {
    case 'success':
      return 'bg-green-100 text-green-700'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'muted':
      return 'bg-zinc-100 text-zinc-600'
    case 'danger':
      return 'bg-red-100 text-red-700'
    case 'info':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-bg-soft text-text-secondary'
  }
}

export default function StatusBadge({
  label,
  tone = 'default',
}: StatusBadgeProps) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getToneClasses(tone)}`}>
      {label}
    </span>
  )
}