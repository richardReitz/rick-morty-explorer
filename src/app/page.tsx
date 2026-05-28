import type { Metadata } from 'next'
import { HomePageClient } from './_components/HomePageClient'

export const metadata: Metadata = {
  title: 'Rick & Morty App',
  description: 'Explore personagens, episódios e localizações do universo Rick and Morty',
}

export default function Home() {
  return <HomePageClient />
}
