import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Information Security Suite',
  description: 'BADDIES DETECTION',
  generator: 'us',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
