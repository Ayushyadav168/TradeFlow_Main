"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, TrendingUp, AlertCircle } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  timestamp: Date
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL"
  impact: "HIGH" | "MEDIUM" | "LOW"
  relatedStocks: string[]
}

export function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: "1",
      title: "Reliance Industries Reports Strong Q3 Results",
      summary:
        "RIL beats estimates with 15% YoY growth in net profit, driven by strong performance in retail and telecom segments.",
      source: "Economic Times",
      timestamp: new Date(Date.now() - 1800000),
      sentiment: "POSITIVE",
      impact: "HIGH",
      relatedStocks: ["RELIANCE"],
    },
    {
      id: "2",
      title: "IT Sector Outlook Remains Positive Despite Global Headwinds",
      summary: "Leading IT companies maintain growth guidance as demand for digital transformation continues.",
      source: "Business Standard",
      timestamp: new Date(Date.now() - 3600000),
      sentiment: "POSITIVE",
      impact: "MEDIUM",
      relatedStocks: ["TCS", "INFY", "WIPRO"],
    },
    {
      id: "3",
      title: "Banking Sector Faces NPA Concerns",
      summary: "Rising interest rates and economic uncertainty may impact loan growth and asset quality.",
      source: "Mint",
      timestamp: new Date(Date.now() - 7200000),
      sentiment: "NEGATIVE",
      impact: "MEDIUM",
      relatedStocks: ["HDFC", "ICICIBANK", "SBIN"],
    },
    {
      id: "4",
      title: "FII Inflows Continue to Support Market Rally",
      summary: "Foreign institutional investors pump in ₹15,000 crores in the past week, boosting market sentiment.",
      source: "Reuters",
      timestamp: new Date(Date.now() - 10800000),
      sentiment: "POSITIVE",
      impact: "HIGH",
      relatedStocks: [],
    },
  ])

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "POSITIVE":
        return "bg-green-500"
      case "NEGATIVE":
        return "bg-red-500"
      case "NEUTRAL":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "HIGH":
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case "MEDIUM":
        return <TrendingUp className="h-3 w-3 text-yellow-500" />
      case "LOW":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      default:
        return null
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000)

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Newspaper className="h-4 w-4" />
          <span>Market News</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="border rounded p-3 space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm leading-tight flex-1 mr-2">{item.title}</h4>
              <div className="flex items-center space-x-1">
                {getImpactIcon(item.impact)}
                <Badge className={`${getSentimentColor(item.sentiment)} text-white text-xs`}>{item.sentiment}</Badge>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">{item.source}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{formatTimeAgo(item.timestamp)}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            {item.relatedStocks.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">Related:</span>
                {item.relatedStocks.map((stock) => (
                  <Badge key={stock} variant="outline" className="text-xs">
                    {stock}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
