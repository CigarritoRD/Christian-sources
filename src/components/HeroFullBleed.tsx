import { useNavigate } from 'react-router-dom'
import CountUp from './CountUp'
import recursosImages from '../assets/recursos-digitales.png'

type HeroStats = {
  totalResources: number
  totalVideos: number
  totalPdfs: number
}

export default function HeroFullBleed({
  bgImageUrl,
  stats,
}: {
  bgImageUrl: string
  stats?: HeroStats
}) {
  const nav = useNavigate()

  return (
    <section className="relative w-full bg-card flex px-10 items-center justify-center sm:h-[600px] lg:h-[800px]">
   
      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 flex-1 align-middle lg:px-8 lg:py-32 flex justify-center">
        <div className="max-w-3xl">
          <span className="inline-flex bg-app border-app text-muted items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs text-white/80">
            ✔ Recursos verificados · Iglesias y ministerios
          </span>

          <h1 className="mt-6 lg:text-7xl text-app sm:text-6xl font-extrabold tracking-tight text-white">
            Equipando a la{' '}
            <span className="text-indigo-300">Iglesia</span>
          </h1>

          <p className="mt-4 text-muted max-w-2xl text-base sm:text-[24px] text-white/80">
            Encuentra material confiable para predicación, discipulado, talleres
            y ministerios. Ahorra tiempo y prepara con excelencia.
          </p>

          {/* Search */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-app bg-app px-4 py-3">
              <span className="text-app">🔎</span>
              <input
                className="w-full bg-transparent text-sm text-app placeholder:text-muted outline-none"
                placeholder="Buscar predicaciones, guías, temas, ministerios…"
              />
            </div>

            <button
              onClick={() => nav('/explorar')}
              className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Explorar
            </button>
          </div>
          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              label="Recursos"
              value={stats?.totalResources ?? 128}
              hint="Verificados y listos"
            />
            <StatCard
              label="Videos"
              value={stats?.totalVideos ?? 64}
              hint="En línea"
            />
            <StatCard
              label="PDFs"
              value={stats?.totalPdfs ?? 52}
              hint="Descargables"
            />
          </div>


          {/* Chips */}
          <div className="mt-6 flex flex-wrap gap-2 text-app">
            {['Jóvenes', 'Parejas', 'Discipulado', 'Teología', 'Oración', 'Evangelismo'].map(
              (chip) => (
                <button
                  key={chip}
                  onClick={() => nav(`/explorar?topic=${encodeURIComponent(chip)}`)}
                  className="rounded-full border border-app px-3 py-1 text-sm  hover:bg-white/10"
                >
                  {chip}
                </button>
              )
            )}
          </div>
        </div>
      </div>
      <div className=' w-full max-h-[550px] min-w-[350px] flex-1 rounded-lg overflow-hidden drop-shadow-lg'>
        <img className="w-full h-full object-cover" src={recursosImages} alt="Recursos digitales" />
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
    <div className="rounded-2xl border border-app bg-app drop-shadow-sm px-4 py-3">
      <div className="text-xl text-muted">{label}</div>
      <div className="mt-1 text-3xl font-extrabold tracking-tight text-app">
        <CountUp value={value} durationMs={1000} />
        <span className="text-app">+</span>
      </div>
      {hint ? <div className="mt-1 text-xs text-muted opacity-90">{hint}</div> : null}
    </div>
  )
}

