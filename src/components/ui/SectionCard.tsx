import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type SectionCardProps = {
  children: ReactNode
  className?: string
}

export default function SectionCard({
  children,
  className = '',
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={[
        'rounded-2xl border border-surface-border bg-surface shadow-[var(--shadow-soft)]',
        className,
      ].join(' ')}
    >
      {children}
    </motion.div>
  )
}