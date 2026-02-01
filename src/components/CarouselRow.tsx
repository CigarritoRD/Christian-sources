import { useRef } from 'react'
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

  const scrollBy = (dx: number) => {
    scrollerRef.current?.scrollBy({ left: dx, behavior: 'smooth' })
  }

  return (
    <section className="mt-10 relative ">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[25px] font-semibold text-app/90">{title}</h2>
      </div>

      {/* Flecha izquierda */}
      <button
        onClick={() => scrollBy(-360)}
        className="
    hidden md:flex absolute left-[-40px] top-1/2 z-20 -translate-y-1/2
    h-12 w-12 items-center justify-center rounded-full
    bg-black/60 backdrop-blur-md
    border border-white/15
    text-white/80
    shadow-lg
    transition
    hover:scale-110 hover:bg-black/80 hover:text-white
    hover:shadow-xl
  "
        aria-label="Scroll left"
      >
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
      </button>

      {/* Flecha derecha */}
      <button
        onClick={() => scrollBy(360)}
        className="
    hidden md:flex absolute right-[-40px] top-1/2 z-20 -translate-y-1/2
    h-12 w-12 items-center justify-center rounded-full
    bg-black/60 backdrop-blur-md
    border border-white/15
    text-white/80
    shadow-lg
    transition
    hover:scale-110 hover:bg-black/80 hover:text-white
    hover:shadow-xl
  "
        aria-label="Scroll right"
      >
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
      </button>
      {/* Fade izquierdo */}
      <div
  className="pointer-events-none absolute left-0 top-8 h-[calc(100%-2rem)] w-8 z-10"
  style={{ background: 'linear-gradient(to right, rgb(var(--bg)), transparent)' }}
/>
<div
  className="pointer-events-none absolute right-0 top-8 h-[calc(100%-2rem)] w-10 z-10"
  style={{ background: 'linear-gradient(to left, rgb(var(--bg)), transparent)' }}
/>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-4 pr-10 scroll-smooth no-scrollbar"
      >
        {items.map((r) => (
          <ResourceCard
            key={r.id}
            resource={r}
            variant="carousel"
            showDescription={true}
          />
        ))}
      </div>
    </section>
  )
}
