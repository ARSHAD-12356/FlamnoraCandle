import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "INR", paymentMethod, items } = await request.json()

    // Get credentials from environment variables or use hardcoded for now
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_live_RWwE9IXDuqHtwi"
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "0lwCQnTaQWEYa8F0Gym4lC09"

    console.log("[Razorpay] Using credentials:", {
      hasKeyId: !!razorpayKeyId,
      hasKeySecret: !!razorpayKeySecret,
      keyIdPrefix: razorpayKeyId ? razorpayKeyId.substring(0, 8) + "..." : "Not found"
    })

    console.log("[Razorpay] Creating order for amount:", amount, "with key:", razorpayKeyId.substring(0, 8) + "...")

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })

    // Create order data
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      payment_capture: 1,
      notes: {
        payment_method: paymentMethod,
        items: JSON.stringify(items),
        timestamp: new Date().toISOString(),
      },
    }

    console.log("[Razorpay] Order data:", orderData)

    // Create order using Razorpay SDK
    const order = await razorpay.orders.create(orderData)

    console.log("[Razorpay] Order created successfully:", {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at,
      },
      razorpayKey: razorpayKeyId,
      paymentMethod,
      items,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error("[Razorpay] Order creation failed:", error)
    
    // Handle specific Razorpay errors
    if (error instanceof Error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: "Order creation failed"
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: false, 
      error: "Payment order creation failed",
      details: "Unknown error occurred"
    }, { status: 500 })
  }
}
