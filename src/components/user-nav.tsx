'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from './button'

export function UserNav() {
  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">{session?.user?.email}</span>
      <Button
        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
      >
        Sair
      </Button>
    </div>
  )
}