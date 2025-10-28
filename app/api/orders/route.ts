import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/dbConnect"
import Order from "@/models/Order"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const email = searchParams.get("email")

    if (!userId && !email) {
      return NextResponse.json({
        success: false,
        error: "User ID or email required"
      }, { status: 400 })
    }

    // Connect to MongoDB
    await connectDB()

    // Build query
    const query: any = {}
    if (userId) {
      query["user.userId"] = userId
    }
    if (email) {
      query["user.email"] = email
    }

    // Fetch orders from MongoDB
    const orders = await Order.find(query).sort({ createdAt: -1 })

    console.log("[Orders API] Fetched orders:", orders.length)

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        id: order._id,
        orderId: `ORD-${String(order._id).substring(18)}`.toUpperCase(),
        user: order.user,
        products: order.products,
        payment: order.payment,
        orderDate: order.orderDate,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      totalOrders: orders.length,
      totalSpent: orders
        .filter(o => o.payment.status === "Paid")
        .reduce((sum, o) => sum + (o.payment.amount || 0), 0),
    })
  } catch (error) {
    console.error("[Orders API] Error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch orders",
    }, { status: 500 })
  }
}




