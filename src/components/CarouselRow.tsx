import { useEffect, useMemo, useRef, useState } from 'react'
import type { Resource } from '../types/resource'
import ResourceCard from './ResourceCard'

export default function CarouselRow({
  title,
  items,
}: {
  title: string
  items: Resource[]
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const scrollBy = (dx: number) => {
    scrollerRef.current?.scrollBy({ left: dx, behavior: 'smooth' })
  }

  const updateArrows = () => {
    const el = scrollerRef.current
    if (!el) return
    // tolerancia 2px por subpixeles
    setCanLeft(el.scrollLeft > 2)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }

  useEffect(() => {
    updateArrows()
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => updateArrows()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateArrows)

    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateArrows)
    }
     
  }, [items.length])

  const step = useMemo(() => {
    // scroll por “pantalla” aprox (más natural que 360 fijo)
    const el = scrollerRef.current
    return el ? Math.round(el.clientWidth * 0.9) : 420
  }, [items.length])

  return (
    <section className="relative">
      {title ? (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-[22px] sm:text-[26px] font-extrabold text-app">
            {title}
          </h2>
        </div>
      ) : null}

      {/* Flecha izquierda */}
      <button
        onClick={() => scrollBy(-step)}
        disabled={!canLeft}
        className={[
          'hidden md:flex absolute left-[-14px] top-1/2 z-20 -translate-y-1/2',
          'h-11 w-11 items-center justify-center rounded-full',
          'border border-app bg-card shadow-sm',
          'text-app/80 transition',
          'hover:bg-[rgb(var(--surface2))]/10 hover:text-app hover:shadow-md',
          'disabled:opacity-0 disabled:pointer-events-none',
        ].join(' ')}
        aria-label="Scroll left"
      >
        <ChevronLeft />
      </button>

      {/* Flecha derecha */}
      <button
        onClick={() => scrollBy(step)}
        disabled={!canRight}
        className={[
          'hidden md:flex absolute right-[-14px] top-1/2 z-20 -translate-y-1/2',
          'h-11 w-11 items-center justify-center rounded-full',
          'border border-app bg-card shadow-sm',
          'text-app/80 transition',
          'hover:bg-[rgb(var(--surface2))]/10 hover:text-app hover:shadow-md',
          'disabled:opacity-0 disabled:pointer-events-none',
        ].join(' ')}
        aria-label="Scroll right"
      >
        <ChevronRight />
      </button>

      {/* Fade izquierdo/derecho */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-gradient-to-r from-[rgb(var(--bg))] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l from-[rgb(var(--bg))] to-transparent" />

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-4 pr-10 scroll-smooth no-scrollbar snap-x snap-mandatory"
      >
        {items.map((r) => (
          <div key={r.id} className="snap-start">
            <ResourceCard resource={r} variant="carousel" showDescription />
          </div>
        ))}
      </div>
    </section>
  )
}

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}