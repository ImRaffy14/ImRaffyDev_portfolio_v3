import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export function Section({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section className={cn('py-20 md:py-28', className)} {...props} />
  )
}
