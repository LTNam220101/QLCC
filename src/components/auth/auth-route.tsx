"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Spinner } from "@/components/ui/spinner" // Tạo component Spinner nếu chưa có

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}
