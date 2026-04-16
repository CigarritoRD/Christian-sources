import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'

export default function PublicFooter() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-surface-border/60 bg-bg-soft/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-3 md:px-10 lg:px-16">
        <div>
          <h3 className="font-heading text-lg text-text-primary">Toolkit Box</h3>
          <p className="mt-3 max-w-sm text-sm text-text-secondary">
            {t('footer.description')}
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-text-secondary">
            {t('footer.navigation')}
          </h4>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link
              to="/"
              className="text-text-secondary transition hover:text-text-primary"
            >
              {t('footer.home')}
            </Link>
            <Link
              to="/resources"
              className="text-text-secondary transition hover:text-text-primary"
            >
              {t('footer.resources')}
            </Link>
            <Link
              to="/contributors"
              className="text-text-secondary transition hover:text-text-primary"
            >
              {t('footer.contributors')}
            </Link>
            <Link
              to="/become-a-contributor"
              className="text-text-secondary transition hover:text-text-primary"
            >
              {t('footer.becomeContributor')}
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-text-secondary">
            {t('footer.contribute')}
          </h4>

          <div className="mt-4 rounded-3xl border border-surface-border bg-surface p-5 shadow-[var(--shadow-soft)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <Sparkles className="h-4 w-4" />
            </div>

            <h5 className="mt-4 font-heading text-base text-text-primary">
              {t('footer.contributeTitle')}
            </h5>

            <p className="mt-2 text-sm text-text-secondary">
              {t('footer.contributeBody')}
            </p>

            <Link
              to="/become-a-contributor"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition hover:underline"
            >
              {t('footer.becomeContributor')} →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-border/60 px-6 py-4 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-text-secondary md:flex-row md:items-center md:justify-between">
          <p>{t('footer.rights')}</p>
          <p>{t('footer.madeFor')}</p>
        </div>
      </div>
    </footer>
  )
}