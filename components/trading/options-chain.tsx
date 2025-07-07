"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity } from "lucide-react"

interface OptionsChainProps {
  symbol: string
  currentPrice: number
}

interface OptionData {
  strike: number
  callLTP: number
  callChange: number
  callVolume: number
  callOI: number
  putLTP: number
  putChange: number
  putVolume: number
  putOI: number
  callIV: number
  putIV: number
  callDelta: number
  putDelta: number
  callGamma: number
  putGamma: number
  callTheta: number
  putTheta: number
}

export function OptionsChain({ symbol, currentPrice }: OptionsChainProps) {
  const [optionsData, setOptionsData] = useState<OptionData[]>([])
  const [selectedExpiry, setSelectedExpiry] = useState("2024-01-25")
  const [loading, setLoading] = useState(true)

  const expiryDates = ["2024-01-25", "2024-02-01", "2024-02-08", "2024-02-15", "2024-02-22", "2024-03-28"]

  useEffect(() => {
    generateOptionsData()
  }, [selectedExpiry, currentPrice])

  const generateOptionsData = () => {
    setLoading(true)

    // Generate mock options data
    const strikes = []
    const baseStrike = Math.round(currentPrice / 50) * 50

    for (let i = -10; i <= 10; i++) {
      strikes.push(baseStrike + i * 50)
    }

    const data: OptionData[] = strikes.map((strike) => {
      const isITM = strike < currentPrice
      const distance = Math.abs(strike - currentPrice)

      return {
        strike,
        callLTP: Math.max(0.05, isITM ? currentPrice - strike + Math.random() * 20 : Math.random() * 50),
        callChange: (Math.random() - 0.5) * 10,
        callVolume: Math.floor(Math.random() * 10000),
        callOI: Math.floor(Math.random() * 50000),
        putLTP: Math.max(0.05, !isITM ? strike - currentPrice + Math.random() * 20 : Math.random() * 50),
        putChange: (Math.random() - 0.5) * 10,
        putVolume: Math.floor(Math.random() * 10000),
        putOI: Math.floor(Math.random() * 50000),
        callIV: 15 + Math.random() * 25,
        putIV: 15 + Math.random() * 25,
        callDelta: isITM ? 0.5 + Math.random() * 0.4 : Math.random() * 0.5,
        putDelta: -(isITM ? Math.random() * 0.5 : 0.5 + Math.random() * 0.4),
        callGamma: Math.random() * 0.01,
        putGamma: Math.random() * 0.01,
        callTheta: -(Math.random() * 2),
        putTheta: -(Math.random() * 2),
      }
    })

    setOptionsData(data)
    setLoading(false)
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const getVolumeColor = (volume: number) => {
    if (volume > 5000) return "text-green-600"
    if (volume > 1000) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading options chain...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Options Chain</span>
          </CardTitle>
          <Select value={selectedExpiry} onValueChange={setSelectedExpiry}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {expiryDates.map((date) => (
                <SelectItem key={date} value={date}>
                  {new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Spot Price: ₹{currentPrice.toFixed(2)} | Expiry: {new Date(selectedExpiry).toLocaleDateString("en-IN")}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <Tabs defaultValue="chain" className="h-full flex flex-col">
          <TabsList className="mx-3">
            <TabsTrigger value="chain">Options Chain</TabsTrigger>
            <TabsTrigger value="greeks">Greeks</TabsTrigger>
          </TabsList>

          <TabsContent value="chain" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-3">
                {/* Header */}
                <div className="grid grid-cols-9 gap-2 text-xs font-medium text-muted-foreground border-b pb-2 mb-2">
                  <div className="col-span-2 text-center">CALLS</div>
                  <div className="text-center">Strike</div>
                  <div className="col-span-2 text-center">PUTS</div>
                  <div className="text-center">Vol</div>
                  <div className="text-center">OI</div>
                  <div className="text-center">Vol</div>
                  <div className="text-center">OI</div>
                </div>

                {/* Options Data */}
                <div className="space-y-1">
                  {optionsData.map((option) => (
                    <div
                      key={option.strike}
                      className={`grid grid-cols-9 gap-2 text-xs py-2 rounded hover:bg-muted/50 ${
                        Math.abs(option.strike - currentPrice) < 25 ? "bg-primary/5 border border-primary/20" : ""
                      }`}
                    >
                      {/* Call LTP */}
                      <div className="text-right font-medium">₹{option.callLTP.toFixed(2)}</div>

                      {/* Call Change */}
                      <div className={`text-right ${getChangeColor(option.callChange)}`}>
                        {option.callChange >= 0 ? "+" : ""}
                        {option.callChange.toFixed(2)}
                      </div>

                      {/* Strike Price */}
                      <div className="text-center font-bold">{option.strike}</div>

                      {/* Put LTP */}
                      <div className="text-left font-medium">₹{option.putLTP.toFixed(2)}</div>

                      {/* Put Change */}
                      <div className={`text-left ${getChangeColor(option.putChange)}`}>
                        {option.putChange >= 0 ? "+" : ""}
                        {option.putChange.toFixed(2)}
                      </div>

                      {/* Call Volume */}
                      <div className={`text-center ${getVolumeColor(option.callVolume)}`}>
                        {(option.callVolume / 1000).toFixed(1)}K
                      </div>

                      {/* Call OI */}
                      <div className="text-center">{(option.callOI / 1000).toFixed(1)}K</div>

                      {/* Put Volume */}
                      <div className={`text-center ${getVolumeColor(option.putVolume)}`}>
                        {(option.putVolume / 1000).toFixed(1)}K
                      </div>

                      {/* Put OI */}
                      <div className="text-center">{(option.putOI / 1000).toFixed(1)}K</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="greeks" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-3">
                {/* Header */}
                <div className="grid grid-cols-8 gap-2 text-xs font-medium text-muted-foreground border-b pb-2 mb-2">
                  <div>Strike</div>
                  <div className="text-center">Call IV</div>
                  <div className="text-center">Delta</div>
                  <div className="text-center">Gamma</div>
                  <div className="text-center">Theta</div>
                  <div className="text-center">Put IV</div>
                  <div className="text-center">Delta</div>
                  <div className="text-center">Gamma</div>
                </div>

                {/* Greeks Data */}
                <div className="space-y-1">
                  {optionsData.map((option) => (
                    <div
                      key={option.strike}
                      className={`grid grid-cols-8 gap-2 text-xs py-2 rounded hover:bg-muted/50 ${
                        Math.abs(option.strike - currentPrice) < 25 ? "bg-primary/5 border border-primary/20" : ""
                      }`}
                    >
                      <div className="font-bold">{option.strike}</div>
                      <div className="text-center">{option.callIV.toFixed(1)}%</div>
                      <div className="text-center">{option.callDelta.toFixed(3)}</div>
                      <div className="text-center">{option.callGamma.toFixed(4)}</div>
                      <div className="text-center text-red-600">{option.callTheta.toFixed(3)}</div>
                      <div className="text-center">{option.putIV.toFixed(1)}%</div>
                      <div className="text-center">{option.putDelta.toFixed(3)}</div>
                      <div className="text-center">{option.putGamma.toFixed(4)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
