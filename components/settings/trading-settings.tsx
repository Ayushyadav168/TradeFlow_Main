"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Settings, Bell, Shield, Palette, Database } from "lucide-react"

export function TradingSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    // Trading Preferences
    defaultOrderType: "LIMIT",
    defaultQuantity: "10",
    autoStopLoss: true,
    stopLossPercent: "5",
    riskPerTrade: "2",

    // Notifications
    priceAlerts: true,
    orderExecutions: true,
    marketNews: false,
    aiRecommendations: true,
    emailNotifications: false,

    // Display
    theme: "dark",
    chartType: "candlestick",
    timeframe: "1D",
    showVolume: true,
    showIndicators: true,

    // API Settings
    dataProvider: "NSE",
    refreshRate: "1000",
    enableRealtime: true,
  })

  const handleSave = () => {
    // Save settings to Firebase or local storage
    toast({
      title: "Settings Saved",
      description: "Your trading preferences have been updated successfully.",
    })
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Trading Settings</h1>
      </div>

      <Tabs defaultValue="trading" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="api">Data & API</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Default Trading Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-order-type">Default Order Type</Label>
                  <Select
                    value={settings.defaultOrderType}
                    onValueChange={(value) => updateSetting("defaultOrderType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKET">Market Order</SelectItem>
                      <SelectItem value="LIMIT">Limit Order</SelectItem>
                      <SelectItem value="STOP_LOSS">Stop Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-quantity">Default Quantity</Label>
                  <Input
                    id="default-quantity"
                    type="number"
                    value={settings.defaultQuantity}
                    onChange={(e) => updateSetting("defaultQuantity", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="risk-per-trade">Risk Per Trade (%)</Label>
                  <Input
                    id="risk-per-trade"
                    type="number"
                    step="0.1"
                    value={settings.riskPerTrade}
                    onChange={(e) => updateSetting("riskPerTrade", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stop-loss-percent">Auto Stop Loss (%)</Label>
                  <Input
                    id="stop-loss-percent"
                    type="number"
                    step="0.1"
                    value={settings.stopLossPercent}
                    onChange={(e) => updateSetting("stopLossPercent", e.target.value)}
                    disabled={!settings.autoStopLoss}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-stop-loss"
                  checked={settings.autoStopLoss}
                  onCheckedChange={(checked) => updateSetting("autoStopLoss", checked)}
                />
                <Label htmlFor="auto-stop-loss">Enable automatic stop loss</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="price-alerts">Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when stocks hit target prices</p>
                  </div>
                  <Switch
                    id="price-alerts"
                    checked={settings.priceAlerts}
                    onCheckedChange={(checked) => updateSetting("priceAlerts", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="order-executions">Order Executions</Label>
                    <p className="text-sm text-muted-foreground">Notifications for order fills and rejections</p>
                  </div>
                  <Switch
                    id="order-executions"
                    checked={settings.orderExecutions}
                    onCheckedChange={(checked) => updateSetting("orderExecutions", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="market-news">Market News</Label>
                    <p className="text-sm text-muted-foreground">Breaking news and market updates</p>
                  </div>
                  <Switch
                    id="market-news"
                    checked={settings.marketNews}
                    onCheckedChange={(checked) => updateSetting("marketNews", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-recommendations">AI Recommendations</Label>
                    <p className="text-sm text-muted-foreground">AI-powered trading suggestions</p>
                  </div>
                  <Switch
                    id="ai-recommendations"
                    checked={settings.aiRecommendations}
                    onCheckedChange={(checked) => updateSetting("aiRecommendations", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Display Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chart-type">Default Chart Type</Label>
                  <Select value={settings.chartType} onValueChange={(value) => updateSetting("chartType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                      <SelectItem value="candlestick">Candlestick</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">Default Timeframe</Label>
                  <Select value={settings.timeframe} onValueChange={(value) => updateSetting("timeframe", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1D">1 Day</SelectItem>
                      <SelectItem value="1W">1 Week</SelectItem>
                      <SelectItem value="1M">1 Month</SelectItem>
                      <SelectItem value="3M">3 Months</SelectItem>
                      <SelectItem value="1Y">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-volume"
                    checked={settings.showVolume}
                    onCheckedChange={(checked) => updateSetting("showVolume", checked)}
                  />
                  <Label htmlFor="show-volume">Show volume on charts</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-indicators"
                    checked={settings.showIndicators}
                    onCheckedChange={(checked) => updateSetting("showIndicators", checked)}
                  />
                  <Label htmlFor="show-indicators">Show technical indicators by default</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Data & API Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data-provider">Primary Data Provider</Label>
                  <Select value={settings.dataProvider} onValueChange={(value) => updateSetting("dataProvider", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NSE">NSE (National Stock Exchange)</SelectItem>
                      <SelectItem value="BSE">BSE (Bombay Stock Exchange)</SelectItem>
                      <SelectItem value="BOTH">Both NSE & BSE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refresh-rate">Data Refresh Rate (ms)</Label>
                  <Select value={settings.refreshRate} onValueChange={(value) => updateSetting("refreshRate", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">500ms (Ultra Fast)</SelectItem>
                      <SelectItem value="1000">1 second (Fast)</SelectItem>
                      <SelectItem value="2000">2 seconds (Normal)</SelectItem>
                      <SelectItem value="5000">5 seconds (Slow)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-realtime"
                  checked={settings.enableRealtime}
                  onCheckedChange={(checked) => updateSetting("enableRealtime", checked)}
                />
                <Label htmlFor="enable-realtime">Enable real-time data streaming</Label>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">API Status</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>NSE Connection:</span>
                    <span className="text-green-600">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BSE Connection:</span>
                    <span className="text-green-600">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Services:</span>
                    <span className="text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update:</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="Enter current password" />
                </div>

                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>

                <Button variant="outline">Update Password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Active Sessions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Current Session</div>
                      <div className="text-xs text-muted-foreground">Chrome on Windows • Mumbai, India</div>
                    </div>
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}
