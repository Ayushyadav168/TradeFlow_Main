"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { razorpayService } from "@/lib/razorpay"
import { CreditCard, Smartphone, Building2, Wallet, Shield, Zap, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { LoadingSpinner } from "../ui/loading-spinner"

interface Transaction {
  id: string
  amount: number
  status: "completed" | "pending" | "failed"
  method: string
  timestamp: string | Date
  razorpayOrderId?: string
  razorpayPaymentId?: string
}

export function AccountTopup() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("UPI")
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TXN001",
      amount: 50000,
      status: "completed",
      method: "UPI",
      timestamp: "2024-01-15T10:30:00Z",
      razorpayOrderId: "order_123",
      razorpayPaymentId: "pay_456",
    },
    {
      id: "TXN002",
      amount: 25000,
      status: "pending",
      method: "Net Banking",
      timestamp: "2024-01-14T15:45:00Z",
      razorpayOrderId: "order_789",
    },
    {
      id: "TXN003",
      amount: 75000,
      status: "failed",
      method: "Debit Card",
      timestamp: "2024-01-13T09:20:00Z",
      razorpayOrderId: "order_101",
    },
  ])

  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000]

  const paymentMethods = [
    {
      id: "UPI",
      name: "UPI",
      description: "GPay, PhonePe, Paytm",
      icon: Smartphone,
      processingTime: "Instant",
      fees: "Free",
    },
    {
      id: "NET_BANKING",
      name: "Net Banking",
      description: "All major banks",
      icon: Building2,
      processingTime: "2-5 mins",
      fees: "Free",
    },
    {
      id: "DEBIT_CARD",
      name: "Debit Card",
      description: "Visa, Mastercard, RuPay",
      icon: CreditCard,
      processingTime: "Instant",
      fees: "₹2 + GST",
    },
    {
      id: "CREDIT_CARD",
      name: "Credit Card",
      description: "Visa, Mastercard",
      icon: CreditCard,
      processingTime: "Instant",
      fees: "1.5% + GST",
    },
    {
      id: "WALLET",
      name: "Digital Wallet",
      description: "Paytm, Amazon Pay",
      icon: Wallet,
      processingTime: "Instant",
      fees: "Free",
    },
  ]

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString())
  }

  const handleTopup = async () => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please login to continue", variant: "destructive" })
      return
    }
    const topupAmount = Number.parseFloat(amount)
    if (!topupAmount || topupAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount (minimum ₹1)",
        variant: "destructive",
      })
      return
    }
    if (topupAmount > 200000) {
      toast({
        title: "Amount Limit Exceeded",
        description: "Maximum top-up amount is ₹2,00,000",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    try {
      const order = await razorpayService.createOrder({
        amount: topupAmount,
        currency: "INR",
        userId: user.uid,
        method: selectedMethod,
      })
      const newTransaction: Transaction = {
        id: `TXN${Date.now()}`,
        amount: topupAmount,
        status: "pending",
        method: selectedMethod,
        timestamp: new Date().toISOString(),
        razorpayOrderId: order.id,
      }
      setTransactions((prev) => [newTransaction, ...prev])
      const paymentResult = await razorpayService.initiatePayment(order, {
        name: user.displayName || user.email?.split("@")[0] || "User",
        email: user.email || "",
        phone: user.phoneNumber || "",
      })
      setTransactions((prev) =>
        prev.map((txn) =>
          txn.id === newTransaction.id
            ? { ...txn, status: "completed", razorpayPaymentId: paymentResult.razorpay_payment_id }
            : txn,
        ),
      )
      toast({
        title: "Payment Successful! 🎉",
        description: `₹${topupAmount.toLocaleString()} has been added to your account`,
      })
      setAmount("")
    } catch (error: any) {
      console.error("Payment error:", error)
      setTransactions((prev) =>
        prev.map((txn) => (txn.razorpayOrderId === error.order_id ? { ...txn, status: "failed" } : txn)),
      )
      let errorMessage = "Something went wrong. Please try again."
      if (error.message.includes("cancelled")) errorMessage = "Payment was cancelled"
      else if (error.message.includes("failed")) errorMessage = "Payment failed. Please check your payment details."
      toast({ title: "Payment Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (timestamp: string | Date) => {
    try {
      const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
      if (isNaN(date.getTime())) return "Invalid Date"
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Invalid Date"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Add Money to Your Account
          </CardTitle>
          <CardDescription>All transactions are secured with 256-bit SSL encryption.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Quick Select Amount</Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant={amount === quickAmount.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAmountSelect(quickAmount)}
                  className="text-sm"
                >
                  ₹{quickAmount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="amount" className="text-base font-medium">
              Enter Amount
            </Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                min="1"
                max="200000"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Min: ₹1 | Max: ₹2,00,000</p>
          </div>
          <Separator />
          <div>
            <Label className="text-base font-medium">Select Payment Method</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedMethod === method.id ? "ring-2 ring-primary border-primary" : "border-border"}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {method.icon && <method.icon className="h-5 w-5 text-primary mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{method.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{method.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-green-600">
                            <Zap className="h-3 w-3 inline mr-1" />
                            {method.processingTime}
                          </span>
                          <span className="text-xs text-muted-foreground">Fee: {method.fees}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Secure Payment</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Your payment is processed securely through Razorpay. We never store your payment details.
              </p>
            </div>
          </div>
          <Button
            onClick={handleTopup}
            disabled={loading || !amount || Number.parseFloat(amount) < 1}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              `Add ₹${amount ? Number.parseFloat(amount).toLocaleString() : "0"} to Account`
            )}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your recent top-up transactions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Your transaction history will appear here</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-2 sm:mb-0">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">₹{transaction.amount.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.method} • {formatDate(transaction.timestamp)}
                      </div>
                      {transaction.razorpayOrderId && (
                        <div className="text-xs text-muted-foreground">Order ID: {transaction.razorpayOrderId}</div>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
