import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ONIMIX EAGLE EYE Pick - Football Intelligence Dashboard',
  description: 'Professional football intelligence and prediction system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
