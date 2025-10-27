import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import crypto from "crypto"
import connectDB from "@/lib/dbConnect"
import Order from "@/models/Order"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user, products, paymentMethod, amount } = await request.json()

    // Get credentials from environment variables or use hardcoded for now
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_live_RWwE9IXDuqHtwi"
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "0lwCQnTaQWEYa8F0Gym4lC09"

    console.log("[Razorpay] Verifying payment:", {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    })

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })

    // Verify signature using crypto
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto.createHmac("sha256", razorpayKeySecret).update(body).digest("hex")

    console.log("[Razorpay] Signature verification:", {
      expected: expectedSignature,
      received: razorpay_signature,
      isValid: expectedSignature === razorpay_signature
    })

    const isSignatureValid = expectedSignature === razorpay_signature

    if (isSignatureValid) {
      // Fetch payment details from Razorpay
      try {
        const payment = await razorpay.payments.fetch(razorpay_payment_id)
        
        console.log("[Razorpay] Payment verified successfully:", {
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
        })

        // Save order to MongoDB
        try {
          await connectDB()
          
          const newOrder = new Order({
            user: user || { name: "Guest", email: "guest@example.com" },
            products: products || [],
            payment: {
              method: paymentMethod || payment.method || "unknown",
              status: "Paid",
              amount: amount || payment.amount,
              paymentId: razorpay_payment_id,
            },
          })

          await newOrder.save()
          console.log("[Order] Order saved successfully:", newOrder._id)
        } catch (orderError) {
          console.error("[Order] Error saving order:", orderError)
          // Continue even if order save fails
        }

        return NextResponse.json({
          success: true,
          message: "Payment verified successfully",
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          payment: {
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            created_at: payment.created_at,
          },
          timestamp: new Date().toISOString(),
        })
      } catch (fetchError) {
        console.error("[Razorpay] Error fetching payment details:", fetchError)
        
        // Still save order if signature is valid
        try {
          await connectDB()
          const newOrder = new Order({
            user: user || { name: "Guest", email: "guest@example.com" },
            products: products || [],
            payment: {
              method: paymentMethod || "unknown",
              status: "Paid",
              amount: amount || 0,
              paymentId: razorpay_payment_id,
            },
          })
          await newOrder.save()
          console.log("[Order] Order saved (without fetch):", newOrder._id)
        } catch (orderError) {
          console.error("[Order] Error saving order:", orderError)
        }
        
        return NextResponse.json({
          success: true,
          message: "Payment verified successfully (signature valid)",
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          timestamp: new Date().toISOString(),
        })
      }
    } else {
      console.error("[Razorpay] Invalid payment signature")
      return NextResponse.json({ 
        success: false, 
        message: "Invalid payment signature",
        error: "Signature verification failed"
      }, { status: 400 })
    }
  } catch (error) {
    console.error("[Razorpay] Payment verification error:", error)
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: "Payment verification failed"
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: false, 
      error: "Payment verification failed",
      details: "Unknown error occurred"
    }, { status: 500 })
  }
}
