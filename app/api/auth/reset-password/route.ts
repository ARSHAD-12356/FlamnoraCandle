import { NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "@/lib/dbConnect"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
})
const User = mongoose.models.User || mongoose.model("User", userSchema)

const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
})
const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema)

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email, code, newPassword } = await req.json()
    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const otpDoc = await Otp.findOne({ email, code })
    if (!otpDoc || !otpDoc.expiresAt || otpDoc.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    user.password = hashed
    await user.save()

    // Invalidate OTP after use
    await Otp.deleteOne({ _id: otpDoc._id })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("reset-password error", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}






