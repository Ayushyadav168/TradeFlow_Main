import type { StockData } from "./market-data"

export interface AIRecommendation {
  symbol: string
  action: "BUY" | "SELL" | "HOLD"
  confidence: number
  reasoning: string
  targetPrice?: number
  stopLoss?: number
  timeHorizon: "SHORT" | "MEDIUM" | "LONG"
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
}

export interface MarketSentiment {
  overall: "BULLISH" | "BEARISH" | "NEUTRAL"
  score: number // -100 to 100
  factors: {
    technical: number
    fundamental: number
    news: number
    social: number
  }
}

export interface AIInsight {
  type: "PATTERN" | "ANOMALY" | "OPPORTUNITY" | "RISK"
  title: string
  description: string
  impact: "HIGH" | "MEDIUM" | "LOW"
  timeframe: string
  actionable: boolean
}

class AIAdvisoryService {
  async getStockRecommendation(stockData: StockData): Promise<AIRecommendation> {
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 500))

    const technicalScore = this.calculateTechnicalScore(stockData)
    const fundamentalScore = this.calculateFundamentalScore(stockData)
    const sentimentScore = await this.getSentimentScore(stockData.symbol)

    const overallScore = (technicalScore + fundamentalScore + sentimentScore) / 3

    let action: "BUY" | "SELL" | "HOLD"
    let confidence: number
    let reasoning: string

    if (overallScore > 70) {
      action = "BUY"
      confidence = Math.min(overallScore, 95)
      reasoning = `Strong bullish signals detected. Technical indicators show upward momentum, fundamentals are solid, and market sentiment is positive.`
    } else if (overallScore < 30) {
      action = "SELL"
      confidence = Math.min(100 - overallScore, 95)
      reasoning = `Bearish indicators present. Technical analysis suggests downward pressure, and risk factors are elevated.`
    } else {
      action = "HOLD"
      confidence = 60 + Math.random() * 20
      reasoning = `Mixed signals in the market. Current position appears stable with moderate volatility expected.`
    }

    return {
      symbol: stockData.symbol,
      action,
      confidence: Number(confidence.toFixed(1)),
      reasoning,
      targetPrice: action === "BUY" ? stockData.price * 1.15 : stockData.price * 0.85,
      stopLoss: action === "BUY" ? stockData.price * 0.92 : stockData.price * 1.08,
      timeHorizon: "MEDIUM",
      riskLevel: overallScore > 60 ? "MEDIUM" : "HIGH",
    }
  }

  async getMarketSentiment(): Promise<MarketSentiment> {
    // Simulate sentiment analysis
    await new Promise((resolve) => setTimeout(resolve, 300))

    const technical = Math.random() * 200 - 100
    const fundamental = Math.random() * 200 - 100
    const news = Math.random() * 200 - 100
    const social = Math.random() * 200 - 100

    const overall = (technical + fundamental + news + social) / 4

    let sentiment: "BULLISH" | "BEARISH" | "NEUTRAL"
    if (overall > 20) sentiment = "BULLISH"
    else if (overall < -20) sentiment = "BEARISH"
    else sentiment = "NEUTRAL"

    return {
      overall: sentiment,
      score: Number(overall.toFixed(1)),
      factors: {
        technical: Number(technical.toFixed(1)),
        fundamental: Number(fundamental.toFixed(1)),
        news: Number(news.toFixed(1)),
        social: Number(social.toFixed(1)),
      },
    }
  }

  async getAIInsights(portfolio: StockData[]): Promise<AIInsight[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    return [
      {
        type: "OPPORTUNITY",
        title: "Sector Rotation Detected",
        description:
          "Technology stocks showing strong momentum while banking sector faces headwinds. Consider rebalancing.",
        impact: "HIGH",
        timeframe: "2-4 weeks",
        actionable: true,
      },
      {
        type: "PATTERN",
        title: "Bullish Flag Formation",
        description: "RELIANCE showing classic bullish flag pattern with potential breakout above ₹2,500.",
        impact: "MEDIUM",
        timeframe: "1-2 weeks",
        actionable: true,
      },
      {
        type: "RISK",
        title: "Elevated Volatility Warning",
        description: "Market volatility expected to increase due to upcoming earnings season and global events.",
        impact: "MEDIUM",
        timeframe: "Next 10 days",
        actionable: false,
      },
      {
        type: "ANOMALY",
        title: "Unusual Volume Activity",
        description: "TCS showing 3x normal volume with institutional buying detected.",
        impact: "HIGH",
        timeframe: "Today",
        actionable: true,
      },
    ]
  }

  private calculateTechnicalScore(stockData: StockData): number {
    let score = 50 // Base score

    // Price momentum
    if (stockData.changePercent > 2) score += 20
    else if (stockData.changePercent > 0) score += 10
    else if (stockData.changePercent < -2) score -= 20
    else if (stockData.changePercent < 0) score -= 10

    // Volume analysis
    const avgVolume = 1000000 // Simulated average volume
    if (stockData.volume > avgVolume * 1.5) score += 15
    else if (stockData.volume < avgVolume * 0.5) score -= 10

    // Price position relative to high/low
    const pricePosition = (stockData.price - stockData.low) / (stockData.high - stockData.low)
    if (pricePosition > 0.8) score += 10
    else if (pricePosition < 0.2) score -= 10

    return Math.max(0, Math.min(100, score))
  }

  private calculateFundamentalScore(stockData: StockData): number {
    let score = 50

    // P/E ratio analysis
    if (stockData.pe && stockData.pe < 15) score += 15
    else if (stockData.pe && stockData.pe > 30) score -= 15

    // Market cap consideration
    if (stockData.marketCap && stockData.marketCap > 10000000) score += 10

    // Sector-specific adjustments
    if (stockData.sector === "IT Services") score += 5
    else if (stockData.sector === "Banking") score -= 5

    return Math.max(0, Math.min(100, score))
  }

  private async getSentimentScore(symbol: string): Promise<number> {
    // Simulate news and social sentiment analysis
    return 40 + Math.random() * 40 // Random score between 40-80
  }

  async generatePersonalizedAdvice(userProfile: any, portfolio: StockData[]): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const riskLevel = userProfile?.riskTolerance || "MEDIUM"
    const investmentGoal = userProfile?.investmentGoal || "GROWTH"

    let advice = `Based on your ${riskLevel.toLowerCase()} risk profile and ${investmentGoal.toLowerCase()} investment goal:\n\n`

    if (riskLevel === "LOW") {
      advice += "• Consider increasing allocation to large-cap stocks and dividend-paying companies\n"
      advice += "• Maintain 20-30% in debt instruments for stability\n"
    } else if (riskLevel === "HIGH") {
      advice += "• Explore mid and small-cap opportunities for higher growth potential\n"
      advice += "• Consider sector-specific ETFs for diversified exposure\n"
    }

    advice += "• Current market conditions favor technology and healthcare sectors\n"
    advice += "• Consider systematic investment plans (SIP) for rupee cost averaging\n"

    return advice
  }
}

export const aiAdvisoryService = new AIAdvisoryService()
