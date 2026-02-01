// src/lib/format.ts
export function formatCompactNumber(n?: number | null) {
  if (!n) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export function formatDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) return null
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function clampText(text: string, max = 120) {
  const t = text.trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).trimEnd() + '…'
}
