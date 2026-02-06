import { useNavigate } from 'react-router-dom'
import CountUp from './CountUp'
import recursosImages from '../assets/recursos-digitales.png'

type HeroStats = {
  totalResources: number
  totalVideos: number
  totalPdfs: number
}

export default function HeroFullBleed({

  stats,
}: {
  bgImageUrl: string
  stats?: HeroStats
}) {
  const nav = useNavigate()

  return (
    <section className="relative w-full bg-app">
  {/* glow marca */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[rgb(var(--surface2))]/15 blur-3xl" />
    <div className="absolute top-24 left-0 h-[420px] w-[520px] rounded-full bg-[rgb(var(--surface))]/12 blur-3xl" />
  </div>

  <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
    {/* LEFT */}
    <div>
      <span className="inline-flex items-center gap-2 rounded-full border border-app bg-card px-4 py-1 text-xs text-muted shadow-sm">
        ✔ Recursos verificados · Iglesias y ministerios
      </span>

      <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-app sm:text-6xl lg:text-7xl">
        A digital toolbox that equips {' '}
        <span className="font-heading text-[rgb(var(--surface))]">congregations</span>
      </h1>

      <p className="mt-4 max-w-2xl text-base  text-muted sm:text-xl font-body">
       with practical resources and guidance to strengthen stewards, foster healthy community, and support sustainable ministry.
      </p>

      {/* Search */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-app bg-card px-4 py-3 shadow-sm">
          <span className="text-muted">🔎</span>
          <input
            className="w-full bg-transparent text-sm text-app placeholder:text-muted outline-none"
            placeholder="Buscar predicaciones, guías, temas, ministerios…"
          />
        </div>

        <button
          onClick={() => nav('/explorar')}
          className="rounded-2xl bg-[rgb(var(--surface))] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition"
        >
          Explore
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Recursos" value={stats?.totalResources ?? 128} hint="Verificados y listos" />
        <StatCard label="Videos" value={stats?.totalVideos ?? 64} hint="En línea" />
        <StatCard label="PDFs" value={stats?.totalPdfs ?? 52} hint="Descargables" />
      </div>

      {/* Chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {['Jóvenes', 'Parejas', 'Discipulado', 'Teología', 'Oración', 'Evangelismo'].map((chip) => (
          <button
            key={chip}
            onClick={() => nav(`/explorar?topic=${encodeURIComponent(chip)}`)}
            className="rounded-full border border-app bg-card px-3 py-1 text-sm text-app shadow-sm hover:border-[rgb(var(--surface))]/40 hover:bg-[rgb(var(--surface2))]/10 transition"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="w-full overflow-hidden rounded-3xl border border-app bg-card shadow-soft">
      <div className="aspect-[4/3] w-full">
        <img className="h-full w-full object-cover" src={recursosImages} alt="Recursos digitales" />
      </div>
    </div>
  </div>
</section>
  )
}
function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: number
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-app bg-card px-4 py-3 shadow-sm">
  <div className="text-xs text-muted">{label}</div>
  <div className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-app">
    <CountUp value={value} durationMs={1000} />
    <span className="text-[rgb(var(--surface))]">+</span>
  </div>
  {hint ? <div className="mt-1 text-xs text-muted">{hint}</div> : null}
</div>
  )
}

