// Trading Service for Portfolio Management
export interface Position {
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
  marketValue: number
}

export interface Portfolio {
  totalValue: number
  totalPnL: number
  totalPnLPercent: number
  dayPnL: number
  dayPnLPercent: number
  cash: number
  marginUsed: number
  marginAvailable: number
  positions: Position[]
}

export interface Order {
  id: string
  symbol: string
  type: "BUY" | "SELL"
  orderType: "MARKET" | "LIMIT" | "STOP_LOSS"
  quantity: number
  price: number
  status: "PENDING" | "EXECUTED" | "CANCELLED" | "REJECTED"
  timestamp: Date
  userId: string
}

class TradingService {
  async getPortfolio(userId: string): Promise<Portfolio> {
    try {
      // In production, this would fetch from Firebase/database
      // For now, return mock data
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

      return {
        totalValue: 485000,
        totalPnL: 35000,
        totalPnLPercent: 7.78,
        dayPnL: 2500,
        dayPnLPercent: 0.52,
        cash: 150000,
        marginUsed: 25000,
        marginAvailable: 125000,
        positions: [
          {
            symbol: "RELIANCE",
            quantity: 50,
            averagePrice: 2400.0,
            currentPrice: 2456.75,
            pnl: 2837.5,
            pnlPercent: 2.37,
            marketValue: 122837.5,
          },
          {
            symbol: "TCS",
            quantity: 30,
            averagePrice: 3700.0,
            currentPrice: 3678.9,
            pnl: -633.0,
            pnlPercent: -0.57,
            marketValue: 110367.0,
          },
          {
            symbol: "INFY",
            quantity: 75,
            averagePrice: 1420.0,
            currentPrice: 1456.25,
            pnl: 2718.75,
            pnlPercent: 2.55,
            marketValue: 109218.75,
          },
          {
            symbol: "HDFCBANK",
            quantity: 40,
            averagePrice: 1700.0,
            currentPrice: 1678.45,
            pnl: -862.0,
            pnlPercent: -1.27,
            marketValue: 67138.0,
          },
        ],
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error)
      throw error
    }
  }

  async placeOrder(order: Omit<Order, "id" | "timestamp" | "status">): Promise<Order> {
    try {
      const newOrder: Order = {
        ...order,
        id: Date.now().toString(),
        timestamp: new Date(),
        status: "PENDING",
      }

      // In production, this would save to Firebase/database
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Simulate order processing
      setTimeout(() => {
        // Update order status to EXECUTED (in real app, this would be done via websocket)
        console.log(`Order ${newOrder.id} executed`)
      }, 2000)

      return newOrder
    } catch (error) {
      console.error("Error placing order:", error)
      throw error
    }
  }

  async getOrders(userId: string): Promise<Order[]> {
    try {
      // Mock orders data
      await new Promise((resolve) => setTimeout(resolve, 200))

      return [
        {
          id: "1",
          symbol: "RELIANCE",
          type: "BUY",
          orderType: "LIMIT",
          quantity: 10,
          price: 2450.0,
          status: "PENDING",
          timestamp: new Date(),
          userId,
        },
        {
          id: "2",
          symbol: "TCS",
          type: "SELL",
          orderType: "MARKET",
          quantity: 5,
          price: 3890.45,
          status: "EXECUTED",
          timestamp: new Date(Date.now() - 3600000),
          userId,
        },
        {
          id: "3",
          symbol: "INFY",
          type: "BUY",
          orderType: "LIMIT",
          quantity: 25,
          price: 1450.0,
          status: "CANCELLED",
          timestamp: new Date(Date.now() - 7200000),
          userId,
        },
      ]
    } catch (error) {
      console.error("Error fetching orders:", error)
      throw error
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      // In production, this would update the order in Firebase/database
      await new Promise((resolve) => setTimeout(resolve, 100))
      return true
    } catch (error) {
      console.error("Error cancelling order:", error)
      throw error
    }
  }

  async getPositions(userId: string): Promise<Position[]> {
    try {
      const portfolio = await this.getPortfolio(userId)
      return portfolio.positions
    } catch (error) {
      console.error("Error fetching positions:", error)
      throw error
    }
  }

  // Calculate portfolio metrics
  calculatePortfolioMetrics(positions: Position[]): {
    totalValue: number
    totalPnL: number
    totalPnLPercent: number
  } {
    const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0)
    const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0)
    const totalInvested = totalValue - totalPnL
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

    return {
      totalValue,
      totalPnL,
      totalPnLPercent,
    }
  }

  // Real-time price updates (mock implementation)
  subscribeToPortfolioUpdates(userId: string, callback: (portfolio: Portfolio) => void): () => void {
    const interval = setInterval(async () => {
      try {
        const portfolio = await this.getPortfolio(userId)
        // Simulate small price changes
        portfolio.positions = portfolio.positions.map((pos) => ({
          ...pos,
          currentPrice: pos.currentPrice + (Math.random() - 0.5) * 5,
          pnl: pos.pnl + (Math.random() - 0.5) * 100,
          pnlPercent: pos.pnlPercent + (Math.random() - 0.5) * 0.5,
        }))
        callback(portfolio)
      } catch (error) {
        console.error("Error in portfolio subscription:", error)
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }
}

export const tradingService = new TradingService()
