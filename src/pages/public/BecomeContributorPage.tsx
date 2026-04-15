import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Send } from 'lucide-react'
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
  const { user, profile } = useAuth()

  const initialName = useMemo(
    () => profile?.full_name?.trim() || '',
    [profile?.full_name],
  )

  const initialEmail = useMemo(() => user?.email || '', [user?.email])

  const [fullName, setFullName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [country, setCountry] = useState(profile?.country  ?? '')
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

    const normalizedName = fullName.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedName) {
      toast.error('Escribe tu nombre completo.')
      return
    }

    if (!normalizedEmail) {
      toast.error('Escribe tu correo electrónico.')
      return
    }

    try {
      setLoading(true)

      let avatarUrl: string | null = null

      if (avatarFile) {
        avatarUrl = await uploadContributorApplicationAvatar(
          avatarFile,
          user?.id || normalizedEmail,
        )
      }

      await createContributorApplication({
        user_id: user?.id ?? null,
        full_name: normalizedName,
        email: normalizedEmail,
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

      toast.success('Tu solicitud fue enviada correctamente.')
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error('No se pudo enviar tu solicitud.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bg text-text-primary">
      <FadeIn>
        <section className="relative overflow-hidden px-6 py-14 md:px-10 lg:px-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,116,115,0.10),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,171,199,0.08),transparent_28%)]" />
          <div className="mx-auto max-w-5xl">
            <SectionCard className="p-8 md:p-10">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-bg-soft px-4 py-1 text-sm text-text-secondary">
                  <Sparkles className="h-4 w-4" />
                  Colaboradores
                </div>

                <h1 className="mt-4 font-heading text-4xl md:text-5xl">
                  Aplica para ser colaborador
                </h1>

                <p className="mt-4 text-lg text-text-secondary">
                  Completa este formulario para que revisemos tu perfil. Si tu
                  solicitud es aprobada, tu perfil podrá formar parte de Toolkit Box.
                </p>
              </div>
            </SectionCard>
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
                    <h2 className="font-heading text-xl">Información básica</h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      Cuéntanos quién eres y desde dónde colaboras.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AppInput
                      label="Nombre completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre"
                    />

                    <AppInput
                      label="Correo electrónico"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                    />

                    <AppInput
                      label="País"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="República Dominicana"
                    />

                    <AppInput
                      label="Organización"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Nombre de tu organización"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="font-heading text-xl">Perfil</h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      Comparte tu enfoque, experiencia y tipo de contribución.
                    </p>
                  </div>

                  <AppInput
                    label="Especialidad"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Formación, liderazgo, bienestar, discipulado..."
                  />

                  <AppTextarea
                    label="Biografía corta"
                    rows={3}
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                    placeholder="Resumen breve para presentar tu perfil."
                  />

                  <AppTextarea
                    label="Biografía completa"
                    rows={6}
                    value={fullBio}
                    onChange={(e) => setFullBio(e.target.value)}
                    placeholder="Describe tu trabajo, experiencia y enfoque."
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="font-heading text-xl">Avatar</h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      Puedes subir una foto o imagen representativa de tu perfil.
                    </p>
                  </div>

                  <FileInput
                    label="Imagen de perfil"
                    accept="image/*"
                    fileName={avatarFile?.name ?? null}
                    hint="PNG, JPG o WEBP"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                    onClear={() => setAvatarFile(null)}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="font-heading text-xl">Enlaces</h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      Agrega tus enlaces relevantes para revisión.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AppInput
                      label="Sitio web"
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
                    {loading ? 'Enviando...' : 'Enviar solicitud'}
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