import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import { Button } from './Button'

interface SectionHeaderProps {
  title: string
  href: string
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-h3 font-bold text-foreground">{title}</h3>
      <Button variant="secondary" size="sm" asChild>
        <Link href={href}>
          <LayoutGrid size={14} />
          Ver todos
        </Link>
      </Button>
    </div>
  )
}
