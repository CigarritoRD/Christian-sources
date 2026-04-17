import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Send, Sparkles, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuth } from '@/auth/useAuth'
import FadeIn from '@/components/ui/FadeIn'
import SectionCard from '@/components/ui/SectionCard'
import AppInput from '@/components/ui/AppInput'
import AppTextarea from '@/components/ui/AppTextarea'
import AppButton from '@/components/ui/AppButton'
import FileInput from '@/components/ui/FileInput'
import {
  createContributorApplication,
  uploadContributorApplicationAvatar,
} from '@/lib/api/contributor-applications'

export default function BecomeContributorPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, profile } = useAuth()

  const initialContactName = useMemo(
    () => profile?.full_name?.trim() || '',
    [profile?.full_name],
  )

  const initialContactEmail = useMemo(() => user?.email || '', [user?.email])

  const [contactName, setContactName] = useState(initialContactName)
  const [contactRole, setContactRole] = useState('')
  const [contactEmail, setContactEmail] = useState(initialContactEmail)
  const [contactPhone, setContactPhone] = useState('')

  const [organizationName, setOrganizationName] = useState(
    profile?.organization ?? '',
  )
  const [country, setCountry] = useState(profile?.country ?? '')
  const [organization, setOrganization] = useState(profile?.organization ?? '')
  const [specialty, setSpecialty] = useState('')
  const [shortBio, setShortBio] = useState('')
  const [fullBio, setFullBio] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const normalizedContactName = contactName.trim()
    const normalizedContactEmail = contactEmail.trim().toLowerCase()
    const normalizedOrganizationName = organizationName.trim()

    if (!normalizedContactName) {
      toast.error(t('contributorApply.validation.contactName'))
      return
    }

    if (!normalizedContactEmail) {
      toast.error(t('contributorApply.validation.contactEmail'))
      return
    }

    if (!normalizedOrganizationName) {
      toast.error(t('contributorApply.validation.organizationName'))
      return
    }

    try {
      setLoading(true)

      let avatarUrl: string | null = null

      if (avatarFile) {
        avatarUrl = await uploadContributorApplicationAvatar(
          avatarFile,
          user?.id || normalizedContactEmail,
        )
      }

      await createContributorApplication({
        user_id: user?.id ?? null,

        contact_name: normalizedContactName,
        contact_role: contactRole.trim() || null,
        contact_email: normalizedContactEmail,
        contact_phone: contactPhone.trim() || null,

        organization_name: normalizedOrganizationName,
        avatar_url: avatarUrl,
        country: country.trim() || null,
        organization: organization.trim() || null,
        specialty: specialty.trim() || null,
        short_bio: shortBio.trim() || null,
        full_bio: fullBio.trim() || null,
        website_url: websiteUrl.trim() || null,
        instagram_url: instagramUrl.trim() || null,
        facebook_url: facebookUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        youtube_url: youtubeUrl.trim() || null,
      })

      toast.success(t('contributorApply.success'))
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error(t('contributorApply.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bg text-text-primary">
      <FadeIn>
        <section className="relative overflow-hidden px-6 py-14 md:px-10 lg:px-16 lg:py-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,116,115,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,171,199,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-1 text-sm text-brand-primary shadow-[var(--shadow-soft)]">
                  <Sparkles className="h-4 w-4 text-brand-primary" />
                  {t('contributorApply.badge')}
                </div>

                <h1 className="mt-4 font-heading text-4xl md:text-5xl">
                  {t('contributorApply.title')}
                </h1>

                <p className="mt-4 max-w-2xl text-lg text-brand-primary">
                  {t('contributorApply.subtitle')}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <SectionCard className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg text-text-primary">
                    {t('contributorApply.point1Title')}
                  </h3>
                  <p className="mt-2 text-sm text-brand-primary">
                    {t('contributorApply.point1Body')}
                  </p>
                </SectionCard>

                <SectionCard className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg text-text-primary">
                    {t('contributorApply.point2Title')}
                  </h3>
                  <p className="mt-2 text-sm text-brand-primary">
                    {t('contributorApply.point2Body')}
                  </p>
                </SectionCard>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.06}>
        <section className="px-6 pb-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <SectionCard className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <h2 className="font-heading text-xl">
                      {t('contributorApply.contactSection')}
                    </h2>
                    <p className="mt-1 text-sm text-brand-primary">
                      {t('contributorApply.contactHelp')}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AppInput
                      label={t('contributorApply.contactName')}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={t('contributorApply.contactNamePlaceholder')}
                    />

                    <AppInput
                      label={t('contributorApply.contactRole')}
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      placeholder={t('contributorApply.contactRolePlaceholder')}
                    />

                    <AppInput
                      label={t('contributorApply.contactEmail')}
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@email.com"
                    />

                    <AppInput
                      label={t('contributorApply.contactPhone')}
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder={t('contributorApply.contactPhonePlaceholder')}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="font-heading text-xl">
                      {t('contributorApply.ministrySection')}
                    </h2>
                    <p className="mt-1 text-sm text-brand-primary">
                      {t('contributorApply.ministryHelp')}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AppInput
                      label={t('contributorApply.organizationName')}
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder={t('contributorApply.organizationNamePlaceholder')}
                    />

                    <AppInput
                      label={t('contributorApply.country')}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder={t('contributorApply.countryPlaceholder')}
                    />

                    <AppInput
                      label={t('contributorApply.organization')}
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={t('contributorApply.organizationPlaceholder')}
                    />

                    <AppInput
                      label={t('contributorApply.specialty')}
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder={t('contributorApply.specialtyPlaceholder')}
                    />
                  </div>

                  <AppTextarea
                    label={t('contributorApply.shortBio')}
                    rows={3}
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                    placeholder={t('contributorApply.shortBioPlaceholder')}
                  />

                  <AppTextarea
                    label={t('contributorApply.fullBio')}
                    rows={6}
                    value={fullBio}
                    onChange={(e) => setFullBio(e.target.value)}
                    placeholder={t('contributorApply.fullBioPlaceholder')}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="font-heading text-xl">
                      {t('contributorApply.avatarSection')}
                    </h2>
                    <p className="mt-1 text-sm text-brand-primary">
                      {t('contributorApply.avatarHelp')}
                    </p>
                  </div>

                  <FileInput
                    label={t('contributorApply.avatar')}
                    accept="image/*"
                    fileName={avatarFile?.name ?? null}
                    hint="PNG, JPG o WEBP"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                    onClear={() => setAvatarFile(null)}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="font-heading text-xl">
                      {t('contributorApply.linksSection')}
                    </h2>
                    <p className="mt-1 text-sm text-brand-primary">
                      {t('contributorApply.linksHelp')}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AppInput
                      label={t('contributorApply.website')}
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://..."
                    />

                    <AppInput
                      label="Instagram"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/..."
                    />

                    <AppInput
                      label="Facebook"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/..."
                    />

                    <AppInput
                      label="LinkedIn"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />

                    <div className="md:col-span-2">
                      <AppInput
                        label="YouTube"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <AppButton type="submit" disabled={loading}>
                    <Send className="h-4 w-4" />
                    {loading
                      ? t('contributorApply.submitting')
                      : t('contributorApply.submit')}
                  </AppButton>
                </div>
              </form>
            </SectionCard>
          </div>
        </section>
      </FadeIn>
    </div>
  )
}