import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EZ Apps',
  description: 'All your e-commerce apps, one platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
