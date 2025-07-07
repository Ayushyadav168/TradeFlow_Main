"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { tradingService, type Portfolio as PortfolioType } from "@/lib/trading"
import { useAuth } from "@/components/auth-provider"
import { TrendingUp, TrendingDown, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

export function Portfolio() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return

      try {
        const data = await tradingService.getPortfolio(user.uid)
        setPortfolio(data)
      } catch (error) {
        console.error("Error fetching portfolio:", error)
        // Mock data for demo
        setPortfolio({
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
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [user])

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading portfolio...</div>
        </CardContent>
      </Card>
    )
  }

  if (!portfolio) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">No portfolio data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
          <PieChart className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Portfolio</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 sm:space-y-4">
        {/* Portfolio Summary - Responsive Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm text-muted-foreground">Total Value</div>
            <div className="text-lg sm:text-xl font-bold">₹{portfolio.totalValue.toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs sm:text-sm text-muted-foreground">Available Cash</div>
            <div className="text-lg sm:text-xl font-bold">₹{portfolio.cash.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm text-muted-foreground">Total P&L</div>
            <div
              className={cn(
                "text-base sm:text-lg font-bold flex items-center space-x-1",
                portfolio.totalPnL >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {portfolio.totalPnL >= 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span>₹{Math.abs(portfolio.totalPnL).toLocaleString()}</span>
            </div>
            <div className={cn("text-xs", portfolio.totalPnL >= 0 ? "text-green-600" : "text-red-600")}>
              ({portfolio.totalPnLPercent >= 0 ? "+" : ""}
              {portfolio.totalPnLPercent.toFixed(2)}%)
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs sm:text-sm text-muted-foreground">Day P&L</div>
            <div
              className={cn(
                "text-base sm:text-lg font-bold flex items-center space-x-1",
                portfolio.dayPnL >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {portfolio.dayPnL >= 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span>₹{Math.abs(portfolio.dayPnL).toLocaleString()}</span>
            </div>
            <div className={cn("text-xs", portfolio.dayPnL >= 0 ? "text-green-600" : "text-red-600")}>
              ({portfolio.dayPnLPercent >= 0 ? "+" : ""}
              {portfolio.dayPnLPercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Positions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Holdings</h4>
          <ScrollArea className="flex-1 max-h-64">
            <div className="space-y-2">
              {portfolio.positions.map((position) => (
                <div key={position.symbol} className="p-2 sm:p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{position.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {position.quantity} shares @ ₹{position.averagePrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">₹{position.marketValue.toLocaleString()}</div>
                      <div
                        className={cn(
                          "text-xs flex items-center space-x-1",
                          position.pnl >= 0 ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {position.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>
                          ₹{Math.abs(position.pnl).toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Current: ₹{position.currentPrice.toFixed(2)}</span>
                      <span>Avg: ₹{position.averagePrice.toFixed(2)}</span>
                    </div>
                    <Progress
                      value={Math.abs(position.pnlPercent)}
                      className={cn("h-1", position.pnl >= 0 ? "text-green-600" : "text-red-600")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
