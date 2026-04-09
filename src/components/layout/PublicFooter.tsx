import { Link } from 'react-router-dom'

export default function PublicFooter() {
  return (
    <footer className="border-t border-surface-border/60 bg-bg-soft/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-3 md:px-10 lg:px-16">
        <div>
          <h3 className="font-heading text-lg text-text-primary">Toolkit Box</h3>
          <p className="mt-3 max-w-sm text-sm text-text-secondary">
            Una biblioteca de recursos para descubrir materiales útiles y conocer a los
            colaboradores que los comparten.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-text-secondary">
            Navegación
          </h4>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/" className="text-text-secondary transition hover:text-text-primary">
              Inicio
            </Link>
            <Link
              to="/resources"
              className="text-text-secondary transition hover:text-text-primary"
            >
              Recursos
            </Link>
            <Link
              to="/contributors"
              className="text-text-secondary transition hover:text-text-primary"
            >
              Colaboradores
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-text-secondary">
            Acceso
          </h4>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/login" className="text-text-secondary transition hover:text-text-primary">
              Iniciar sesión
            </Link>
            <Link
              to="/resources"
              className="text-text-secondary transition hover:text-text-primary"
            >
              Explorar biblioteca
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}