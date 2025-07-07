"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Bell, Settings, LogOut, User, Moon, Sun, TrendingUp, Brain } from "lucide-react"
import { useTheme } from "next-themes"
import { isDemoMode } from "@/lib/firebase"

export function TopBar() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="h-14 border-b bg-card flex items-center justify-between px-2 sm:px-4">
      {/* Left side - Logo and Search */}
      <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="font-bold text-sm sm:text-lg hidden xs:block">TradeMind AI</span>
          {isDemoMode && (
            <Badge variant="outline" className="text-xs text-orange-600 border-orange-600 hidden sm:inline-flex">
              DEMO
            </Badge>
          )}
        </div>

        {/* Search - Hidden on mobile, shown on tablet+ */}
        <div className="relative hidden md:block flex-1 max-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>

      {/* Center - Market Status (Hidden on mobile) */}
      <div className="hidden lg:flex items-center space-x-4">
        <Badge variant="outline" className="text-green-600 border-green-600">
          <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
          Market Open
        </Badge>
        <div className="text-sm text-muted-foreground">NSE: 15:30 IST</div>
      </div>

      {/* Right side - Actions and User Menu */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Search button for mobile */}
        <Button variant="ghost" size="sm" className="md:hidden">
          <Search className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Bell className="w-4 h-4" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hidden sm:flex"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
                <AvatarFallback className="text-xs">{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm">{user?.displayName || "User"}</p>
                <p className="w-[200px] truncate text-xs text-muted-foreground">{user?.email}</p>
                {isDemoMode && (
                  <Badge variant="outline" className="text-xs w-fit">
                    Demo Mode
                  </Badge>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />

            {/* Mobile-only items */}
            <div className="sm:hidden">
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                <span>Toggle Theme</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </div>

            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>Trading History</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
