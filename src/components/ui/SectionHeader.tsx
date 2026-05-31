import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import { Button } from './Button'

interface SectionHeaderProps {
  title: string
  href?: string
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center mb-8 gap-4">
      <h3 className="text-h3 font-bold text-foreground">{title}</h3>
      {href && (
        <Button variant="primary" size="sm" asChild className="bg-cyan-primary dark:bg-bg-surface dark:hover:bg-bg-surface">
          <Link href={href}>
            <LayoutGrid size={14} />
            Ver todos
          </Link>
        </Button>
      )}
    </div>
  )
}
