import { NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "@/lib/dbConnect"

const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
})
const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema)

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email, code } = await req.json()
    if (!email || !code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const otpDoc = await Otp.findOne({ email, code })
    if (!otpDoc || !otpDoc.expiresAt || otpDoc.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("verify-otp error", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}






