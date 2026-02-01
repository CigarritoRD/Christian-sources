import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#070A10]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Top */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                ✦
              </span>
              <div>
                <p className="text-sm font-semibold text-white/90">CHRSTN.</p>
                <p className="text-xs text-white/55">Recursos para la Iglesia</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Un espacio para encontrar material cristiano evangélico verificado:
              predicaciones, talleres, programas y recursos por ministerios.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>✅ Verificado</Badge>
              <Badge>📄 PDFs</Badge>
              <Badge>🎥 Videos</Badge>
              <Badge>📚 Programas</Badge>
            </div>
          </div>

          {/* Links */}
          <FooterCol title="Explorar">
            <FooterLink to="/explorar">Explorar recursos</FooterLink>
            <FooterLink to="/buscar?q=discipulado">Discipulado</FooterLink>
            <FooterLink to="/buscar?q=parejas">Parejas</FooterLink>
            <FooterLink to="/buscar?q=jovenes">Jóvenes</FooterLink>
          </FooterCol>

          <FooterCol title="Cuenta">
            <FooterLink to="/login">Iniciar sesión</FooterLink>
            <FooterLink to="/register">Crear cuenta</FooterLink>
            <FooterLink to="/perfil/biblioteca">Mi biblioteca</FooterLink>
            <FooterLink to="/explorar">Mis favoritos</FooterLink>
          </FooterCol>

          {/* Newsletter / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white/85">Novedades</h3>
            <p className="mt-2 text-sm text-white/60">
              Recibe recursos recientes y selecciones por ministerios.
            </p>

            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                // Demo: aquí luego conectamos con tu backend / supabase
                alert('¡Listo! (demo) Suscripción pendiente de conectar.')
              }}
            >
              <input
                type="email"
                required
                placeholder="Tu correo"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 placeholder:text-white/35 outline-none focus:border-white/20"
              />
              <button
                type="submit"
                className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-400 transition"
              >
                Unirme
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3 text-xs text-white/55">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                ⚡ Envíos semanales
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                🔒 Sin spam
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} CHRSTN. • Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-white/60">
            <a className="hover:text-white transition" href="#" onClick={(e) => e.preventDefault()}>
              Términos
            </a>
            <a className="hover:text-white transition" href="#" onClick={(e) => e.preventDefault()}>
              Privacidad
            </a>
            <a className="hover:text-white transition" href="#" onClick={(e) => e.preventDefault()}>
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white/85">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="block text-sm text-white/60 hover:text-white transition"
    >
      {children}
    </Link>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65">
      {children}
    </span>
  )
}
