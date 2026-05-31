import type { ReactNode } from 'react'

interface SectionHeaderWithIconProps {
  icon: ReactNode
  children: ReactNode
}

export function SectionHeaderWithIcon({ icon, children }: SectionHeaderWithIconProps) {
  return (
    <div className="flex items-center gap-3 my-8 lg:my-16">
      {icon}
      <h3 className="text-h3 font-bold text-foreground leading-none">{children}</h3>
    </div>
  )
}
