// src/components/ResourceCardSkeleton.tsx
export default function ResourceCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'carousel' | 'compact' }) {
  const size = variant === 'carousel' ? 'w-[260px] sm:w-[280px]' : 'w-full'
  const h = variant === 'compact' ? 'h-[120px]' : variant === 'carousel' ? 'h-[150px]' : 'h-[170px]'

  return (
    <div className={`${size} rounded-2xl border border-white/10 bg-white/5 overflow-hidden animate-pulse`}>
      <div className={`bg-white/10 ${h}`} />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/10 rounded w-4/5" />
        <div className="h-3 bg-white/10 rounded w-2/5" />
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-5/6" />
        <div className="flex justify-between pt-2">
          <div className="h-3 bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-white/10 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}
