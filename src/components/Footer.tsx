import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#070A10]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Top */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-sm"
                style={{
                  boxShadow:
                    '0 0 0 1px rgba(255,255,255,0.06), 0 10px 25px rgba(0,0,0,0.35)',
                }}
              >
                ✦
              </span>

              <div className="leading-tight">
                <p className="text-sm font-extrabold text-white/90 tracking-wide">
                  FLUORISH
                </p>
                <p className="text-xs text-white/55">Resources for the Church</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/60">
              A curated hub of trusted Christian resources—sermons, workshops, programs,
              and ministry-ready material to help leaders teach with clarity and excellence.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>✅ Verified</Badge>
              <Badge>📄 PDFs</Badge>
              <Badge>🎥 Videos</Badge>
              <Badge>📚 Programs</Badge>
            </div>

            {/* little accent bar */}
            <div className="mt-6 h-[2px] w-24 rounded-full bg-white/10">
              <div
                className="h-full w-12 rounded-full"
                style={{ background: 'rgb(var(--surface2))' }}
              />
            </div>
          </div>

          {/* Links */}
          <FooterCol title="Explore">
            <FooterLink to="/explorar">Browse resources</FooterLink>
            <FooterLink to="/buscar?q=discipleship">Discipleship</FooterLink>
            <FooterLink to="/buscar?q=marriage">Marriage</FooterLink>
            <FooterLink to="/buscar?q=youth">Youth</FooterLink>
          </FooterCol>

          <FooterCol title="Account">
            <FooterLink to="/login">Sign in</FooterLink>
            <FooterLink to="/register">Create account</FooterLink>
            <FooterLink to="/perfil/biblioteca">My library</FooterLink>
            <FooterLink to="/explorar">Favorites</FooterLink>
          </FooterCol>

          {/* Newsletter / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white/85">Get updates</h3>
            <p className="mt-2 text-sm text-white/60">
              New resources, ministry picks, and curated collections—delivered weekly.
            </p>

            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                alert('Subscribed! (demo) Hook this to Supabase later.')
              }}
            >
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 placeholder:text-white/35 outline-none focus:border-white/20"
              />
              <button
                type="submit"
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: 'rgb(var(--surface))' }}
              >
                Join
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/55">
              <Pill>⚡ Weekly</Pill>
              <Pill>🔒 No spam</Pill>
              <Pill>✨ Hand-picked</Pill>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Fluorish • All rights reserved.
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-white/60">
            <a className="hover:text-white transition" href="#" onClick={(e) => e.preventDefault()}>
              Terms
            </a>
            <a className="hover:text-white transition" href="#" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <a className="hover:text-white transition" href="#" onClick={(e) => e.preventDefault()}>
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white/85">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="block text-sm text-white/60 hover:text-white transition">
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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
      {children}
    </span>
  )
}