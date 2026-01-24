"use client"

import { createContext, useContext, type ReactNode } from "react"
import { type SuccessfullAuth } from '@/lib/auth/server'

type AuthContextType = SuccessfullAuth & {
  isLoading?: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children, session }: { children: ReactNode, session: SuccessfullAuth }) {

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  if (typeof window !== "undefined" && context.authorized) {
    if (context.subject.headquarters) {
      localStorage.setItem("headquarters", JSON.stringify(context.subject.headquarters));
    }
  }

  return context
}
