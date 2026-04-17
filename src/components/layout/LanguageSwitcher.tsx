import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-surface-border bg-surface px-3 py-2 shadow-[var(--shadow-soft)]">
      <Languages className="h-4 w-4 text-brand-primary" />

      <select
        aria-label={t('language.label')}
        value={i18n.language}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        className="bg-transparent text-sm text-text-primary outline-none"
      >
        <option value="es">{t('language.spanish')}</option>
        <option value="en">{t('language.english')}</option>
      </select>
    </div>
  )
}