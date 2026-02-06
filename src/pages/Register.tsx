import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useNavigate, Link } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'

export default function Register() {
  const { signUpWithPassword } = useAuth()
  const nav = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  return (
    <AppLayout title="Crear cuenta" subtitle="Regístrate para guardar recursos." showSearch={false}>
      <div className="mx-auto max-w-md rounded-2xl border border-app surface p-6">
        <div className="space-y-3">
          <input
            className="w-full rounded-2xl border border-app surface px-4 py-3 text-app placeholder:text-muted outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-2xl border border-app surface px-4 py-3 text-app placeholder:text-muted outline-none"
            placeholder="Contraseña (mín 6)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err ? <div className="text-sm text-red-500">{err}</div> : null}

          <button
            onClick={async () => {
              setErr(null); setBusy(true)
              try {
                await signUpWithPassword(email.trim(), password)
                nav('/perfil/biblioteca')
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (e: any) {
                setErr(e.message ?? 'Error al crear cuenta')
              } finally {
                setBusy(false)
              }
            }}
            disabled={busy}
            className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-soft transition disabled:opacity-60"
          >
            {busy ? 'Creando…' : 'Crear cuenta'}
          </button>

          <div className="text-sm text-muted">
            ¿Ya tienes cuenta?{' '}
            <Link className="text-app underline" to="/login">Iniciar sesión</Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
