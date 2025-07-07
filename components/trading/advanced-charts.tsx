"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { marketDataService } from "@/lib/market-data"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  ComposedChart,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, Volume2, Layers } from "lucide-react"

interface AdvancedChartsProps {
  symbol: string
}

export function AdvancedCharts({ symbol }: AdvancedChartsProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState("1D")
  const [chartType, setChartType] = useState<"line" | "area" | "candlestick" | "volume">("area")
  const [indicators, setIndicators] = useState<string[]>(["SMA", "RSI"])
  const [loading, setLoading] = useState(true)
  const [stockInfo, setStockInfo] = useState<any>(null)

  const timeframes = ["1D", "5D", "1M", "3M", "6M", "1Y", "5Y"]
  const availableIndicators = ["SMA", "EMA", "RSI", "MACD", "Bollinger Bands", "Volume"]

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true)
      try {
        const data = await marketDataService.getHistoricalData(symbol, timeframe)
        const stockData = await marketDataService.getNSEStockData(symbol)

        // Generate comprehensive mock data with technical indicators
        const mockData = generateAdvancedChartData(timeframe)
        setChartData(mockData)

        setStockInfo({
          symbol,
          name: getStockName(symbol),
          price: 2456.75,
          change: 23.45,
          changePercent: 0.96,
          high: 2478.9,
          low: 2445.2,
          volume: 1234567,
          marketCap: 16500000000000,
          pe: 24.5,
          eps: 98.5,
          bookValue: 1245.8,
          dividendYield: 0.35,
          beta: 1.2,
        })
      } catch (error) {
        console.error("Error fetching chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [symbol, timeframe])

  const generateAdvancedChartData = (period: string) => {
    const dataPoints = period === "1D" ? 78 : period === "5D" ? 390 : period === "1M" ? 30 : 100
    const basePrice = 2456.75
    const data = []

    for (let i = 0; i < dataPoints; i++) {
      const time = new Date()
      if (period === "1D") {
        time.setHours(9, 15 + i * 5, 0, 0)
      } else {
        time.setDate(time.getDate() - (dataPoints - i))
      }

      const randomChange = (Math.random() - 0.5) * 20
      const price = basePrice + randomChange + Math.sin(i / 10) * 10
      const volume = Math.floor(Math.random() * 200000) + 50000

      // Calculate technical indicators
      const sma = calculateSMA(data, price, 20)
      const ema = calculateEMA(data, price, 20)
      const rsi = calculateRSI(data, price, 14)

      data.push({
        time: time.getTime(),
        price: price,
        volume: volume,
        high: price + Math.random() * 5,
        low: price - Math.random() * 5,
        open: price + (Math.random() - 0.5) * 3,
        close: price,
        sma: sma,
        ema: ema,
        rsi: rsi,
        macd: Math.sin(i / 12) * 5,
        signal: Math.sin(i / 15) * 4,
        histogram: Math.sin(i / 12) * 5 - Math.sin(i / 15) * 4,
        upperBB: price + 20,
        lowerBB: price - 20,
        middleBB: price,
      })
    }

    return data
  }

  const calculateSMA = (data: any[], currentPrice: number, period: number) => {
    if (data.length < period - 1) return currentPrice
    const prices = data.slice(-period + 1).map((d) => d.price)
    prices.push(currentPrice)
    return prices.reduce((sum, price) => sum + price, 0) / prices.length
  }

  const calculateEMA = (data: any[], currentPrice: number, period: number) => {
    if (data.length === 0) return currentPrice
    const multiplier = 2 / (period + 1)
    const previousEMA = data[data.length - 1]?.ema || currentPrice
    return (currentPrice - previousEMA) * multiplier + previousEMA
  }

  const calculateRSI = (data: any[], currentPrice: number, period: number) => {
    if (data.length < period) return 50
    const prices = data.slice(-period).map((d) => d.price)
    prices.push(currentPrice)

    let gains = 0,
      losses = 0
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1]
      if (change > 0) gains += change
      else losses -= change
    }

    const avgGain = gains / period
    const avgLoss = losses / period
    const rs = avgGain / avgLoss
    return 100 - 100 / (1 + rs)
  }

  const getStockName = (symbol: string) => {
    const names: { [key: string]: string } = {
      RELIANCE: "Reliance Industries Ltd",
      TCS: "Tata Consultancy Services",
      INFY: "Infosys Limited",
      HDFCBANK: "HDFC Bank Limited",
      ICICIBANK: "ICICI Bank Limited",
    }
    return names[symbol] || symbol
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    if (timeframe === "1D") {
      return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
  }

  const toggleIndicator = (indicator: string) => {
    setIndicators((prev) => (prev.includes(indicator) ? prev.filter((i) => i !== indicator) : [...prev, indicator]))
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading advanced charts...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{stockInfo?.symbol}</CardTitle>
            <p className="text-sm text-muted-foreground">{stockInfo?.name}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">₹{stockInfo?.price.toFixed(2)}</div>
            <div className="flex items-center space-x-1">
              {stockInfo?.change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${stockInfo?.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stockInfo?.change >= 0 ? "+" : ""}
                {stockInfo?.change.toFixed(2)} ({stockInfo?.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>

          <div className="flex space-x-1">
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
            >
              <Activity className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === "area" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("area")}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === "volume" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("volume")}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="flex flex-wrap gap-2">
          {availableIndicators.map((indicator) => (
            <Badge
              key={indicator}
              variant={indicators.includes(indicator) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleIndicator(indicator)}
            >
              {indicator}
            </Badge>
          ))}
        </div>

        {/* Stock Info */}
        <div className="grid grid-cols-6 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">High: </span>
            <span className="font-medium">₹{stockInfo?.high.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Low: </span>
            <span className="font-medium">₹{stockInfo?.low.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Volume: </span>
            <span className="font-medium">{(stockInfo?.volume / 1000000).toFixed(2)}M</span>
          </div>
          <div>
            <span className="text-muted-foreground">P/E: </span>
            <span className="font-medium">{stockInfo?.pe}</span>
          </div>
          <div>
            <span className="text-muted-foreground">EPS: </span>
            <span className="font-medium">₹{stockInfo?.eps}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Beta: </span>
            <span className="font-medium">{stockInfo?.beta}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "volume" ? (
              <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tickFormatter={formatTime} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  yAxisId="price"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `₹${value.toFixed(0)}`}
                />
                <YAxis
                  yAxisId="volume"
                  orientation="left"
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium">{formatTime(label)}</p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-medium">
                              ₹{payload.find((p) => p.dataKey === "price")?.value?.toFixed(2)}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Volume: </span>
                            <span className="font-medium">
                              {payload.find((p) => p.dataKey === "volume")?.value?.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar yAxisId="volume" dataKey="volume" fill="hsl(var(--muted))" opacity={0.3} />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                {indicators.includes("SMA") && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="sma"
                    stroke="#ff7300"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                )}
                {indicators.includes("EMA") && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="ema"
                    stroke="#00ff00"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="3 3"
                  />
                )}
              </ComposedChart>
            ) : chartType === "area" ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tickFormatter={formatTime} stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `₹${value.toFixed(0)}`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium">{formatTime(label)}</p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-medium">₹{payload[0].value?.toFixed(2)}</span>
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                {indicators.includes("SMA") && (
                  <Line
                    type="monotone"
                    dataKey="sma"
                    stroke="#ff7300"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                )}
                {indicators.includes("EMA") && (
                  <Line
                    type="monotone"
                    dataKey="ema"
                    stroke="#00ff00"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="3 3"
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tickFormatter={formatTime} stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `₹${value.toFixed(0)}`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium">{formatTime(label)}</p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-medium">₹{payload[0].value?.toFixed(2)}</span>
                          </p>
                          {indicators.includes("RSI") && payload.find((p) => p.dataKey === "rsi") && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">RSI: </span>
                              <span className="font-medium">
                                {payload.find((p) => p.dataKey === "rsi")?.value?.toFixed(2)}
                              </span>
                            </p>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
                {indicators.includes("SMA") && (
                  <Line
                    type="monotone"
                    dataKey="sma"
                    stroke="#ff7300"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                )}
                {indicators.includes("EMA") && (
                  <Line
                    type="monotone"
                    dataKey="ema"
                    stroke="#00ff00"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="3 3"
                  />
                )}
                {indicators.includes("Bollinger Bands") && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="upperBB"
                      stroke="#ff0000"
                      strokeWidth={1}
                      dot={false}
                      strokeDasharray="2 2"
                    />
                    <Line
                      type="monotone"
                      dataKey="lowerBB"
                      stroke="#ff0000"
                      strokeWidth={1}
                      dot={false}
                      strokeDasharray="2 2"
                    />
                    <Line type="monotone" dataKey="middleBB" stroke="#ff0000" strokeWidth={1} dot={false} />
                  </>
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
