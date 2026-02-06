import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'

export default function Login() {
  const { signInWithPassword } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from || '/perfil/biblioteca'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  return (
    <AppLayout title="Iniciar sesión" subtitle="Accede para guardar recursos." showSearch={false}>
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
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err ? <div className="text-sm text-red-500">{err}</div> : null}

          <button
            onClick={async () => {
              setErr(null); setBusy(true)
              try {
                await signInWithPassword(email.trim(), password)
                nav(from)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (e: any) {
                setErr(e.message ?? 'Error al iniciar sesión')
              } finally {
                setBusy(false)
              }
            }}
            disabled={busy}
            className="w-full rounded-2xl bg-card border border-app px-4 py-3 text-sm font-semibold text-app hover:bg-brand-soft transition disabled:opacity-60"
          >
            {busy ? 'Entrando…' : 'Entrar'}
          </button>

          <div className="text-sm text-muted">
            ¿No tienes cuenta?{' '}
            <Link className="text-app underline" to="/register">Crear cuenta</Link>
          </div>

          {/* demo quickfill (opcional) */}
          <button
            type="button"
            onClick={() => {
              setEmail('demo@chrstn.app')
              setPassword('Demo123456!')
            }}
            className="w-full rounded-2xl border border-app surface px-4 py-3 text-sm text-muted surface-hover transition"
          >
            Usar credenciales demo
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
