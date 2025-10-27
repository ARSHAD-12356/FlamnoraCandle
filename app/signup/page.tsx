"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import Navbar from "@/components/navbar"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await signup(email, password, name)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex flex-col justify-between px-4 py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/50 backdrop-blur-sm border border-border rounded-2xl shadow-xl p-8">
            <h1 className="font-serif text-3xl font-bold text-center mb-2 text-primary">Join Flamnora</h1>
            <p className="text-center text-foreground/60 mb-8">Create your account to get started</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-accent text-primary-foreground py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-foreground/60 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-accent font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium italic text-white shadow-lg">
            Developed by ArshXCoder
          </p>
        </div>
      </div>
    </>
  )
}
