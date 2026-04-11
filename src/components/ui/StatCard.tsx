import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type StatCardProps = {
  label: string
  value: number | string
  icon?: ReactNode
}

export default function StatCard({
  label,
  value,
  icon,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="rounded-2xl border border-surface-border bg-surface p-3 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">{label}</p>

        {icon ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-soft text-text-secondary">
            {icon}
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-xl font-semibold text-text-primary">
        {value}
      </p>
    </motion.div>
  )
}