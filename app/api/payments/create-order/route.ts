import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_rpnNH3RrWqpT9U",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "s8cKPbTGISIrraI5ywf37IRk",
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt, userId } = await request.json()

    // Validate input
    if (!amount || !currency || !receipt || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount < 100) {
      // Minimum ₹1
      return NextResponse.json({ error: "Minimum amount is ₹1" }, { status: 400 })
    }

    if (amount > 20000000) {
      // Maximum ₹2,00,000
      return NextResponse.json({ error: "Maximum amount is ₹2,00,000" }, { status: 400 })
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency,
      receipt: receipt,
      payment_capture: 1,
      notes: {
        userId: userId,
        purpose: "Account Top-up",
        platform: "TradeMind AI",
      },
    })

    // In production, save order to database
    console.log("Order created:", order)

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      created_at: order.created_at,
    })
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      {
        error: "Failed to create payment order",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
