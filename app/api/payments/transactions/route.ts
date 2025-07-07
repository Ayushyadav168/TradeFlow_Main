import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Mock transaction data - in production, fetch from database
    const transactions = [
      {
        id: "txn_001",
        orderId: "order_001",
        paymentId: "pay_001",
        amount: 10000,
        currency: "INR",
        status: "SUCCESS",
        method: "UPI",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        userId,
        receipt: `topup_${userId}_${Date.now() - 86400000}`,
      },
      {
        id: "txn_002",
        orderId: "order_002",
        paymentId: "pay_002",
        amount: 25000,
        currency: "INR",
        status: "SUCCESS",
        method: "NETBANKING",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        userId,
        receipt: `topup_${userId}_${Date.now() - 172800000}`,
      },
      {
        id: "txn_003",
        orderId: "order_003",
        amount: 5000,
        currency: "INR",
        status: "FAILED",
        method: "CARD",
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        userId,
        receipt: `topup_${userId}_${Date.now() - 259200000}`,
      },
    ]

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
