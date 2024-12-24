import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/auth-provider'

export const metadata: Metadata = {
  title: {
    template: '%s - Novak',
    default: 'Novak',
  },
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className="text-zinc-950 antialiased"
    >
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}