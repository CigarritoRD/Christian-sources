import { Link } from 'react-router-dom'
import learning from '../assets/learning.jpg'
import team from '../assets/team.jpg'
import avatarPic from '../assets/avatar.png'

export function HomeExtras() {
  return (
    <div className="space-y-14">
      <WhoWeAre />
      <Sponsors />
      <Testimonials />
      <RegisterCTA />
    </div>
  )
}

/** ---------------- Who we are ---------------- **/
function WhoWeAre() {
  return (
    <section className="rounded-3xl border border-app bg-card p-6 sm:p-10 shadow-sm overflow-hidden relative">
      {/* color blobs */}
      <div
        className="pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full blur-3xl opacity-25"
        style={{ background: 'rgb(var(--surface2))' }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ background: 'rgb(var(--surface))' }}
      />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-app bg-[rgb(var(--surface2))]/10 px-4 py-1.5 text-xs font-semibold text-app">
            ✦ WHO WE ARE
          </div>

          <h2 className="mt-5 font-heading text-3xl sm:text-4xl font-extrabold text-app">
            A library built to help churches teach, grow, and lead.
          </h2>

          <p className="mt-4 font-body text-[18px] leading-relaxed text-muted">
            Fluorish is a curated portal where ministries can discover verified resources—
            ready to use for sermons, discipleship, youth nights, workshops, and training.
            We focus on clarity, quality, and practical application.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Feature label="Verified collections" />
            <Feature label="Ministry-ready" />
            <Feature label="Fast search" />
            <Feature label="Save favorites" />
          </div>
        </div>

        {/* Image placeholder */}
        <div className="relative">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-app bg-[rgb(var(--surface2))]/10 shadow-sm">
            {/* replace later with a real image */}
            <div className="h-full w-full grid place-items-center">
              <div className="text-center px-6">
                
                <div className="mt-2 text-sm text-muted">
                  <img className='rounded-xl' src={learning} alt="Placeholder image for home section" />
                </div>
                <div className="mt-5 flex justify-center gap-3">
                  <Avatar name="Maria" />
                  <Avatar name="David" />
                  <Avatar name="Sarah" />
                  <Avatar name="John" />
                </div>
              </div>
            </div>
          </div>

          {/* small floating card */}
          <div className="absolute -bottom-5 left-6 rounded-2xl border border-app bg-card px-4 py-3 shadow-sm">
            <div className="text-xs text-muted font-heading font-extrabold tracking-wide">
              CURATED WEEKLY
            </div>
            <div className="text-sm text-app font-semibold">New ministry picks added</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-app bg-card px-4 py-2 text-sm text-app shadow-sm">
      {label}
    </span>
  )
}

