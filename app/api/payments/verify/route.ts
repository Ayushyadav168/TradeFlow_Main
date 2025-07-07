import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false, error: "Missing payment details" }, { status: 400 })
    }

    // Create signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "s8cKPbTGISIrraI5ywf37IRk")
      .update(body.toString())
      .digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // Payment is verified
      console.log("Payment verified successfully:", {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        timestamp: new Date().toISOString(),
      })

      // In production, update database with payment status
      // await updateAccountBalance(userId, amount)
      // await saveTransaction(transactionData)

      return NextResponse.json({
        verified: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      })
    } else {
      console.log("Payment verification failed:", {
        expected: expectedSignature,
        received: razorpay_signature,
        order_id: razorpay_order_id,
      })

      return NextResponse.json(
        {
          verified: false,
          error: "Invalid payment signature",
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      {
        verified: false,
        error: "Payment verification failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
