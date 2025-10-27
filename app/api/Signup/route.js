import connectDB from "@/lib/dbConnect";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export async function POST(req) {
  try {
    console.log("Signup API called");
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
    
    await connectDB(); // ✅ Connect to MongoDB
    console.log("MongoDB connected successfully");

    const { name, email, password } = await req.json();
    console.log("Received data:", { name, email, password: "***" });

    // Check if all fields exist
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already registered" }, { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword 
    });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.email },
      process.env.JWT_SECRET || "flamnora_secret_key_change_in_production",
      { expiresIn: "7d" }
    );

    return NextResponse.json({ 
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Server error, please try again." }, { status: 500 });
  }
}
