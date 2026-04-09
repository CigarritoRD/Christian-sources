import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
    >
      <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
      <span className="hidden sm:inline">
        {theme === 'dark' ? 'Claro' : 'Oscuro'}
      </span>
    </button>
  )
}