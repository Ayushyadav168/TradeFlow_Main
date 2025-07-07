"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Bell, Settings, User, LogOut, Wallet, TrendingUp, Menu, DollarSign, BarChart3 } from "lucide-react"
import Link from "next/link"

export function TradingHeader() {
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [accountBalance] = useState(125000)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="h-14 sm:h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden sm:block font-bold text-lg">TradeMind AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portfolio">Portfolio</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/analytics">Analytics</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">Settings</Link>
            </Button>
          </nav>
        </div>

        {/* Center Section - Search (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks, indices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Account Balance - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-muted/50 rounded-lg">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">₹{accountBalance.toLocaleString()}</span>
          </div>

          {/* Add Money Button - Desktop */}
          <Button size="sm" className="hidden sm:flex bg-green-600 hover:bg-green-700" asChild>
            <Link href="/profile?tab=wallet">
              <DollarSign className="h-4 w-4 mr-2" />
              Add Money
            </Link>
          </Button>

          {/* Mobile Search */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">RELIANCE hit your target price</p>
                  <p className="text-xs text-muted-foreground">₹2,456.75 (+2.3%)</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Your order has been executed</p>
                  <p className="text-xs text-muted-foreground">Bought 10 shares of TCS</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Market Alert: NIFTY 50 up 1.2%</p>
                  <p className="text-xs text-muted-foreground">Strong bullish momentum detected</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                <span className="text-sm text-muted-foreground">View all notifications</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.email?.split("@")[0] || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Mobile Balance Display */}
              <DropdownMenuItem className="lg:hidden">
                <Wallet className="mr-2 h-4 w-4" />
                <span>Balance: ₹{accountBalance.toLocaleString()}</span>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/profile?tab=wallet">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Wallet</span>
                  <Badge variant="secondary" className="ml-auto">
                    Add Money
                  </Badge>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/portfolio">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Portfolio</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/portfolio">Portfolio</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/analytics">Analytics</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
