import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'

type AppButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode
  variant?: AppButtonVariant
  fullWidth?: boolean
}

function getVariantClasses(variant: AppButtonVariant) {
  switch (variant) {
    case 'primary':
      return 'bg-brand-primary text-white hover:opacity-90'
    case 'secondary':
      return 'border border-surface-border bg-surface text-text-primary hover:bg-surface-hover'
    case 'ghost':
      return 'bg-transparent text-text-secondary hover:bg-bg-soft hover:text-text-primary'
    case 'danger':
      return 'border border-red-200 bg-surface text-red-700 hover:bg-red-50'
    case 'success':
      return 'border border-green-200 bg-surface text-green-700 hover:bg-green-50'
    default:
      return 'bg-brand-primary text-white hover:opacity-90'
  }
}

export default function AppButton({
  children,
  variant = 'primary',
  className = '',
  fullWidth = false,
  disabled,
  type = 'button',
  ...props
}: AppButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.98 }}
      type={type}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition',
        'disabled:cursor-not-allowed disabled:opacity-60',
        fullWidth ? 'w-full' : '',
        getVariantClasses(variant),
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </motion.button>
  )
}