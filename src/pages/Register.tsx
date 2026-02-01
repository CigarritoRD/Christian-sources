import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'


export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()

  return (
    <AppLayout>
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-bold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-white/60">Regístrate para guardar recursos.</p>

        <div className="mt-5 space-y-3">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
            placeholder="Contraseña (mín. 6)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              const { error } = await supabase.auth.signUp({ email, password })
              setBusy(false)
              if (error) return alert(error.message)
              alert('Cuenta creada. Revisa tu correo si Supabase requiere confirmación.')
              nav('/login')
            }}
            className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-50"
          >
            Crear
          </button>

          <div className="text-sm text-white/60">
            ¿Ya tienes cuenta? <Link to="/login" className="text-indigo-300 hover:text-indigo-200">Iniciar sesión</Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
