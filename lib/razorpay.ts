// Razorpay Integration Service
export interface RazorpayConfig {
  key_id: string
  key_secret: string
  webhook_secret?: string
}

export interface PaymentOrder {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

export interface TopUpRequest {
  amount: number
  currency: string
  userId: string
  method: "UPI" | "NETBANKING" | "CARD" | "WALLET"
}

export interface Transaction {
  id: string
  orderId: string
  paymentId?: string
  amount: number
  currency: string
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED"
  method: string
  timestamp: Date
  userId: string
  receipt: string
}

class RazorpayService {
  private config: RazorpayConfig = {
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_rpnNH3RrWqpT9U",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "s8cKPbTGISIrraI5ywf37IRk",
    webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  }

  // Create Razorpay order
  async createOrder(request: TopUpRequest): Promise<PaymentOrder> {
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: request.amount * 100, // Convert to paise
          currency: request.currency,
          receipt: `topup_${request.userId}_${Date.now()}`,
          userId: request.userId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment order")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating Razorpay order:", error)
      throw error
    }
  }

  // Initialize Razorpay payment
  async initiatePayment(order: PaymentOrder, userDetails: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Razorpay can only be used in browser environment"))
        return
      }

      const options = {
        key: this.config.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "TradeMind AI",
        description: "Account Top-up",
        image: "/logo.png", // Add your logo here
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await this.verifyPayment(response)
            resolve()
          } catch (error) {
            reject(error)
          }
        },
        prefill: {
          name: userDetails.name || "",
          email: userDetails.email || "",
          contact: userDetails.phone || "",
        },
        notes: {
          address: "TradeMind AI Corporate Office",
          merchant_order_id: order.receipt,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment cancelled by user"))
          },
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        timeout: 300, // 5 minutes
        remember_customer: false,
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on("payment.failed", (response: any) => {
        reject(new Error(`Payment failed: ${response.error.description}`))
      })

      rzp.open()
    })
  }

  // Verify payment signature
  async verifyPayment(paymentResponse: any): Promise<boolean> {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentResponse),
      })

      if (!response.ok) {
        throw new Error("Payment verification failed")
      }

      const result = await response.json()
      return result.verified
    } catch (error) {
      console.error("Error verifying payment:", error)
      throw error
    }
  }

  // Get transaction history
  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const response = await fetch(`/api/payments/transactions?userId=${userId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching transactions:", error)
      return []
    }
  }

  // Get account balance
  async getAccountBalance(userId: string): Promise<{ balance: number; currency: string }> {
    try {
      const response = await fetch(`/api/account/balance?userId=${userId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch balance")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching balance:", error)
      return { balance: 0, currency: "INR" }
    }
  }

  // Check if Razorpay is loaded
  isRazorpayLoaded(): boolean {
    return typeof window !== "undefined" && !!(window as any).Razorpay
  }
}

export const razorpayService = new RazorpayService()
