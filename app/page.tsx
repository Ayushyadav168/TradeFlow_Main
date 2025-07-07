"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Shield, Zap, BarChart3, Users } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router, mounted])

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">TradeMind AI</h1>
          </div>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4">Powered by Advanced AI</Badge>
          <h1 className="text-5xl font-bold mb-6">
            The Future of <span className="text-primary">Intelligent Trading</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience professional-grade trading with AI-powered insights, real-time NSE/BSE data, and personalized
            investment advisory that helps you make smarter decisions.
          </p>
          <div className="space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8">
                Start Trading Now
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose TradeMind AI?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Combining cutting-edge technology with professional trading tools to give you the edge in the market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Brain className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI-Powered Advisory</CardTitle>
              <CardDescription>
                Get personalized investment recommendations based on advanced machine learning algorithms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Sentiment analysis from news and social media</li>
                <li>• Predictive price movement models</li>
                <li>• Risk assessment and portfolio optimization</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Real-Time Market Data</CardTitle>
              <CardDescription>Live NSE/BSE data streaming with professional-grade charting tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Real-time price updates</li>
                <li>• Advanced technical indicators</li>
                <li>• Multi-timeframe analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure & Compliant</CardTitle>
              <CardDescription>Bank-grade security with full regulatory compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• End-to-end encryption</li>
                <li>• SEBI compliance</li>
                <li>• Multi-factor authentication</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>Ultra-low latency trading with instant order execution</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Sub-second order placement</li>
                <li>• Real-time portfolio updates</li>
                <li>• Instant notifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Professional Tools</CardTitle>
              <CardDescription>Institutional-grade analytics and research tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Advanced charting and indicators</li>
                <li>• Fundamental analysis tools</li>
                <li>• Options chain analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Social Trading</CardTitle>
              <CardDescription>Learn from top traders and share insights with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Follow successful traders</li>
                <li>• Share trading ideas</li>
                <li>• Community discussions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Trading?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of traders who are already using AI to make smarter investment decisions.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="px-8">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold">TradeMind AI</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 TradeMind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
