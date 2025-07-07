"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Target, Shield } from "lucide-react"

export function PortfolioAnalytics() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/analytics/portfolio?userId=${user.uid}`)
        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No analytics data available</div>
      </div>
    )
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{analytics.performance.totalReturn.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+{analytics.performance.totalReturnPercent.toFixed(2)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Day Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{analytics.performance.dayReturn.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analytics.performance.dayReturnPercent.toFixed(2)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.tradingActivity.winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{analytics.tradingActivity.totalTrades} trades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.riskMetrics.sharpeRatio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Risk-adjusted return</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="activity">Trading Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="return" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily P&L</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.dailyPnL}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="pnl" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topPerformers.map((stock: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{stock.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-medium">+{stock.return}%</div>
                        <div className="text-xs text-muted-foreground">₹{stock.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Losers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topLosers.map((stock: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="font-medium">{stock.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-red-600 font-medium">{stock.return}%</div>
                        <div className="text-xs text-muted-foreground">₹{stock.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sector Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.allocation.sectors}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.allocation.sectors.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Asset Type Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.allocation.assetTypes.map((asset: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{asset.name}</span>
                        <span>{asset.value}%</span>
                      </div>
                      <Progress value={asset.value} className="h-2" />
                      <div className="text-xs text-muted-foreground">₹{asset.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Risk Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Beta</div>
                    <div className="text-lg font-bold">{analytics.riskMetrics.beta}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Alpha</div>
                    <div className="text-lg font-bold text-green-600">{analytics.riskMetrics.alpha}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Volatility</div>
                    <div className="text-lg font-bold">{analytics.riskMetrics.volatility}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Max Drawdown</div>
                    <div className="text-lg font-bold text-red-600">{analytics.riskMetrics.maxDrawdown}%</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Value at Risk (95%)</div>
                  <div className="text-lg font-bold text-red-600">
                    ₹{Math.abs(analytics.riskMetrics.var95).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Portfolio Risk Level</span>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        MODERATE
                      </Badge>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Diversification Score</span>
                      <span className="text-sm font-medium">78/100</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Liquidity Score</span>
                      <span className="text-sm font-medium">85/100</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Risk Recommendations</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Consider reducing concentration in technology sector</li>
                    <li>• Add defensive stocks to reduce portfolio volatility</li>
                    <li>• Maintain stop-loss orders for high-risk positions</li>
                    <li>• Review position sizes based on risk tolerance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trading Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Trades</div>
                    <div className="text-2xl font-bold">{analytics.tradingActivity.totalTrades}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                    <div className="text-2xl font-bold text-green-600">{analytics.tradingActivity.winRate}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Win</div>
                    <div className="text-lg font-bold text-green-600">
                      ₹{analytics.tradingActivity.avgWin.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Loss</div>
                    <div className="text-lg font-bold text-red-600">
                      ₹{Math.abs(analytics.tradingActivity.avgLoss).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Profit Factor</div>
                    <div className="text-lg font-bold">{analytics.tradingActivity.profitFactor}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Largest Win</div>
                    <div className="text-lg font-bold text-green-600">
                      ₹{analytics.tradingActivity.largestWin.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Strong Performance</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      +7.78%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Good Risk Management</span>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Sharpe 1.45
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">High Win Rate</span>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      68.9%
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Trading Insights</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Your win rate is above average (68.9% vs 55% market avg)</li>
                    <li>• Consider increasing position sizes on high-conviction trades</li>
                    <li>• Technology sector trades show highest success rate</li>
                    <li>• Morning trades (9:30-11:00) perform better than afternoon</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
