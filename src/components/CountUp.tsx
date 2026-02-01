import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  value: number
  durationMs?: number
  from?: number
  format?: (n: number) => string
}

export default function CountUp({
  value,
  durationMs = 1000,
  from = 0,
  format,
}: Props) {
  const [display, setDisplay] = useState(from)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  const fmt = useMemo(() => {
    return (
      format ??
      ((n: number) =>
        n.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }))
    )
  }, [format])

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    startRef.current = null

    const fromVal = from
    const toVal = value
    const diff = toVal - fromVal

    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts
      const elapsed = ts - startRef.current
      const t = Math.min(1, elapsed / durationMs)

      // easing suave
      const eased = 1 - Math.pow(1 - t, 3)

      const current = Math.round(fromVal + diff * eased)
      setDisplay(current)

      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, durationMs, from])

  return <>{fmt(display)}</>
}
