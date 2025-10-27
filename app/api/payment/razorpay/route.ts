import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "INR", paymentMethod, items } = await request.json()

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("[v0] Razorpay credentials missing")
      return NextResponse.json({ error: "Razorpay credentials not configured" }, { status: 500 })
    }

    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    }

    const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64")

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Razorpay API error:", error)
      return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 })
    }

    const order = await response.json()

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKey: razorpayKeyId,
      paymentMethod,
      items,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Payment error:", error)
    return NextResponse.json({ error: "Payment creation failed" }, { status: 500 })
  }
}
