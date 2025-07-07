import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Mock balance data - in production, fetch from database
    const balance = {
      balance: 150000, // ₹1,50,000
      currency: "INR",
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(balance)
  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}
