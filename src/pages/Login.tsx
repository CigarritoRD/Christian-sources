import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'



export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()
  const loc = useLocation() as any
  const redirect = loc.state?.from?.pathname ?? '/'

  return (
    <AppLayout>
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-bold">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-white/60">Accede para guardar y ver tu biblioteca.</p>

        <div className="mt-5 space-y-3">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              const { error } = await supabase.auth.signInWithPassword({ email, password })
              setBusy(false)
              if (error) return alert(error.message)
              nav(redirect, { replace: true })
            }}
            className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-50"
          >
            Entrar
          </button>

          <div className="text-sm text-white/60">
            ¿No tienes cuenta? <Link to="/register" className="text-indigo-300 hover:text-indigo-200">Crear cuenta</Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
