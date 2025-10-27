import { NextResponse } from "next/server"
import connectDB from "@/lib/dbConnect"
import Product from "@/models/Product"

// Seed data for products
const productsData = [
  // Premium Candles
  {
    name: "Red Heart Candle",
    container: "Glass Jar",
    burnTime: "90 hrs",
    waxType: "Soy Wax",
    weight: "400g",
    price: "₹500",
    image: "/red-heart-candle-in-glass-jar.jpg",
    description: "A stunning red heart-shaped candle that brings warmth and romance to any space. Made with premium soy wax and infused with a delicate floral fragrance.",
    category: "premium",
  },
  {
    name: "Ice Ocean Breeze Candle",
    container: "Glass Jar",
    burnTime: "80 hrs",
    waxType: "Soy Wax + Gel Wax",
    weight: "420g",
    price: "₹500",
    image: "/blue-ocean-breeze-candle-luxury.jpg",
    description: "Escape to a coastal paradise with our Ocean Breeze candle. The refreshing scent of sea salt and ocean air creates a calming atmosphere.",
    category: "premium",
  },
  {
    name: "Ice Coffee Latte Candle",
    container: "Lined Glass Jar",
    burnTime: "85–90 hrs",
    waxType: "Soy Wax + Gel Wax",
    weight: "420g",
    price: "₹500",
    image: "/coffee-latte-scented-candle-luxury.jpg",
    description: "Indulge in the rich aroma of freshly brewed coffee and creamy latte. Perfect for coffee lovers who want to bring café vibes to their home.",
    category: "premium",
  },
  {
    name: "Big Bubble Candle",
    container: "Glass",
    burnTime: "3–4 hrs",
    waxType: "Soy Wax",
    weight: "138g",
    price: "₹100",
    image: "/bubble-candle-handcrafted.jpg",
    description: "Our signature Big Bubble Candle features a unique bubble design that creates a mesmerizing visual effect as it burns. Perfect for decorative purposes.",
    category: "local",
  },
  {
    name: "Small Bubble Candle",
    container: "Glass",
    burnTime: "1–2 hrs",
    waxType: "Soy Wax",
    weight: "80g",
    price: "₹1",
    image: "/small-bubble-candle-craft.jpg",
    description: "Compact and charming, our Small Bubble Candle is ideal for gifting or creating a cozy corner. Handcrafted with love and attention to detail.",
    category: "local",
  },
]

export async function GET() {
  try {
    await connectDB()

    // Check if products already exist
    const existingProducts = await Product.countDocuments()

    if (existingProducts > 0) {
      return NextResponse.json({
        success: true,
        message: "Products already exist",
        count: existingProducts,
      })
    }

    // Seed products
    const products = await Product.insertMany(productsData)

    return NextResponse.json({
      success: true,
      message: "Products seeded successfully",
      count: products.length,
    })
  } catch (error) {
    console.error("Error seeding products:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed products",
      },
      { status: 500 }
    )
  }
}

