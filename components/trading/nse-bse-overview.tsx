"use client"

import { useState, useEffect } from "react"
import { marketDataService, type MarketIndex, type IndexConstituent } from "@/lib/nse-bse-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const formatNumber = (num: number) => new Intl.NumberFormat("en-IN").format(num)
const formatCurrency = (num: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(num)

const ChangeIndicator = ({ change }: { change: number }) => {
  if (change > 0) return <ArrowUp className="h-4 w-4 text-green-500" />
  if (change < 0) return <ArrowDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-gray-500" />
}

const IndexCard = ({ index, onSelect }: { index: MarketIndex; onSelect: (index: MarketIndex) => void }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelect(index)}>
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-bold flex justify-between items-center">
        <span>{index.name}</span>
        <Badge variant="outline">{index.exchange}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{formatNumber(index.price)}</div>
      <div className={cn("flex items-center text-sm", index.change >= 0 ? "text-green-500" : "text-red-500")}>
        <ChangeIndicator change={index.change} />
        <span className="ml-1">
          {formatNumber(index.change)} ({index.changePercent.toFixed(2)}%)
        </span>
      </div>
    </CardContent>
  </Card>
)

const ConstituentTable = ({ constituents }: { constituents: IndexConstituent[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Symbol</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Change</TableHead>
        <TableHead className="text-right">Weight</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {constituents.slice(0, 10).map((stock) => (
        <TableRow key={stock.symbol}>
          <TableCell className="font-medium">{stock.symbol}</TableCell>
          <TableCell>{formatCurrency(stock.price)}</TableCell>
          <TableCell className={cn(stock.change >= 0 ? "text-green-500" : "text-red-500")}>
            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </TableCell>
          <TableCell className="text-right">{stock.weight.toFixed(2)}%</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export function NseBseOverview() {
  const [indices, setIndices] = useState<MarketIndex[]>([])
  const [selectedExchange, setSelectedExchange] = useState<"ALL" | "NSE" | "BSE">("ALL")
  const [selectedSector, setSelectedSector] = useState<string>("ALL")
  const [selectedDetails, setSelectedDetails] = useState<MarketIndex | null>(null)
  const [marketStatus, setMarketStatus] = useState(false)

  useEffect(() => {
    const initialData = marketDataService.getIndices()
    setIndices(initialData)
    setMarketStatus(marketDataService.isMarketOpen())
    if (initialData.length > 0) {
      setSelectedDetails(initialData[0])
    }

    const unsubscribe = marketDataService.subscribe((updatedData) => {
      setIndices(updatedData)
      setMarketStatus(marketDataService.isMarketOpen())
    })

    return () => unsubscribe()
  }, [])

  const filteredIndices = indices.filter((index) => selectedExchange === "ALL" || index.exchange === selectedExchange)

  const sectors = [...new Set(indices.flatMap((index) => index.constituents.map((c) => c.sector)))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Market Overview</h1>
        <Badge variant={marketStatus ? "default" : "destructive"} className={cn(marketStatus && "bg-green-500")}>
          Market {marketStatus ? "Open" : "Closed"}
        </Badge>
      </div>

      <Tabs defaultValue="indices">
        <TabsList>
          <TabsTrigger value="indices">Indices</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
        </TabsList>
        <TabsContent value="indices" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Tabs defaultValue="ALL" onValueChange={(value) => setSelectedExchange(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ALL">All</TabsTrigger>
                  <TabsTrigger value="NSE">NSE</TabsTrigger>
                  <TabsTrigger value="BSE">BSE</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {filteredIndices.map((index) => (
                  <IndexCard key={index.id} index={index} onSelect={setSelectedDetails} />
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              {selectedDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedDetails.name} Details</CardTitle>
                    <CardDescription>Top 10 constituents by weight.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ConstituentTable constituents={selectedDetails.constituents} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="sectors" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sectoral Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sectors.map((sector) => (
                  <Badge key={sector} variant="outline" className="p-2 justify-center">
                    {sector}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
