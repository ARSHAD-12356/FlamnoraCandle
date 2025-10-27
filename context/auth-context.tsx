"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
}

export interface Order {
  id: string
  date: string
  total: number
  status: "pending" | "shipped" | "delivered"
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  setAuthUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("flamnora_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simple validation
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    // Call the actual API
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `Login failed: ${response.status}`)
    }

    const newUser: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
    }

    setUser(newUser)
    localStorage.setItem("flamnora_user", JSON.stringify(newUser))
    if (data.token) {
      localStorage.setItem("flamnora_token", data.token)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    // Simple validation
    if (!email || !password || !name) {
      throw new Error("All fields are required")
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }
    if (!email.includes("@")) {
      throw new Error("Please enter a valid email")
    }

    // Call the actual API
    const response = await fetch("/api/Signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Signup failed")
    }

    const newUser: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
    }

    setUser(newUser)
    localStorage.setItem("flamnora_user", JSON.stringify(newUser))
    if (data.token) {
      localStorage.setItem("flamnora_token", data.token)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("flamnora_user")
    localStorage.removeItem("flamnora_token")
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("flamnora_user", JSON.stringify(updatedUser))
    }
  }

  const setAuthUser = (newUser: User | null) => {
    setUser(newUser)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
