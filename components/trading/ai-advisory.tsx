"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"
import { aiAdvisoryService, type AIRecommendation, type MarketSentiment, type AIInsight } from "@/lib/ai-advisory"
import { marketDataService } from "@/lib/market-data"

interface AIAdvisoryProps {
  selectedStock: string
}

export function AIAdvisory({ selectedStock }: AIAdvisoryProps) {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null)
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAIData = async () => {
      setLoading(true)
      try {
        const stockData = await marketDataService.getNSEStockData(selectedStock)
        if (stockData) {
          const [rec, sent, ins] = await Promise.all([
            aiAdvisoryService.getStockRecommendation(stockData),
            aiAdvisoryService.getMarketSentiment(),
            aiAdvisoryService.getAIInsights([stockData]),
          ])
          setRecommendation(rec)
          setSentiment(sent)
          setInsights(ins)
        }
      } catch (error) {
        console.error("Error fetching AI data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAIData()
  }, [selectedStock])

  const getActionColor = (action: string) => {
    switch (action) {
      case "BUY":
        return "bg-green-500"
      case "SELL":
        return "bg-red-500"
      case "HOLD":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "BULLISH":
        return "text-green-500"
      case "BEARISH":
        return "text-red-500"
      case "NEUTRAL":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "OPPORTUNITY":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "RISK":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "PATTERN":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "ANOMALY":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Advisory</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* AI Recommendation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Recommendation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendation && (
            <>
              <div className="flex items-center justify-between">
                <Badge className={`${getActionColor(recommendation.action)} text-white`}>{recommendation.action}</Badge>
                <div className="text-right">
                  <div className="text-sm font-medium">Confidence</div>
                  <div className="text-lg font-bold">{recommendation.confidence}%</div>
                </div>
              </div>

              <Progress value={recommendation.confidence} className="h-2" />

              <div className="text-xs text-muted-foreground">{recommendation.reasoning}</div>

              {recommendation.targetPrice && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Target: </span>
                    <span className="font-medium">₹{recommendation.targetPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stop Loss: </span>
                    <span className="font-medium">₹{recommendation.stopLoss?.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Market Sentiment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Market Sentiment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sentiment && (
            <>
              <div className="flex items-center justify-between">
                <span className={`font-medium ${getSentimentColor(sentiment.overall)}`}>{sentiment.overall}</span>
                <span className="text-sm font-bold">{sentiment.score.toFixed(1)}</span>
              </div>

              <div className="space-y-2">
                {Object.entries(sentiment.factors).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="capitalize">{key}</span>
                    <span className={value >= 0 ? "text-green-500" : "text-red-500"}>
                      {value >= 0 ? "+" : ""}
                      {value.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.slice(0, 3).map((insight, index) => (
            <div key={index} className="border-l-2 border-primary/20 pl-3">
              <div className="flex items-center space-x-2 mb-1">
                {getInsightIcon(insight.type)}
                <span className="text-xs font-medium">{insight.title}</span>
                <Badge variant="outline" className="text-xs">
                  {insight.impact}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{insight.description}</p>
              <div className="text-xs text-muted-foreground">{insight.timeframe}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
