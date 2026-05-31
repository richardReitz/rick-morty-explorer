import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'surface'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
  loading?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-cyan-primary text-white hover:bg-cyan-secondary',
  secondary: 'border border-cyan-primary text-cyan-primary hover:bg-cyan-primary/10',
  ghost: 'text-cyan-primary hover:bg-cyan-primary/10',
  surface: 'bg-transparent text-foreground hover:bg-cyan-primary hover:text-white dark:bg-bg-surface dark:text-white dark:hover:bg-cyan-primary dark:hover:text-white',
}

const sizeStyles: Record<Size, string> = {
  sm: 'p-1.5 text-body rounded-full',
  md: 'h-10 px-5 text-h4 rounded-full',
  lg: 'h-12 px-6 text-h3 rounded-full',
}

export function Button({
  variant = 'primary',
  size = 'md',
  asChild,
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer [&>svg]:size-5 [&>svg]:shrink-0',
    variantStyles[variant],
    sizeStyles[size],
    (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  )

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        className: cn(
          classes,
          (children as React.ReactElement<{ className?: string }>).props.className
        ),
      }
    )
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
