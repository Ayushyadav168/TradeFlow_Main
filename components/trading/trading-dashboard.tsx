"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { MarketOverview } from "./market-overview"
import { TradingInterface } from "./trading-interface"
import { Portfolio } from "./portfolio"
import { Watchlist } from "./watchlist"
import { AIAdvisory } from "./ai-advisory"
import { OrderBook } from "./order-book"
import { AdvancedCharts } from "./advanced-charts"
import { MarketNews } from "./market-news"
import { RiskManagement } from "./risk-management"
import { OptionsChain } from "./options-chain"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TradingDashboard() {
  const { user } = useAuth()
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const currentPrice = 2456.75 // This would come from real-time data

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className="flex-1 flex flex-col">
          <MarketOverview />

          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={20} minSize={15}>
              <div className="h-full flex flex-col">
                <Watchlist onSymbolSelect={setSelectedSymbol} selectedSymbol={selectedSymbol} />
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={70}>
                  <Tabs defaultValue="charts" className="h-full flex flex-col">
                    <TabsList className="mx-3 mt-2">
                      <TabsTrigger value="charts">Advanced Charts</TabsTrigger>
                      <TabsTrigger value="options">Options Chain</TabsTrigger>
                    </TabsList>
                    <TabsContent value="charts" className="flex-1 mt-2">
                      <AdvancedCharts symbol={selectedSymbol} />
                    </TabsContent>
                    <TabsContent value="options" className="flex-1 mt-2">
                      <OptionsChain symbol={selectedSymbol} currentPrice={currentPrice} />
                    </TabsContent>
                  </Tabs>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={30}>
                  <div className="grid grid-cols-2 h-full">
                    <OrderBook symbol={selectedSymbol} />
                    <MarketNews symbol={selectedSymbol} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={30} minSize={25}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={35}>
                  <TradingInterface symbol={selectedSymbol} />
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={25}>
                  <Portfolio />
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={20}>
                  <Tabs defaultValue="ai" className="h-full flex flex-col">
                    <TabsList className="mx-3 mt-2">
                      <TabsTrigger value="ai">AI Advisory</TabsTrigger>
                      <TabsTrigger value="risk">Risk Mgmt</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ai" className="flex-1 mt-2">
                      <AIAdvisory symbol={selectedSymbol} />
                    </TabsContent>
                    <TabsContent value="risk" className="flex-1 mt-2">
                      <RiskManagement symbol={selectedSymbol} currentPrice={currentPrice} />
                    </TabsContent>
                  </Tabs>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={20}>
                  <div className="h-full p-3">
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Quick Stats</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Portfolio:</span>
                          <span className="text-green-600">+₹35,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Day P&L:</span>
                          <span className="text-green-600">+₹2,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available:</span>
                          <span>₹1,50,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}
