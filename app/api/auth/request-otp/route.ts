import { NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "@/lib/dbConnect"
// Note: We dynamically import 'resend' only if RESEND_API_KEY is set to avoid build-time dependency errors.

// Basic User model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
})
const User = mongoose.models.User || mongoose.model("User", userSchema)

// OTP model with TTL index (10 minutes)
const otpSchema = new mongoose.Schema(
  {
    email: { type: String, index: true },
    code: String,
    expiresAt: Date,
  },
  { timestamps: true }
)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema)

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal user existence; still respond success
      return NextResponse.json({ success: true })
    }

    // Generate 6-digit OTP
    const code = ("" + Math.floor(100000 + Math.random() * 900000))
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Upsert OTP
    await Otp.findOneAndUpdate(
      { email },
      { email, code, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    // Send email via Resend if configured
    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || "no-reply@flamnora.app"
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(resendApiKey)
        await resend.emails.send({
          from: `Flamnora <${fromEmail}>`,
          to: [email],
          subject: "Your Flamnora password reset code",
          html: `<p>Your one-time code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes. If you did not request this, please ignore.</p>`,
        })
      } catch (e) {
        console.error("Email provider error (Resend)", e)
      }
    } else {
      // Fallback: log for dev
      console.log("OTP for", email, "=", code)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("request-otp error", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


