"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, TrendingDown, Clock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrderPanelProps {
  selectedStock: string
}

interface Order {
  id: string
  symbol: string
  type: "BUY" | "SELL"
  orderType: "MARKET" | "LIMIT" | "STOP_LOSS"
  quantity: number
  price: number
  status: "PENDING" | "EXECUTED" | "CANCELLED"
  timestamp: Date
}

export function OrderPanel({ selectedStock }: OrderPanelProps) {
  const { toast } = useToast()
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT" | "STOP_LOSS">("MARKET")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      symbol: "RELIANCE",
      type: "BUY",
      orderType: "LIMIT",
      quantity: 10,
      price: 2450.0,
      status: "PENDING",
      timestamp: new Date(),
    },
    {
      id: "2",
      symbol: "TCS",
      type: "SELL",
      orderType: "MARKET",
      quantity: 5,
      price: 3890.45,
      status: "EXECUTED",
      timestamp: new Date(Date.now() - 3600000),
    },
  ])

  const placeOrder = (type: "BUY" | "SELL") => {
    const qty = Number.parseInt(quantity)
    const orderPrice = orderType === "MARKET" ? 0 : Number.parseFloat(price)

    if (!Number.isFinite(qty) || qty <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    if (orderType !== "MARKET" && (!Number.isFinite(orderPrice) || orderPrice <= 0)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      })
      return
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      symbol: selectedStock,
      type,
      orderType,
      quantity: qty,
      price: orderPrice,
      status: "PENDING",
      timestamp: new Date(),
    }

    setOrders((prev) => [newOrder, ...prev])

    // Simulate order execution
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((order) => (order.id === newOrder.id ? { ...order, status: "EXECUTED" as const } : order)),
      )
    }, 2000)

    toast({
      title: "Order Placed",
      description: `${type} order for ${qty} shares of ${selectedStock} has been placed`,
    })

    // Reset form
    setQuantity("")
    setPrice("")
  }

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: "CANCELLED" as const } : order)),
    )

    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled successfully",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-3 w-3 text-yellow-500" />
      case "EXECUTED":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "CANCELLED":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500"
      case "EXECUTED":
        return "bg-green-500"
      case "CANCELLED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatPrice = (price: number): string => {
    if (!Number.isFinite(price)) return "0.00"
    return price.toFixed(2)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Place Order</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm font-medium">{selectedStock}</div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="orderType" className="text-xs">
                Order Type
              </Label>
              <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MARKET">Market</SelectItem>
                  <SelectItem value="LIMIT">Limit</SelectItem>
                  <SelectItem value="STOP_LOSS">Stop Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity" className="text-xs">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {orderType !== "MARKET" && (
              <div>
                <Label htmlFor="price" className="text-xs">
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => placeOrder("BUY")} className="bg-green-600 hover:bg-green-700">
                BUY
              </Button>
              <Button onClick={() => placeOrder("SELL")} variant="destructive">
                SELL
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="border rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant={order.type === "BUY" ? "default" : "destructive"}>{order.type}</Badge>
                    <span className="text-xs font-medium">{order.symbol}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>{order.status}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {order.quantity} shares @ ₹{formatPrice(order.price)}
                  </span>
                  <span>{order.timestamp.toLocaleTimeString()}</span>
                </div>
                {order.status === "PENDING" && (
                  <Button variant="ghost" size="sm" className="mt-1 h-6 text-xs" onClick={() => cancelOrder(order.id)}>
                    Cancel
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
