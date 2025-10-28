"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"

export default function ForgotAccountPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, call your recovery API here
    setSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
            <h1 className="font-serif text-3xl font-bold text-center mb-2 text-primary">Recover Account</h1>
            <p className="text-center text-muted-foreground mb-8">Enter your email to receive recovery instructions</p>

            {submitted ? (
              <div className="space-y-6 text-center">
                <p className="text-foreground">If an account exists for <span className="font-semibold">{email || "your email"}</span>, you'll receive an email with recovery steps.</p>
                <Link href="/login" className="text-primary hover:text-accent font-semibold">Back to Sign In</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all"
                    placeholder="you@example.com"
                    required
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-accent text-primary-foreground py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Send Recovery Email
                </button>
              </form>
            )}

            <p className="text-center text-foreground mt-6">
              Remembered your details?{" "}
              <Link href="/signup" className="text-primary hover:text-accent font-semibold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}





