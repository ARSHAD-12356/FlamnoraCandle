"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"

type Step = "email" | "otp" | "reset" | "done"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send OTP")
      setStep("otp")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const verifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp, newPassword }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Reset failed")
      setStep("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
            <h1 className="font-serif text-3xl font-bold text-center mb-2 text-primary">Forgot Password</h1>
            <p className="text-center text-muted-foreground mb-8">
              {step === "email" && "Enter your email to receive an OTP"}
              {step === "otp" && "Check your email for the 6-digit OTP"}
              {step === "reset" && "Enter a new password"}
              {step === "done" && "Password reset successful"}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            {step === "email" && (
              <form onSubmit={requestOtp} className="space-y-5" autoComplete="off">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all"
                    placeholder="you@example.com"
                    autoComplete="off"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-accent text-primary-foreground py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50">
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError("")
                  setLoading(true)
                  try {
                    const res = await fetch("/api/auth/verify-otp", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email, code: otp }),
                    })
                    const data = await res.json()
                    if (!res.ok || !data.success) throw new Error(data.error || "Invalid OTP")
                    setStep("reset")
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Invalid OTP")
                  } finally {
                    setLoading(false)
                  }
                }}
                className="space-y-5" autoComplete="off"
              >
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all tracking-widest text-center"
                    placeholder="Enter 6-digit OTP"
                    inputMode="numeric"
                    pattern="\\d{6}"
                    maxLength={6}
                    autoComplete="one-time-code"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-accent text-primary-foreground py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50">
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <p className="text-center text-muted-foreground text-sm">Didn’t receive? Check spam or <button type="button" onClick={(e)=>{e.preventDefault(); requestOtp(e as any)}} className="text-primary hover:text-accent font-semibold">resend</button></p>
              </form>
            )}

            {step === "reset" && (
              <form onSubmit={verifyAndReset} className="space-y-5" autoComplete="off">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-accent text-primary-foreground py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50">
                  {loading ? "Saving..." : "Reset Password"}
                </button>
              </form>
            )}

            {step === "done" && (
              <div className="space-y-6 text-center">
                <p className="text-foreground">Your password has been reset. You can now sign in.</p>
                <Link href="/login" className="text-primary hover:text-accent font-semibold">Go to Sign In</Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}


