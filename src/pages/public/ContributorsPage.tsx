import { useEffect, useMemo, useState } from 'react'
import { Search, Sparkles, Users, Globe2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ContributorCard from '@/components/contributors/ContributorCard'
import FadeIn from '@/components/ui/FadeIn'
import EmptyState from '@/components/ui/EmptyState'
import SearchInput from '@/components/ui/SearchInput'
import SectionCard from '@/components/ui/SectionCard'
import { getActiveContributors } from '@/lib/api/contributors'
import type { ContributorListItem } from '@/types/contributors'

export default function ContributorsPage() {
  const { t } = useTranslation()

  const [contributors, setContributors] = useState<ContributorListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true

    const loadContributors = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getActiveContributors()
        if (!active) return

        setContributors(data)
      } catch (err) {
        if (!active) return

        const message =
          err instanceof Error ? err.message : t('contributors.errorTitle')

        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadContributors()

    return () => {
      active = false
    }
  }, [t])

  const filteredContributors = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) return contributors

    return contributors.filter((contributor) => {
      const name = contributor.name.toLowerCase()
      const bio = (contributor.short_bio || '').toLowerCase()
      const specialty = (contributor.specialty || '').toLowerCase()

      return (
        name.includes(normalized) ||
        bio.includes(normalized) ||
        specialty.includes(normalized)
      )
    })
  }, [contributors, query])

  return (
    <div className="bg-bg text-text-primary">
      <FadeIn>
        <section className="relative overflow-hidden px-6 py-14 md:px-10 lg:px-16 lg:py-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,116,115,0.10),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,171,199,0.08),transparent_28%)]" />
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                {t('contributors.badge')}
              </p>
              <h1 className="mt-2 font-heading text-4xl md:text-5xl">
                {t('contributors.title')}
              </h1>
              <p className="mt-4 font-body text-lg text-text-secondary">
                {t('contributors.subtitle')}
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SectionCard className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg">
                  {t('contributors.feature1Title')}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {t('contributors.feature1Body')}
                </p>
              </SectionCard>

              <SectionCard className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg">
                  {t('contributors.feature2Title')}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {t('contributors.feature2Body')}
                </p>
              </SectionCard>

              <SectionCard className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Globe2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg">
                  {t('contributors.feature3Title')}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {t('contributors.feature3Body')}
                </p>
              </SectionCard>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="px-6 pb-8 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <SectionCard className="p-5">
              <div className="mb-4">
                <h2 className="font-heading text-lg text-text-primary">
                  {t('contributors.searchTitle')}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {t('contributors.searchHelp')}
                </p>
              </div>

              <div className="max-w-xl">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder={t('contributors.searchPlaceholder')}
                />
              </div>
            </SectionCard>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.12}>
        <section className="px-6 pb-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-3xl border border-surface-border bg-surface p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-bg-soft" />
                      <div className="flex-1">
                        <div className="h-5 w-2/3 rounded bg-bg-soft" />
                        <div className="mt-3 h-4 w-1/2 rounded bg-bg-soft" />
                      </div>
                    </div>
                    <div className="mt-5 h-4 w-full rounded bg-bg-soft" />
                    <div className="mt-2 h-4 w-5/6 rounded bg-bg-soft" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <SectionCard className="border-red-500/20 bg-red-500/10 p-6">
                <h2 className="font-heading text-xl">
                  {t('contributors.errorTitle')}
                </h2>
                <p className="mt-2 text-sm text-text-secondary">{error}</p>
              </SectionCard>
            ) : filteredContributors.length === 0 ? (
              <EmptyState
                icon={<Search className="h-5 w-5" />}
                title={t('contributors.emptyTitle')}
                description={t('contributors.emptyBody')}
              />
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-text-secondary">
                    {t('contributors.resultsFound', {
                      count: filteredContributors.length,
                    })}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredContributors.map((contributor, index) => (
                    <FadeIn key={contributor.id} delay={0.02 * (index % 6)}>
                      <div className="transition-transform duration-200 hover:-translate-y-1">
                        <ContributorCard
                          name={contributor.name}
                          slug={contributor.slug}
                          shortBio={contributor.short_bio}
                          specialty={contributor.specialty}
                          avatarUrl={contributor.avatar_url}
                          websiteUrl={contributor.website_url}
                        />
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </FadeIn>
    </div>
  )
}