"use client"

import { useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { AccountTopup } from "@/components/account/account-topup"

export default function AccountPage() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      redirect("/auth/login")
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  return <AccountTopup />
}
