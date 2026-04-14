import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import FadeIn from '@/components/ui/FadeIn'
import AppInput from '@/components/ui/AppInput'
import AppButton from '@/components/ui/AppButton'
import SectionCard from '@/components/ui/SectionCard'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      await signUp(email, password, name)

      toast.success('Cuenta creada correctamente 🎉')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-bg text-text-primary flex items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,116,115,0.12),transparent_40%),radial-gradient(circle_at_top_right,rgba(0,171,199,0.10),transparent_35%)]" />

      <FadeIn>
        <SectionCard className="w-full max-w-md p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <UserPlus className="h-5 w-5" />
            </div>

            <h1 className="mt-4 font-heading text-2xl">Crear cuenta</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Únete a Toolkit Box
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AppInput
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <AppInput
              label="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <AppInput
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <AppButton type="submit" disabled={loading} className="w-full">
              {loading ? 'Creando...' : 'Crear cuenta'}
            </AppButton>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-brand-accent hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </SectionCard>
      </FadeIn>
    </div>
  )
}