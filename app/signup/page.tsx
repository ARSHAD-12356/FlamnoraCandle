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
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

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
      <div className="min-h-screen bg-[#1a0f0f] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-5xl font-bold text-[#FFB4A2] mb-2">
              Flamnora <span className="text-[#FFE8D6]">✨</span>
            </h1>
            <p className="text-[#B8B8FF] text-lg font-medium">Join our community of candle lovers</p>
            <p className="text-sm text-[#FFE8D6]/80 italic mt-2">Developed by ArshXCoder</p>
          </div>

          {/* Card */}
            <div className="bg-black/20 backdrop-blur-xl border border-[#FFB4A2]/20 rounded-2xl shadow-2xl p-8">
            <h2 className="font-serif text-3xl font-bold text-center mb-2 text-[#FFB4A2]">Create Account</h2>
            <p className="text-center text-[#B8B8FF] mb-8 text-lg">Start your journey with Flamnora</p>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#FFE8D6] mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-[#FFB4A2]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB4A2] focus:border-transparent bg-black/20 text-[#FFE8D6] placeholder:text-[#FFE8D6]/50 transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#FFE8D6] mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#FFB4A2]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB4A2] focus:border-transparent bg-black/20 text-[#FFE8D6] placeholder:text-[#FFE8D6]/50 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#FFE8D6] mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#FFB4A2]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB4A2] focus:border-transparent bg-black/20 text-[#FFE8D6] placeholder:text-[#FFE8D6]/50 transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#FFE8D6] mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#FFB4A2]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB4A2] focus:border-transparent bg-[#1A1B26]/60 text-[#FFE8D6] placeholder:text-[#FFE8D6]/50 transition-all"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FFB4A2] hover:bg-[#FFE8D6] text-[#1A1B26] py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg text-lg"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-[#B8B8FF]">Already have an account?</span>
              <Link
                href="/login"
                className="text-[#FFB4A2] hover:text-[#FFE8D6] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[#B8B8FF]/80 text-sm mt-6">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-[#FFB4A2] hover:text-[#FFE8D6] hover:underline">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
