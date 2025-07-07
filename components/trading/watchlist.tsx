"use client"

import { useState, useEffect } from "react"
import { marketDataService, type StockData } from "@/lib/market-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search, TrendingUp, TrendingDown, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface WatchlistProps {
  onSymbolSelect: (symbol: string) => void
  selectedSymbol: string
}

export function Watchlist({ onSymbolSelect, selectedSymbol }: WatchlistProps) {
  const [watchlistStocks, setWatchlistStocks] = useState<StockData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)

  // Mock watchlist data
  const mockWatchlist = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      price: 2456.75,
      change: 23.45,
      changePercent: 0.96,
      volume: 1234567,
      high: 2478.9,
      low: 2445.2,
      open: 2450.0,
      previousClose: 2433.3,
      timestamp: Date.now(),
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: 3678.9,
      change: -12.3,
      changePercent: -0.33,
      volume: 987654,
      high: 3695.5,
      low: 3665.8,
      open: 3685.2,
      previousClose: 3691.2,
      timestamp: Date.now(),
    },
    {
      symbol: "INFY",
      name: "Infosys Limited",
      price: 1456.25,
      change: 18.75,
      changePercent: 1.3,
      volume: 2345678,
      high: 1465.8,
      low: 1445.9,
      open: 1448.5,
      previousClose: 1437.5,
      timestamp: Date.now(),
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Limited",
      price: 1678.45,
      change: -8.9,
      changePercent: -0.53,
      volume: 1876543,
      high: 1689.7,
      low: 1672.3,
      open: 1685.2,
      previousClose: 1687.35,
      timestamp: Date.now(),
    },
    {
      symbol: "ICICIBANK",
      name: "ICICI Bank Limited",
      price: 987.6,
      change: 15.4,
      changePercent: 1.58,
      volume: 3456789,
      high: 995.8,
      low: 982.1,
      open: 985.3,
      previousClose: 972.2,
      timestamp: Date.now(),
    },
  ]

  useEffect(() => {
    // Initialize with mock data
    setWatchlistStocks(mockWatchlist)
    setLoading(false)

    // Set up real-time updates
    const unsubscribers = mockWatchlist.map((stock) =>
      marketDataService.subscribe(stock.symbol, (data) => {
        setWatchlistStocks((prev) => prev.map((s) => (s.symbol === data.symbol ? data : s)))
      }),
    )

    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      try {
        const results = await marketDataService.searchStocks(query)
        setSearchResults(results)
      } catch (error) {
        console.error("Search error:", error)
      }
    } else {
      setSearchResults([])
    }
  }

  const addToWatchlist = (stock: StockData) => {
    if (!watchlistStocks.find((s) => s.symbol === stock.symbol)) {
      setWatchlistStocks((prev) => [...prev, stock])
    }
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">Watchlist</CardTitle>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          {searchResults.length > 0 && (
            <div className="p-3 border-b">
              <h4 className="text-sm font-medium mb-2">Search Results</h4>
              {searchResults.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                  onClick={() => addToWatchlist(stock)}
                >
                  <div>
                    <div className="font-medium text-sm">{stock.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                  </div>
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1 p-3">
            {watchlistStocks.map((stock) => (
              <div
                key={stock.symbol}
                className={cn(
                  "p-2 sm:p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted",
                  selectedSymbol === stock.symbol && "bg-primary/10 border border-primary/20",
                )}
                onClick={() => onSymbolSelect(stock.symbol)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="font-medium text-sm truncate">{stock.symbol}</span>
                    <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-base">₹{stock.price.toFixed(2)}</span>
                  <div className="text-right">
                    <div
                      className={cn(
                        "text-xs sm:text-sm font-medium",
                        stock.change >= 0 ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)}
                    </div>
                    <div className={cn("text-xs", stock.change >= 0 ? "text-green-500" : "text-red-500")}>
                      ({stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mt-1">Vol: {(stock.volume / 1000000).toFixed(2)}M</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
