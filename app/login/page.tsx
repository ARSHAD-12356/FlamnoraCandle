"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, setAuthUser } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md mb-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">
            Flamnora <span className="text-accent">✨</span>
          </h1>
          <p className="text-foreground">Welcome back to luxury candles</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
          <h2 className="font-serif text-2xl font-bold text-center mb-2 text-foreground">Sign In</h2>
          <p className="text-center text-muted-foreground mb-8">Access your Flamnora account</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all"
                  placeholder="you@example.com"
                  autoComplete="off"
                  data-form-type="other"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  data-form-type="other"
                  required
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-primary hover:text-accent font-semibold hover:underline text-sm">Forgot password?</Link>
            </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-accent text-primary-foreground py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? "Signing in..." : "Sign In"}
            {!isLoading && <ArrowRight size={18} />}
          </button>


        </form>

          {/* Links */}
          <div className="mt-6 text-center text-sm">
            <span className="text-foreground">New to Flamnora?{" "}</span>
            <Link
              href="/signup"
              className="text-primary hover:text-accent font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Developer Credit - Below the Login Card */}
      <div className="mt-4 text-center">
        <p className="inline-block bg-muted/80 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium text-foreground/80 shadow-md border border-border">
          Developed by <span className="font-semibold text-primary">ArshXCoder</span>
        </p>
      </div>
    </div>
  )
}
