"use client"

import { useState, useEffect } from "react"
import { marketDataService, type MarketIndex } from "@/lib/market-data"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function MarketOverview() {
  const [allIndices, setAllIndices] = useState<MarketIndex[]>([])
  const [nseIndices, setNseIndices] = useState<MarketIndex[]>([])
  const [bseIndices, setBseIndices] = useState<MarketIndex[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const [allData, nseData, bseData] = await Promise.all([
          marketDataService.getMarketIndices(),
          marketDataService.getNSEIndices(),
          marketDataService.getBSEIndices(),
        ])

        setAllIndices(allData)
        setNseIndices(nseData)
        setBseIndices(bseData)
      } catch (error) {
        console.error("Error fetching indices:", error)
        // Fallback data
        setAllIndices([
          {
            name: "NIFTY 50",
            value: 21850.5,
            change: 125.3,
            changePercent: 0.58,
            high: 21920.8,
            low: 21780.2,
            open: 21800.5,
            previousClose: 21725.2,
            timestamp: Date.now(),
            exchange: "NSE",
          },
          {
            name: "SENSEX",
            value: 72240.26,
            change: 398.15,
            changePercent: 0.55,
            high: 72450.8,
            low: 71980.5,
            open: 72100.2,
            previousClose: 71842.11,
            timestamp: Date.now(),
            exchange: "BSE",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchIndices()
    const interval = setInterval(fetchIndices, 5000)

    return () => clearInterval(interval)
  }, [])

  const IndexCard = ({ index }: { index: MarketIndex }) => (
    <Card className="min-w-[280px] sm:min-w-[320px]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm sm:text-base">{index.name}</h3>
            <Badge variant="outline" className="text-xs">
              {index.exchange}
            </Badge>
          </div>
          {index.change >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg sm:text-xl font-bold">{index.value.toLocaleString()}</span>
            <div className={`text-sm font-medium ${index.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {index.change >= 0 ? "+" : ""}
              {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="block">Open</span>
              <span className="font-medium">{index.open?.toFixed(2) || "N/A"}</span>
            </div>
            <div>
              <span className="block">High</span>
              <span className="font-medium text-green-600">{index.high?.toFixed(2) || "N/A"}</span>
            </div>
            <div>
              <span className="block">Low</span>
              <span className="font-medium text-red-600">{index.low?.toFixed(2) || "N/A"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ScrollingTicker = ({ indices }: { indices: MarketIndex[] }) => (
    <div className="h-12 sm:h-16 border-b bg-card overflow-hidden">
      <div className="flex items-center h-full">
        <div className="flex space-x-3 sm:space-x-6 animate-scroll px-2 sm:px-4">
          {indices.map((index) => (
            <div
              key={`${index.exchange}-${index.name}`}
              className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap"
            >
              <Badge variant="outline" className="text-xs">
                {index.exchange}
              </Badge>
              <span className="font-medium text-xs sm:text-sm">{index.name}</span>
              <span className="font-bold text-sm sm:text-base">{index.value.toLocaleString()}</span>
              <div className="flex items-center space-x-1">
                {index.change >= 0 ? (
                  <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-2 h-2 sm:w-3 sm:h-3 text-red-500" />
                )}
                <span
                  className={`text-xs sm:text-sm font-medium ${index.change >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {index.change >= 0 ? "+" : ""}
                  {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="h-12 sm:h-16 border-b bg-card flex items-center px-2 sm:px-4">
        <div className="animate-pulse flex space-x-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 sm:h-8 w-24 sm:w-32 bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  // For mobile and tablet, show scrolling ticker
  if (window.innerWidth < 1024) {
    return <ScrollingTicker indices={allIndices} />
  }

  // For desktop, show detailed cards with tabs
  return (
    <div className="border-b bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Market Indices</h2>
          </div>
          <div className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Markets</TabsTrigger>
            <TabsTrigger value="nse">NSE</TabsTrigger>
            <TabsTrigger value="bse">BSE</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {allIndices.map((index) => (
                <IndexCard key={`${index.exchange}-${index.name}`} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nse">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {nseIndices.slice(0, 6).map((index) => (
                <IndexCard key={`${index.exchange}-${index.name}`} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bse">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {bseIndices.slice(0, 6).map((index) => (
                <IndexCard key={`${index.exchange}-${index.name}`} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
