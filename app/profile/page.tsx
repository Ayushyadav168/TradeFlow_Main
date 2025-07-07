"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AccountTopup } from "@/components/account/account-topup"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { razorpayService } from "@/lib/razorpay"
import {
  User,
  Wallet,
  TrendingUp,
  Shield,
  Bell,
  Activity,
  Edit,
  Camera,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  BarChart3,
  Plus,
} from "lucide-react"

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  joinDate: string
  kycStatus: "verified" | "pending" | "not_started"
  accountBalance: number
  portfolioValue: number
  totalReturns: number
  totalTrades: number
}

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "trade"
  amount: number
  status: "completed" | "pending" | "failed"
  date: string
  description: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [quickAddAmount, setQuickAddAmount] = useState("")
  const [addingFunds, setAddingFunds] = useState(false)

  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra, India",
    joinDate: "January 2024",
    kycStatus: "verified",
    accountBalance: 125000,
    portfolioValue: 245000,
    totalReturns: 18.5,
    totalTrades: 156,
  })

  const [transactions] = useState<Transaction[]>([
    {
      id: "TXN001",
      type: "deposit",
      amount: 50000,
      status: "completed",
      date: "2024-01-15",
      description: "UPI Payment - Added funds",
    },
    {
      id: "TXN002",
      type: "trade",
      amount: -25000,
      status: "completed",
      date: "2024-01-14",
      description: "Buy RELIANCE - 10 shares",
    },
    {
      id: "TXN003",
      type: "deposit",
      amount: 75000,
      status: "completed",
      date: "2024-01-10",
      description: "Net Banking - Initial deposit",
    },
  ])

  const quickAmounts = [5000, 10000, 25000, 50000]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      redirect("/auth/login")
    }
  }, [user, loading, mounted])

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) return null

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })
    console.log("Profile saved:", profile)
  }

  const handleQuickAddFunds = async (amount: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to continue",
        variant: "destructive",
      })
      return
    }

    setAddingFunds(true)

    try {
      const order = await razorpayService.createOrder({
        amount: amount,
        currency: "INR",
        userId: user.uid,
        method: "UPI",
      })

      await razorpayService.initiatePayment(order, {
        name: user.displayName || user.email?.split("@")[0] || "User",
        email: user.email || "",
        phone: user.phoneNumber || "",
      })

      toast({
        title: "Payment Successful! 🎉",
        description: `₹${amount.toLocaleString()} has been added to your account`,
      })

      setProfile((prev) => ({
        ...prev,
        accountBalance: prev.accountBalance + amount,
      }))
    } catch (error: any) {
      console.error("Payment error:", error)
      let errorMessage = "Something went wrong. Please try again."
      if (error.message.includes("cancelled")) {
        errorMessage = "Payment was cancelled"
      } else if (error.message.includes("failed")) {
        errorMessage = "Payment failed. Please check your payment details."
      }
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setAddingFunds(false)
    }
  }

  const handleCustomAddFunds = async () => {
    const amount = Number.parseFloat(quickAddAmount)
    if (!amount || amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount (minimum ₹1)",
        variant: "destructive",
      })
      return
    }
    if (amount > 200000) {
      toast({
        title: "Amount Limit Exceeded",
        description: "Maximum top-up amount is ₹2,00,000",
        variant: "destructive",
      })
      return
    }
    await handleQuickAddFunds(amount)
    setQuickAddAmount("")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your account and trading preferences</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={profile.kycStatus === "verified" ? "default" : "secondary"}
                className={profile.kycStatus === "verified" ? "bg-green-500" : ""}
              >
                {profile.kycStatus === "verified" ? "KYC Verified" : "KYC Pending"}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>Wallet</span>
              </TabsTrigger>
              <TabsTrigger value="trading" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trading</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 bg-transparent"
                      >
                        <Camera className="h-3 w-3" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{profile.name}</h3>
                      <p className="text-sm text-muted-foreground">Member since {profile.joinDate}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                        ) : (
                          <span>{profile.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        ) : (
                          <span>{profile.email}</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        ) : (
                          <span>{profile.phone}</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="address"
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          />
                        ) : (
                          <span>{profile.address}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Account Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Account Balance</span>
                      <span className="font-semibold text-green-600">₹{profile.accountBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Portfolio Value</span>
                      <span className="font-semibold">₹{profile.portfolioValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Returns</span>
                      <span className="font-semibold text-green-500">+{profile.totalReturns}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Trades</span>
                      <span className="font-semibold">{profile.totalTrades}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Quick Add Funds</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAddFunds(amount)}
                          disabled={addingFunds}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />₹{amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        type="number"
                        placeholder="Custom amount"
                        value={quickAddAmount}
                        onChange={(e) => setQuickAddAmount(e.target.value)}
                        className="text-sm"
                        min="1"
                        max="200000"
                      />
                      <Button
                        size="sm"
                        onClick={handleCustomAddFunds}
                        disabled={addingFunds || !quickAddAmount}
                        className="w-full sm:w-auto"
                      >
                        {addingFunds ? <LoadingSpinner className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <Button className="w-full" onClick={() => setActiveTab("wallet")}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Full Wallet Management
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <AccountTopup />
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trading Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Order Type</Label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>Market Order</option>
                      <option>Limit Order</option>
                      <option>Stop Loss</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Risk Level</Label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>Conservative</option>
                      <option>Moderate</option>
                      <option>Aggressive</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Price Alerts</h4>
                      <p className="text-sm text-muted-foreground">Get notified when stocks hit target prices</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Order Updates</h4>
                      <p className="text-sm text-muted-foreground">Notifications for order executions</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div
                        className={`w-3 h-3 rounded-full ${transaction.status === "completed" ? "bg-green-500" : transaction.status === "pending" ? "bg-yellow-500" : "bg-red-500"}`}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                          {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : transaction.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
