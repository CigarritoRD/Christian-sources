// src/components/FiltersDrawer.tsx
export default function FiltersDrawer({
  open,
  onClose,
  title = 'Filtros',
  children,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* overlay */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
        aria-label="Cerrar filtros"
      />

      {/* panel */}
      <div className="absolute right-0 top-0 h-full w-[92%] max-w-[380px] border-l border-white/10 bg-[#070A10] shadow-soft">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-semibold text-white/90">{title}</div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white"
          >
            Cerrar
          </button>
        </div>

        <div className="h-[calc(100%-56px)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
