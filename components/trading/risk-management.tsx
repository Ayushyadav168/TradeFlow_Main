"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { Shield, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

interface RiskManagementProps {
  symbol: string
  currentPrice: number
}

export function RiskManagement({ symbol, currentPrice }: RiskManagementProps) {
  const { user } = useAuth()
  const [riskProfile, setRiskProfile] = useState<"conservative" | "moderate" | "aggressive">("moderate")
  const [positionSize, setPositionSize] = useState("")
  const [stopLoss, setStopLoss] = useState("")
  const [takeProfit, setTakeProfit] = useState("")
  const [riskReward, setRiskReward] = useState<number>(0)
  const [maxRisk, setMaxRisk] = useState<number>(2) // 2% of portfolio
  const [portfolioValue, setPortfolioValue] = useState<number>(500000)

  useEffect(() => {
    calculateRiskReward()
  }, [positionSize, stopLoss, takeProfit, currentPrice])

  const calculateRiskReward = () => {
    const qty = Number.parseFloat(positionSize) || 0
    const sl = Number.parseFloat(stopLoss) || 0
    const tp = Number.parseFloat(takeProfit) || 0

    if (qty > 0 && sl > 0 && tp > 0) {
      const risk = Math.abs(currentPrice - sl) * qty
      const reward = Math.abs(tp - currentPrice) * qty
      setRiskReward(reward / risk)
    } else {
      setRiskReward(0)
    }
  }

  const getPositionSizeRecommendation = () => {
    const sl = Number.parseFloat(stopLoss) || 0
    if (sl > 0) {
      const riskPerShare = Math.abs(currentPrice - sl)
      const maxRiskAmount = (portfolioValue * maxRisk) / 100
      return Math.floor(maxRiskAmount / riskPerShare)
    }
    return 0
  }

  const getRiskLevel = () => {
    const qty = Number.parseFloat(positionSize) || 0
    const sl = Number.parseFloat(stopLoss) || 0
    const totalRisk = Math.abs(currentPrice - sl) * qty
    const riskPercent = (totalRisk / portfolioValue) * 100

    if (riskPercent <= 1) return { level: "LOW", color: "text-green-600" }
    if (riskPercent <= 3) return { level: "MEDIUM", color: "text-yellow-600" }
    return { level: "HIGH", color: "text-red-600" }
  }

  const getRiskRewardColor = () => {
    if (riskReward >= 2) return "text-green-600"
    if (riskReward >= 1) return "text-yellow-600"
    return "text-red-600"
  }

  const recommendedSize = getPositionSizeRecommendation()
  const riskLevel = getRiskLevel()

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Risk Management</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Risk Profile */}
        <div className="space-y-2">
          <Label>Risk Profile</Label>
          <div className="flex space-x-2">
            {(["conservative", "moderate", "aggressive"] as const).map((profile) => (
              <Button
                key={profile}
                variant={riskProfile === profile ? "default" : "outline"}
                size="sm"
                onClick={() => setRiskProfile(profile)}
                className="capitalize"
              >
                {profile}
              </Button>
            ))}
          </div>
        </div>

        {/* Position Size */}
        <div className="space-y-2">
          <Label htmlFor="position-size">Position Size (Shares)</Label>
          <Input
            id="position-size"
            type="number"
            placeholder="Enter quantity"
            value={positionSize}
            onChange={(e) => setPositionSize(e.target.value)}
          />
          {recommendedSize > 0 && (
            <p className="text-xs text-muted-foreground">
              Recommended: {recommendedSize} shares (based on {maxRisk}% risk)
            </p>
          )}
        </div>

        {/* Stop Loss */}
        <div className="space-y-2">
          <Label htmlFor="stop-loss">Stop Loss (₹)</Label>
          <Input
            id="stop-loss"
            type="number"
            step="0.01"
            placeholder="Enter stop loss price"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
          />
        </div>

        {/* Take Profit */}
        <div className="space-y-2">
          <Label htmlFor="take-profit">Take Profit (₹)</Label>
          <Input
            id="take-profit"
            type="number"
            step="0.01"
            placeholder="Enter take profit price"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
          />
        </div>

        {/* Risk Analysis */}
        {positionSize && stopLoss && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm">Risk Analysis</h4>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Risk Level:</span>
                <Badge variant="outline" className={`ml-2 ${riskLevel.color}`}>
                  {riskLevel.level}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Risk Amount:</span>
                <span className="font-medium ml-2">
                  ₹
                  {(
                    Math.abs(currentPrice - Number.parseFloat(stopLoss)) * Number.parseFloat(positionSize)
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {riskReward > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk:Reward Ratio:</span>
                  <span className={`font-medium ${getRiskRewardColor()}`}>1:{riskReward.toFixed(2)}</span>
                </div>
                <Progress value={Math.min(riskReward * 20, 100)} className="h-2" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-1">
                <TrendingDown className="w-3 h-3 text-red-500" />
                <span>
                  Max Loss: ₹
                  {(Math.abs(currentPrice - Number.parseFloat(stopLoss)) * Number.parseFloat(positionSize)).toFixed(2)}
                </span>
              </div>
              {takeProfit && (
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span>
                    Max Profit: ₹
                    {(Math.abs(Number.parseFloat(takeProfit) - currentPrice) * Number.parseFloat(positionSize)).toFixed(
                      2,
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Risk Alerts */}
        {riskLevel.level === "HIGH" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              High risk detected! Consider reducing position size or adjusting stop loss.
            </AlertDescription>
          </Alert>
        )}

        {riskReward > 0 && riskReward < 1 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Poor risk-reward ratio. Consider adjusting your take profit or stop loss levels.
            </AlertDescription>
          </Alert>
        )}

        {/* Risk Management Tips */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Risk Management Tips</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Never risk more than 2-3% of your portfolio on a single trade</p>
            <p>• Maintain a risk-reward ratio of at least 1:2</p>
            <p>• Always use stop losses to limit downside risk</p>
            <p>• Diversify across different sectors and asset classes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
