import { motion, type HTMLMotionProps } from 'framer-motion'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { stripUiMotion } from '@/config/debugMotion'
import { cn } from '@/lib/cn'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary:
    'border-transparent bg-foreground text-background hover:bg-foreground/90',
  outline: 'border-border bg-transparent text-foreground hover:border-foreground/30',
  ghost: 'border-transparent bg-transparent text-foreground hover:bg-white/5',
} as const

const sizes = {
  sm: 'h-9 rounded-md px-3 text-sm',
  md: 'h-11 rounded-md px-4 text-sm',
  lg: 'h-12 rounded-lg px-6 text-base',
} as const

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => {
    const cls = cn(
      'inline-flex cursor-pointer items-center justify-center font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40',
      'border',
      variants[variant],
      sizes[size],
      className,
    )

    if (stripUiMotion) {
      return <button ref={ref} type={type} className={cls} {...props} />
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 520, damping: 32 }}
        className={cls}
        {...(props as HTMLMotionProps<'button'>)}
      />
    )
  },
)

Button.displayName = 'Button'
