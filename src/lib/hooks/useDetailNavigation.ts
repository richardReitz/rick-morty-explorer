'use client'

import { useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export function useDetailNavigation(route: string) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedId = searchParams.get('id') ? Number(searchParams.get('id')) : null
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)

  function handleSelect(id: number) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push(`/${route}?id=${id}`, { scroll: false })
  }

  function changePage(next: number) {
    setPage(next)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return { selectedId, page, setPage, listRef, handleSelect, changePage }
}
