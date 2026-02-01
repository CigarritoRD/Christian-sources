import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="rounded-2xl border border-app surface px-3 py-2 text-sm text-muted hover:text-app surface-hover transition"
      title="Cambiar tema"
    >
      {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
    </button>
  )
}
