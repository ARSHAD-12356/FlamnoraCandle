import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/dbConnect"
import Order from "@/models/Order"

export async function POST(request: NextRequest) {
  try {
    const { user, products, paymentMethod, amount } = await request.json()

    // Connect to MongoDB
    await connectDB()

    // Create new COD order
    const newOrder = new Order({
      user: user || { name: "Guest", email: "guest@example.com" },
      products: products || [],
      payment: {
        method: paymentMethod || "cod",
        status: "Pending",
        amount: amount || 0,
        paymentId: null, // No payment ID for COD
      },
    })

    await newOrder.save()

    console.log("[Order] COD Order saved successfully:", newOrder._id)

    return NextResponse.json({
      success: true,
      message: "COD order saved successfully",
      orderId: newOrder._id,
      order: newOrder,
    })
  } catch (error) {
    console.error("[Order] Error saving COD order:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to save COD order",
    }, { status: 500 })
  }
}