/** ---------------- Sponsors / Collaborators ---------------- **/
function Sponsors() {
  const items = [
    { name: 'Grace Community Church', note: 'Sermon series + guides' },
    { name: 'Youth Revival Network', note: 'Youth curriculum' },
    { name: 'Theology Notes', note: 'Study PDFs + outlines' },
    { name: 'Serve & Lead', note: 'Leadership workshops' },
    { name: 'Missions Hub', note: 'Mission training kits' },
    { name: 'Hope Counseling', note: 'Care resources' },
     { name: 'Serve & Lead', note: 'Leadership workshops' },
    { name: 'Missions Hub', note: 'Mission training kits' },
  ]

  return (
    <section className="rounded-3xl  bg-card p-6 sm:p-10 ">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-xs font-heading font-extrabold text-muted tracking-wide">
            COLLABORATORS
          </div>
          <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-app">
            Partners who contribute resources
          </h2>
          <p className="mt-2 text-muted font-body text-[17px]">
            We highlight ministries and creators who share practical, trusted material.
          </p>
        </div>

        <Link
          to="/colaboradores"
          className="rounded-2xl border border-app bg-card px-4 py-2 text-sm font-semibold text-app shadow-sm hover:bg-[rgb(var(--surface2))]/10 transition"
        >
          View all →
        </Link>
      </div>

      {/* “logo” grid (colorful placeholders) */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.name}
            className="rounded-2xl max-w-[350px] min-h-[100px]  bg-[rgb(var(--surface2))]/5 p-4 shadow-sm hover:bg-[rgb(var(--surface2))]/10 transition"
          >
            <div className="flex items-center gap-3">
              <LogoMark />
              <div className="min-w-0">
                <div className="font-semibold text-app truncate">{it.name}</div>
                <div className="text-sm text-muted">{it.note}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function LogoMark() {
  return (
    <div
      className="h-11 w-11 rounded-2xl border border-app shadow-sm grid place-items-center"
      style={{
        background:
          'linear-gradient(135deg, rgba(var(--surface2),0.18), rgba(var(--surface),0.18))',
      }}
    >
      <div className="text-app font-bold">✦</div>
    </div>
  )
}

/** ---------------- Testimonials ---------------- **/
function Testimonials() {
  const reviews = [
    {
      name: 'Ethan R.',
      role: 'Youth Leader',
      quote:
        'Fluorish saved us hours every week. The youth resources are organized, practical, and easy to reuse.',
    },
    {
      name: 'Naomi L.',
      role: 'Small Groups Coordinator',
      quote:
        'The PDFs are clean and ministry-ready. I love how fast it is to find topics for discipleship nights.',
    },
    {
      name: 'Pastor Miguel A.',
      role: 'Teaching Pastor',
      quote:
        'The verified tag builds trust. We can plan series quicker and keep quality consistent across the team.',
    },
    {
      name: 'Pastor Miguel A.',
      role: 'Teaching Pastor',
      quote:
        'The verified tag builds trust. We can plan series quicker and keep quality consistent across the team.',
    },
    {
      name: 'Pastor Miguel A.',
      role: 'Teaching Pastor',
      quote:
        'The verified tag builds trust. We can plan series quicker and keep quality consistent across the team.',
    },
     {
      name: 'Naomi L.',
      role: 'Small Groups Coordinator',
      quote:
        'The PDFs are clean and ministry-ready. I love how fast it is to find topics for discipleship nights.',
    },
  ]

  return (
    <section className="rounded-3xl border border-app bg-card p-6 sm:p-10 shadow-sm">
      <div className="text-xs font-heading font-extrabold text-muted tracking-wide">
        REVIEWS
      </div>
      <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-app">
        What people say
      </h2>

      <div className="mt-7 grid gap-4 lg:flex">
        {reviews.map((r) => (
          <div key={r.name} className="rounded-3xl max-w-[400px] border border-app bg-card p-6 shadow-sm relative overflow-hidden">
            <div
              className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl opacity-20"
              style={{ background: 'rgb(var(--surface2))' }}
            />
            <div className="flex items-center gap-3">
              <Avatar name={r.name} />
              <div className="min-w-0">
                <div className="font-semibold text-app">{r.name}</div>
                <div className="text-sm text-muted">{r.role}</div>
              </div>
            </div>

            <p className="mt-4 font-body text-[17px] leading-relaxed text-muted">
              “{r.quote}”
            </p>

            <div className="mt-4 text-sm" style={{ color: 'rgb(var(--surface2))' }}>
              ★★★★★
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/** ---------------- CTA Register ---------------- **/
function RegisterCTA() {
  return (
    <section className="rounded-3xl border border-app p-6 sm:p-10 shadow-sm overflow-hidden relative bg-card">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'linear-gradient(135deg, rgba(var(--surface2),0.16), rgba(var(--surface),0.10), transparent 60%)',
        }}
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-app bg-card px-4 py-1.5 text-xs font-semibold text-app shadow-sm">
            ✨ READY TO START?
          </div>

          <h2 className="mt-5 font-heading  sm:text-6xl font-extrabold text-[#007473] drop-shadow-md drop-shadow-black/40">
            Create your free account and build your ministry library.
          </h2>

          <p className="mt-4 font-body text-[28px] leading-relaxed text-muted ">
            Save resources, mark favorites, and access your curated collection anytime.
            Perfect for pastors, leaders, and ministry teams.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition"
              style={{ background: 'rgb(var(--surface))' }}
            >
              Create account
            </Link>

            <Link
              to="/explorar"
              className="rounded-2xl border border-app bg-card px-5 py-3 text-sm font-semibold text-app shadow-sm hover:bg-[rgb(var(--surface2))]/10 transition"
            >
              Explore first
            </Link>
          </div>
        </div>

        {/* image placeholder */}
        <div className="rounded-3xl border border-app bg-[rgb(var(--surface2))]/10 shadow-sm overflow-hidden">
          <div className="aspect-[16/11] w-full grid place-items-center p-6">
            <div className="text-center">
             
              <div className="mt-2 text-sm text-muted">
                <img className='rounded-2xl' src={team} alt="Learning image" />
              </div>

              <div className="mt-6 flex justify-center gap-2">
                <MiniStat label="Saved" value="120+" />
                <MiniStat label="Verified" value="1,250+" />
                <MiniStat label="Teams" value="50+" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-app bg-card px-4 py-3 shadow-sm">
      <div className="text-xs text-muted font-heading font-extrabold tracking-wide">{label}</div>
      <div className="mt-1 text-lg font-extrabold text-app">{value}</div>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  
  return (
    <div
      className="h-10 w-10 rounded-2xl border border-app grid place-items-center shadow-sm"
      style={{
        background:
          'linear-gradient(135deg, rgba(var(--surface2),0.22), rgba(var(--surface),0.18))',
      }}
      aria-label={name}
      title={name}
    >
      <img src={avatarPic} alt="" />
    </div>
  )
}