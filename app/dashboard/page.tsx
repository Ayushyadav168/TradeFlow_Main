"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { TopBar } from "@/components/trading/top-bar"
import { MarketOverview } from "@/components/trading/market-overview"
import { Watchlist } from "@/components/trading/watchlist"
import { Portfolio } from "@/components/trading/portfolio"
import { AIAdvisory } from "@/components/trading/ai-advisory"
import { MarketNews } from "@/components/trading/market-news"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, Activity, Menu, TrendingUp, TrendingDown } from "lucide-react"

// Advanced Charts Component - Responsive
function AdvancedCharts({ symbol }: { symbol: string }) {
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick")
  const [timeframe, setTimeframe] = useState("1D")
  const [currentPrice, setCurrentPrice] = useState(2456.75)
  const [priceChange, setPriceChange] = useState(12.45)

  const timeframes = ["1m", "5m", "15m", "1h", "1D", "1W"]

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 10
      setCurrentPrice((prev) => prev + change)
      setPriceChange(change)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 space-y-2">
        {/* Mobile-first header layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <CardTitle className="text-lg sm:text-xl">{symbol}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold">₹{currentPrice.toLocaleString()}</span>
              <div className={`flex items-center gap-1 ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="text-xs sm:text-sm font-medium">
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Chart type toggle - responsive */}
          <div className="flex border rounded-md w-fit">
            <Button
              variant={chartType === "candlestick" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("candlestick")}
              className="text-xs sm:text-sm"
            >
              Candlestick
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("line")}
              className="text-xs sm:text-sm"
            >
              Line
            </Button>
          </div>
        </div>

        {/* Timeframe buttons - responsive grid */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1 sm:gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="text-xs sm:text-sm"
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-64 sm:h-80 lg:h-96">
        <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <BarChart3 className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm sm:text-base text-muted-foreground">
              {chartType === "candlestick" ? "Candlestick" : "Line"} Chart - {symbol} ({timeframe})
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Real-time chart data would be displayed here
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Options Chain Component - Responsive
function OptionsChain({ symbol, currentPrice }: { symbol: string; currentPrice: number }) {
  const [selectedExpiry, setSelectedExpiry] = useState("2024-01-25")
  const expiryDates = ["2024-01-25", "2024-02-01", "2024-02-08", "2024-02-15"]

  const generateOptionsData = () => {
    const strikes = []
    const baseStrike = Math.floor(currentPrice / 50) * 50

    for (let i = -5; i <= 5; i++) {
      const strike = baseStrike + i * 50
      strikes.push({
        strike,
        callOI: Math.floor(Math.random() * 10000),
        callVolume: Math.floor(Math.random() * 5000),
        callLTP: Math.max(0.05, currentPrice - strike + Math.random() * 20),
        putOI: Math.floor(Math.random() * 10000),
        putVolume: Math.floor(Math.random() * 5000),
        putLTP: Math.max(0.05, strike - currentPrice + Math.random() * 20),
      })
    }
    return strikes
  }

  const optionsData = generateOptionsData()

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg sm:text-xl">{symbol} Options Chain</CardTitle>
          <select
            value={selectedExpiry}
            onChange={(e) => setSelectedExpiry(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm w-full sm:w-auto"
          >
            {expiryDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="h-64 sm:h-80 lg:h-96 overflow-auto">
        {/* Mobile-optimized table */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-7 gap-2 text-xs font-medium mb-2 sticky top-0 bg-background">
            <div>Call OI</div>
            <div>Call Vol</div>
            <div>Call LTP</div>
            <div className="text-center font-bold">Strike</div>
            <div>Put LTP</div>
            <div>Put Vol</div>
            <div>Put OI</div>
          </div>
          {optionsData.map((option) => (
            <div
              key={option.strike}
              className={`grid grid-cols-7 gap-2 text-xs py-1 ${
                Math.abs(option.strike - currentPrice) < 25 ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
              }`}
            >
              <div className="text-blue-600">{option.callOI.toLocaleString()}</div>
              <div className="text-blue-600">{option.callVolume.toLocaleString()}</div>
              <div className="text-blue-600">₹{option.callLTP.toFixed(2)}</div>
              <div className="text-center font-bold">{option.strike}</div>
              <div className="text-red-600">₹{option.putLTP.toFixed(2)}</div>
              <div className="text-red-600">{option.putVolume.toLocaleString()}</div>
              <div className="text-red-600">{option.putOI.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Mobile card layout */}
        <div className="sm:hidden space-y-2">
          {optionsData.map((option) => (
            <Card
              key={option.strike}
              className={Math.abs(option.strike - currentPrice) < 25 ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}
            >
              <CardContent className="p-3">
                <div className="text-center font-bold text-lg mb-2">₹{option.strike}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">CALL</div>
                    <div className="text-xs">OI: {option.callOI.toLocaleString()}</div>
                    <div className="text-xs">Vol: {option.callVolume.toLocaleString()}</div>
                    <div className="text-sm font-medium text-blue-600">₹{option.callLTP.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">PUT</div>
                    <div className="text-xs">OI: {option.putOI.toLocaleString()}</div>
                    <div className="text-xs">Vol: {option.putVolume.toLocaleString()}</div>
                    <div className="text-sm font-medium text-red-600">₹{option.putLTP.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Order Panel Component - Responsive
function OrderPanel({ selectedStock }: { selectedStock: string }) {
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY")
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(2456.75)
  const [orderMode, setOrderMode] = useState<"MARKET" | "LIMIT">("MARKET")

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl">Place Order</CardTitle>
        <div className="text-sm text-muted-foreground">{selectedStock}</div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Buy/Sell toggle - full width on mobile */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={orderType === "BUY" ? "default" : "outline"}
            className={orderType === "BUY" ? "bg-green-600 hover:bg-green-700" : ""}
            onClick={() => setOrderType("BUY")}
          >
            BUY
          </Button>
          <Button
            variant={orderType === "SELL" ? "default" : "outline"}
            className={orderType === "SELL" ? "bg-red-600 hover:bg-red-700" : ""}
            onClick={() => setOrderType("SELL")}
          >
            SELL
          </Button>
        </div>

        {/* Market/Limit toggle */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={orderMode === "MARKET" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrderMode("MARKET")}
          >
            Market
          </Button>
          <Button
            variant={orderMode === "LIMIT" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrderMode("LIMIT")}
          >
            Limit
          </Button>
        </div>

        {/* Form inputs - responsive */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-sm"
              min="1"
            />
          </div>

          {orderMode === "LIMIT" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md text-sm"
                step="0.05"
              />
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Total Value:</span>
            <span className="font-bold">₹{(quantity * price).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Available Balance:</span>
            <span className="text-green-600">₹1,25,000</span>
          </div>
        </div>

        {/* Place order button */}
        <Button
          className={`w-full ${
            orderType === "BUY" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Place {orderType} Order
        </Button>
      </CardContent>
    </Card>
  )
}

// Risk Management Component - Responsive
function RiskManagement({ symbol, currentPrice }: { symbol: string; currentPrice: number }) {
  const [stopLoss, setStopLoss] = useState(currentPrice * 0.95)
  const [target, setTarget] = useState(currentPrice * 1.05)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl">Risk Management</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Stop Loss</label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-sm"
              step="0.05"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Target</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-sm"
              step="0.05"
            />
          </div>
        </div>

        {/* Risk metrics */}
        <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Risk:</span>
            <span className="text-red-600">₹{((currentPrice - stopLoss) * 1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Reward:</span>
            <span className="text-green-600">₹{((target - currentPrice) * 1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>Risk:Reward</span>
            <span>1:{((target - currentPrice) / (currentPrice - stopLoss)).toFixed(2)}</span>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">Risk Score</span>
          </div>
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Medium Risk
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// Mobile Sidebar Component
function MobileSidebar({
  selectedStock,
  setSelectedStock,
  children,
}: {
  selectedStock: string
  setSelectedStock: (stock: string) => void
  children: React.ReactNode
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="h-full p-4 space-y-4 overflow-y-auto">
          <Watchlist onSymbolSelect={setSelectedStock} selectedSymbol={selectedStock} />
          <Portfolio />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [selectedStock, setSelectedStock] = useState<string>("RELIANCE")
  const [mounted, setMounted] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number>(2456.75)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      redirect("/auth/login")
    }
  }, [user, loading, mounted])

  // Mock price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice((prev) => prev + (Math.random() - 0.5) * 10)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header - Responsive */}
      <TopBar />

      {/* Market Overview - Responsive */}
      <MarketOverview />

      {/* Main Trading Interface - Responsive Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:flex lg:w-80 border-r bg-card flex-col">
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <Watchlist onSymbolSelect={setSelectedStock} selectedSymbol={selectedStock} />
            <Portfolio />
          </div>
        </div>

        {/* Main Content Area - Responsive */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Mobile header with sidebar trigger */}
          <div className="lg:hidden p-4 border-b bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MobileSidebar selectedStock={selectedStock} setSelectedStock={setSelectedStock}>
                  <Watchlist onSymbolSelect={setSelectedStock} selectedSymbol={selectedStock} />
                  <Portfolio />
                </MobileSidebar>
                <h1 className="text-lg font-semibold">{selectedStock}</h1>
              </div>
              <Badge variant="outline">₹{currentPrice.toFixed(2)}</Badge>
            </div>
          </div>

          {/* Tabbed Content - Responsive */}
          <div className="flex-1 p-2 sm:p-4">
            <Tabs defaultValue="charts" className="h-full flex flex-col">
              <TabsList className="mb-4 w-full sm:w-auto">
                <TabsTrigger value="charts" className="flex-1 sm:flex-none">
                  Charts
                </TabsTrigger>
                <TabsTrigger value="options" className="flex-1 sm:flex-none">
                  Options
                </TabsTrigger>
                <TabsTrigger value="news" className="flex-1 sm:flex-none">
                  News
                </TabsTrigger>
                <TabsTrigger value="trade" className="flex-1 sm:flex-none lg:hidden">
                  Trade
                </TabsTrigger>
              </TabsList>

              <TabsContent value="charts" className="flex-1 mt-0">
                <AdvancedCharts symbol={selectedStock} />
              </TabsContent>

              <TabsContent value="options" className="flex-1 mt-0">
                <OptionsChain symbol={selectedStock} currentPrice={currentPrice} />
              </TabsContent>

              <TabsContent value="news" className="flex-1 mt-0">
                <MarketNews symbol={selectedStock} />
              </TabsContent>

              {/* Mobile trading tab */}
              <TabsContent value="trade" className="flex-1 mt-0 lg:hidden">
                <div className="space-y-4">
                  <Tabs defaultValue="order" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="order">Order</TabsTrigger>
                      <TabsTrigger value="risk">Risk</TabsTrigger>
                      <TabsTrigger value="ai">AI</TabsTrigger>
                    </TabsList>
                    <TabsContent value="order" className="mt-4">
                      <OrderPanel selectedStock={selectedStock} />
                    </TabsContent>
                    <TabsContent value="risk" className="mt-4">
                      <RiskManagement symbol={selectedStock} currentPrice={currentPrice} />
                    </TabsContent>
                    <TabsContent value="ai" className="mt-4">
                      <AIAdvisory symbol={selectedStock} />
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Desktop Right Sidebar */}
        <div className="hidden lg:flex lg:w-80 border-l bg-card flex-col">
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <Tabs defaultValue="trade" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trade">Trade</TabsTrigger>
                <TabsTrigger value="risk">Risk</TabsTrigger>
                <TabsTrigger value="ai">AI</TabsTrigger>
              </TabsList>

              <TabsContent value="trade" className="flex-1 mt-4">
                <OrderPanel selectedStock={selectedStock} />
              </TabsContent>

              <TabsContent value="risk" className="flex-1 mt-4">
                <RiskManagement symbol={selectedStock} currentPrice={currentPrice} />
              </TabsContent>

              <TabsContent value="ai" className="flex-1 mt-4">
                <AIAdvisory symbol={selectedStock} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
