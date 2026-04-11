import { Link } from 'react-router-dom'

export default function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0b1f1e] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4 md:px-10 lg:px-16">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-sm"
              style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
            >
              ✦
            </span>

            <div>
              <h3 className="font-heading text-lg font-extrabold tracking-wide text-white">
                Flourish
              </h3>
              <p className="text-xs text-white/60">Ministry Resource Hub</p>
            </div>
          </div>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            A curated library of trusted resources for churches, ministries, and leaders—
            built to help teams discover, save, and use ministry-ready content.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <FooterBadge>✓ Verified</FooterBadge>
            <FooterBadge>PDFs</FooterBadge>
            <FooterBadge>Videos</FooterBadge>
            <FooterBadge>Programs</FooterBadge>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-white/60">
            Navigation
          </h4>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/" className="text-white/75 transition hover:text-white">
              Home
            </Link>
            <Link to="/resources" className="text-white/75 transition hover:text-white">
              Resources
            </Link>
            <Link to="/contributors" className="text-white/75 transition hover:text-white">
              Contributors
            </Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-white/60">
            Access
          </h4>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/login" className="text-white/75 transition hover:text-white">
              Sign in
            </Link>
            <Link to="/register" className="text-white/75 transition hover:text-white">
              Create account
            </Link>
            <Link to="/resources" className="text-white/75 transition hover:text-white">
              Explore library
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-white/60">
            Stay connected
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Join Flourish to save resources, build your library, and keep up with new ministry content.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: 'rgb(var(--surface))' }}
            >
              Create account
            </Link>

            <Link
              to="/resources"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Browse resources
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-white/50 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
          <p>© {new Date().getFullYear()} Flourish. All rights reserved.</p>

          <div className="flex gap-4">
            <a href="#" onClick={(e) => e.preventDefault()} className="transition hover:text-white">
              Terms
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="transition hover:text-white">
              Privacy
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="transition hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
      {children}
    </span>
  )
}