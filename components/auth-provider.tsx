"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { auth, isDemoMode } from "@/lib/firebase"

interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  phoneNumber: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    if (isDemoMode) {
      // Demo mode - check localStorage
      const storedUser = localStorage.getItem("trademind-user")
      if (storedUser && mounted) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error("Error parsing stored user:", error)
          localStorage.removeItem("trademind-user")
        }
      }
      if (mounted) {
        setLoading(false)
      }
    } else {
      // Real Firebase mode
      const unsubscribe = auth.onAuthStateChanged((firebaseUser: any) => {
        if (!mounted) return

        if (firebaseUser) {
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            phoneNumber: firebaseUser.phoneNumber,
          }
          setUser(user)
          // Also store in localStorage for consistency
          localStorage.setItem("trademind-user", JSON.stringify(user))
        } else {
          setUser(null)
          localStorage.removeItem("trademind-user")
        }
        setLoading(false)
      })

      return () => {
        mounted = false
        unsubscribe()
      }
    }

    return () => {
      mounted = false
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Basic validation
      if (!email || !password) {
        throw new Error("Please enter both email and password")
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      const result = await auth.signInWithEmailAndPassword(email, password)

      if (result.user) {
        const user: User = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || result.user.email?.split("@")[0] || "User",
          photoURL: result.user.photoURL,
          phoneNumber: result.user.phoneNumber,
        }
        setUser(user)
        localStorage.setItem("trademind-user", JSON.stringify(user))
      }
    } catch (error: any) {
      console.error("Sign in error:", error)

      // Provide user-friendly error messages
      let errorMessage = "Failed to sign in"

      if (error.message.includes("user-not-found")) {
        errorMessage = "No account found with this email address"
      } else if (error.message.includes("wrong-password")) {
        errorMessage = "Incorrect password"
      } else if (error.message.includes("invalid-email")) {
        errorMessage = "Please enter a valid email address"
      } else if (error.message.includes("too-many-requests")) {
        errorMessage = "Too many failed attempts. Please try again later"
      } else if (error.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Basic validation
      if (!email || !password) {
        throw new Error("Please enter both email and password")
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      const result = await auth.createUserWithEmailAndPassword(email, password)

      if (result.user) {
        const user: User = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || email.split("@")[0],
          photoURL: result.user.photoURL,
          phoneNumber: result.user.phoneNumber,
        }
        setUser(user)
        localStorage.setItem("trademind-user", JSON.stringify(user))
      }
    } catch (error: any) {
      console.error("Sign up error:", error)

      // Provide user-friendly error messages
      let errorMessage = "Failed to create account"

      if (error.message.includes("email-already-in-use")) {
        errorMessage = "An account with this email already exists"
      } else if (error.message.includes("invalid-email")) {
        errorMessage = "Please enter a valid email address"
      } else if (error.message.includes("weak-password")) {
        errorMessage = "Password is too weak. Please choose a stronger password"
      } else if (error.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await auth.signOut()
      setUser(null)
      localStorage.removeItem("trademind-user")
    } catch (error: any) {
      console.error("Sign out error:", error)
      throw new Error("Failed to sign out")
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
