// components/protected-layout.tsx
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { ApplicationLayout } from '@/app/application-layout'

export function ProtectedLayout({ 
  children,
  events 
}: { 
  children: React.ReactNode
  events: any[] // ajuste o tipo conforme sua implementação
}) {
  const { status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div> // ou seu componente de loading
  }

  if (status === "unauthenticated") {
    redirect('/auth/signin')
  }

  return <ApplicationLayout events={events}>{children}</ApplicationLayout>
}