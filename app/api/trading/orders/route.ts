import { type NextRequest, NextResponse } from "next/server"

// Mock orders storage (in production, use a proper database)
const mockOrders: any[] = []

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Validate order data
    if (!orderData.symbol || !orderData.quantity || !orderData.userId) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 })
    }

    // Create order object
    const order = {
      ...orderData,
      id: `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "PENDING",
      timestamp: Date.now(),
    }

    // Add to mock storage
    mockOrders.push(order)

    // Simulate order processing
    setTimeout(() => {
      // Update order status to FILLED (in production, this would be based on market conditions)
      const updatedOrder = { ...order, status: Math.random() > 0.1 ? "FILLED" : "REJECTED" }
      const index = mockOrders.findIndex((o) => o.id === order.id)
      if (index !== -1) {
        mockOrders[index] = updatedOrder
      }
    }, 2000)

    return NextResponse.json(order)
  } catch (error) {
    console.error("Order Placement Error:", error)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Filter orders by userId and sort by timestamp
    const userOrders = mockOrders.filter((order) => order.userId === userId).sort((a, b) => b.timestamp - a.timestamp)

    return NextResponse.json(userOrders)
  } catch (error) {
    console.error("Fetch Orders Error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
