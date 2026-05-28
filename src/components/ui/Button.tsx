import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
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
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-body rounded-lg',
  md: 'h-10 px-4 text-h4 rounded-lg',
  lg: 'h-12 px-6 text-h3 rounded-xl',
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
    'inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer',
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
