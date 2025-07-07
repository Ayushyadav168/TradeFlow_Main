"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  TrendingUp,
  BarChart3,
  PieChart,
  Settings,
  User,
  Wallet,
  Bell,
  Menu,
  Activity,
  Building2,
  Target,
  BookOpen,
  Plus,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Trading", href: "/trading", icon: TrendingUp },
  { name: "Market", href: "/market", icon: Building2, badge: "Live" },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Watchlist", href: "/watchlist", icon: Target },
  { name: "Orders", href: "/orders", icon: Activity },
  { name: "Learning", href: "/learning", icon: BookOpen },
]

const accountNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Wallet", href: "/account", icon: Wallet, badge: "Add Money" },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">TradeMind AI</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trading</h3>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</h3>
            <nav className="space-y-1">
              {accountNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <Badge
                        variant={item.name === "Wallet" ? "default" : "secondary"}
                        className={cn("text-xs", item.name === "Wallet" && "bg-green-500 hover:bg-green-600")}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                <Link href="/account" onClick={() => setOpen(false)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Money
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                <Link href="/trading" onClick={() => setOpen(false)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Start Trading
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <p>© 2024 TradeMind AI</p>
          <p>Version 2.0.1</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div
        className={cn(
          "hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:bg-background lg:border-r",
          className,
        )}
      >
        <SidebarContent />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
