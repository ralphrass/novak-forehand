"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/button"

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Entre na sua conta
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <Button
            onClick={() => signIn("azure-ad", { callbackUrl: "/" })}
            className="w-full flex justify-center py-3"
          >
            Entrar com Microsoft
          </Button>
        </div>
      </div>
    </div>
  )
}