import { getEvents } from '@/data'
import { ApplicationLayout } from './application-layout'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const events = await getEvents()

  if (!session) {
    redirect('/auth/signin')
  }

  return <ApplicationLayout events={events}>{children}</ApplicationLayout>
}