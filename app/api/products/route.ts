import { NextResponse } from "next/server"
import connectDB from "@/lib/dbConnect"
import Product from "@/models/Product"

// Get all products
export async function GET() {
  try {
    await connectDB()
    const products = await Product.find({})
    return NextResponse.json({ success: true, products, count: products.length })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, products: [] }, { status: 500 })
  }
}

// Create a new product
export async function POST(request: Request) {
  try {
    await connectDB()
    const product = await request.json()
    
    const newProduct = new Product(product)
    await newProduct.save()
    
    return NextResponse.json({ success: true, product: newProduct })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}







