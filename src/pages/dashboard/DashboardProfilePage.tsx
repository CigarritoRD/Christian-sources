import { useEffect, useMemo, useState } from 'react'
import { Camera, Save, RotateCcw, } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/auth/useAuth'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import FadeIn from '@/components/ui/FadeIn'
import FileInput from '@/components/ui/FileInput'
import SectionCard from '@/components/ui/SectionCard'
import {
  updateMyProfile,
  uploadProfileAvatar,
} from '@/lib/api/profile'

export default function DashboardProfilePage() {
  const { user, profile, refreshProfile } = useAuth()

  const initialName = useMemo(() => {
    return profile?.full_name?.trim() || user?.email?.split('@')[0] || ''
  }, [profile?.full_name, user?.email])

  const initialAvatar = profile?.avatar_url ?? ''

  const [fullName, setFullName] = useState(initialName)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFullName(initialName)
  }, [initialName])

  useEffect(() => {
    setAvatarUrl(initialAvatar)
  }, [initialAvatar])

  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(avatarFile)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [avatarFile])

  const hasChanges =
    fullName.trim() !== initialName.trim() || !!avatarFile || avatarUrl !== initialAvatar

  const displayInitial = (fullName.trim() || user?.email || 'U')
    .charAt(0)
    .toUpperCase()

  const currentAvatar = previewUrl || avatarUrl || ''

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) {
      toast.error('No encontramos tu sesión.')
      return
    }

    const normalizedName = fullName.trim()

    if (!normalizedName) {
      toast.error('Escribe tu nombre.')
      return
    }

    try {
      setLoading(true)

      let nextAvatarUrl = avatarUrl || null

      if (avatarFile) {
        nextAvatarUrl = await uploadProfileAvatar(avatarFile, user.id)
      }

      await updateMyProfile(user.id, {
        full_name: normalizedName,
        avatar_url: nextAvatarUrl,
      })

      await refreshProfile()

      setAvatarFile(null)
      setAvatarUrl(nextAvatarUrl || '')
      toast.success('Perfil actualizado correctamente.')
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar el perfil.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFullName(initialName)
    setAvatarUrl(initialAvatar)
    setAvatarFile(null)
    setPreviewUrl(null)
  }

  return (
    <div className="bg-bg text-text-primary">
      <FadeIn>
        <section className="px-0 py-2">
          <div className="mx-auto max-w-5xl">
            <SectionCard className="p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                Perfil
              </p>
              <h1 className="mt-3 font-heading text-4xl md:text-5xl">
                Tu cuenta
              </h1>
              <p className="mt-4 max-w-2xl font-body text-lg text-text-secondary">
                Administra tu información básica y tu imagen dentro de Toolkit Box.
              </p>
            </SectionCard>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.06}>
        <section className="px-0 py-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <SectionCard className="p-6 text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-bg-soft shadow-[var(--shadow-soft)]">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt={fullName.trim() || 'Usuario'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-heading text-3xl text-text-primary">
                      {displayInitial}
                    </span>
                  )}
                </div>

                <p className="mt-4 font-medium text-text-primary">
                  {fullName.trim() || 'Usuario'}
                </p>

                <p className="mt-1 break-all text-sm text-text-secondary">
                  {user?.email}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-bg-soft px-3 py-2 text-xs text-text-secondary">
                  <Camera className="h-4 w-4" />
                  Avatar de perfil
                </div>
              </SectionCard>

              <SectionCard className="p-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <AppInput
                      label="Nombre completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre"
                    />

                    <AppInput
                      label="Correo electrónico"
                      type="email"
                      value={user?.email ?? ''}
                      disabled
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm font-medium text-text-primary">
                        ID de usuario
                      </p>
                      <div className="rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-sm text-text-secondary">
                        <span className="break-all">{user?.id}</span>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-medium text-text-primary">
                        Estado de cuenta
                      </p>
                      <div className="rounded-2xl border border-surface-border bg-bg-soft px-4 py-3 text-sm text-text-primary">
                        Activa
                      </div>
                    </div>
                  </div>

                  <FileInput
                    label="Avatar"
                    accept="image/*"
                    fileName={avatarFile?.name ?? null}
                    hint="PNG, JPG o WEBP"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  />

                  <div className="flex flex-wrap gap-3">
                    <AppButton type="submit" disabled={loading || !hasChanges}>
                      <Save className="h-4 w-4" />
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </AppButton>

                    <AppButton
                      type="button"
                      variant="secondary"
                      disabled={loading || !hasChanges}
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restablecer
                    </AppButton>
                  </div>
                </form>
              </SectionCard>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  )
}