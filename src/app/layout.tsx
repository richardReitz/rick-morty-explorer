import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Rick & Morty App',
  description: 'Explore personagens, episódios e locais de Rick and Morty',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}