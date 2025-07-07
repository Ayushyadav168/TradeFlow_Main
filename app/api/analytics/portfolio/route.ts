import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const period = searchParams.get("period") || "1M"

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Mock comprehensive portfolio analytics
    const analytics = {
      performance: {
        totalReturn: 35000,
        totalReturnPercent: 7.78,
        dayReturn: 2500,
        dayReturnPercent: 0.52,
        weekReturn: 8500,
        weekReturnPercent: 1.85,
        monthReturn: 15000,
        monthReturnPercent: 3.26,
        yearReturn: 45000,
        yearReturnPercent: 10.12,
      },
      riskMetrics: {
        sharpeRatio: 1.45,
        beta: 1.12,
        alpha: 2.3,
        volatility: 18.5,
        maxDrawdown: -8.2,
        var95: -12500, // Value at Risk 95%
      },
      allocation: {
        sectors: [
          { name: "Technology", value: 35, amount: 175000 },
          { name: "Banking", value: 25, amount: 125000 },
          { name: "Energy", value: 20, amount: 100000 },
          { name: "Healthcare", value: 15, amount: 75000 },
          { name: "Others", value: 5, amount: 25000 },
        ],
        assetTypes: [
          { name: "Equity", value: 80, amount: 400000 },
          { name: "Derivatives", value: 15, amount: 75000 },
          { name: "Cash", value: 5, amount: 25000 },
        ],
      },
      topPerformers: [
        { symbol: "RELIANCE", return: 12.5, amount: 15000 },
        { symbol: "TCS", return: 8.3, amount: 8500 },
        { symbol: "INFY", return: 6.7, amount: 5200 },
      ],
      topLosers: [
        { symbol: "HDFCBANK", return: -3.2, amount: -2800 },
        { symbol: "ICICIBANK", return: -1.8, amount: -1200 },
      ],
      tradingActivity: {
        totalTrades: 45,
        winRate: 68.9,
        avgWin: 3500,
        avgLoss: -1800,
        profitFactor: 1.95,
        largestWin: 12500,
        largestLoss: -5200,
      },
      monthlyReturns: generateMonthlyReturns(),
      dailyPnL: generateDailyPnL(30),
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics Error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

function generateMonthlyReturns() {
  const months = []
  const currentDate = new Date()

  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    months.push({
      month: date.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      return: (Math.random() - 0.3) * 15, // -4.5% to 10.5%
      value: 450000 + (Math.random() - 0.5) * 100000,
    })
  }

  return months
}

function generateDailyPnL(days: number) {
  const data = []
  const currentDate = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      pnl: (Math.random() - 0.4) * 10000, // Slightly positive bias
      cumulative: 35000 + (Math.random() - 0.5) * 5000,
    })
  }

  return data
}
