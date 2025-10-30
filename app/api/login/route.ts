import connectDB from "@/lib/dbConnect";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Import the User model
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB(); // ✅ Connect to MongoDB

    const { email, password } = await req.json();

    // Check if all fields exist
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || "flamnora_secret_key_change_in_production",
      { expiresIn: "7d" }
    );

    // Return user data (without password)
    return NextResponse.json({ 
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || ''
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server error, please try again." }, { status: 500 });
  }
}

