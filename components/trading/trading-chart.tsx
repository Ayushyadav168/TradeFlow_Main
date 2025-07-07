"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"
import { marketDataService, type StockData } from "@/lib/market-data"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface TradingChartProps {
  symbol: string
}

export function TradingChart({ symbol }: TradingChartProps) {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "3M" | "1Y">("1D")
  const [chartType, setChartType] = useState<"line" | "area">("area")

  useEffect(() => {
    const fetchData = async () => {
      const data = await marketDataService.getNSEStockData(symbol)
      setStockData(data)

      // Generate sample chart data
      const generateChartData = () => {
        const data = []
        const basePrice = data ? data.price : 1000
        const points = timeframe === "1D" ? 24 : timeframe === "1W" ? 7 : 30

        for (let i = 0; i < points; i++) {
          const variation = (Math.random() - 0.5) * 50
          data.push({
            time: i,
            price: basePrice + variation,
            volume: Math.floor(Math.random() * 1000000),
          })
        }
        return data
      }

      setChartData(generateChartData())
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [symbol, timeframe])

  const timeframes = ["1D", "1W", "1M", "3M", "1Y"] as const

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <CardTitle>{symbol}</CardTitle>
            {stockData && (
              <Badge variant={stockData.change >= 0 ? "default" : "destructive"}>
                {stockData.change >= 0 ? "+" : ""}
                {stockData.changePercent.toFixed(2)}%
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>

        {stockData && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Current Price</div>
              <div className="font-bold">₹{stockData.price.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Day High</div>
              <div className="font-bold text-green-500">₹{stockData.high.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Day Low</div>
              <div className="font-bold text-red-500">₹{stockData.low.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="font-bold">{(stockData.volume / 1000000).toFixed(2)}M</div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center space-x-2 mt-4">
          <Button variant={chartType === "line" ? "default" : "ghost"} size="sm" onClick={() => setChartType("line")}>
            Line
          </Button>
          <Button variant={chartType === "area" ? "default" : "ghost"} size="sm" onClick={() => setChartType("area")}>
            Area
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
