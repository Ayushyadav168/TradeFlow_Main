export interface IndexData {
  symbol: string
  name: string
  exchange: "NSE" | "BSE"
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  volume: number
  marketCap?: string
  sector?: string
  constituents?: StockConstituent[]
}

export interface StockConstituent {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  weight: number
  sector: string
  marketCap: number
}

export interface MarketStatus {
  isOpen: boolean
  nextOpen?: string
  nextClose?: string
  timezone: string
}

export interface IndexConstituent {
  symbol: string
  name: string
  weight: number
  price: number
  change: number
  changePercent: number
  sector: string
}

export interface MarketIndex {
  id: string
  name: string
  exchange: "NSE" | "BSE"
  price: number
  change: number
  changePercent: number
  open: number
  high: number
  low: number
  volume: number
  marketCap: string
  constituents: IndexConstituent[]
}

const sectors = [
  "Financial Services",
  "IT",
  "Oil & Gas",
  "FMCG",
  "Automobile",
  "Metals",
  "Pharmaceuticals",
  "Construction",
  "Power",
  "Telecommunication",
]

// Helper function to generate random stock data
const generateConstituents = (count: number, basePrice: number): IndexConstituent[] => {
  const constituents: IndexConstituent[] = []
  for (let i = 0; i < count; i++) {
    const price = basePrice * (1 + (Math.random() - 0.5) * 0.2)
    const change = (Math.random() - 0.5) * price * 0.1
    const changePercent = (change / (price - change)) * 100
    const sector = sectors[Math.floor(Math.random() * sectors.length)]
    const weight = 100 / count
    const symbol = `STOCK${i + 1}`
    const name = `Company ${i + 1} Ltd.`
    constituents.push({ symbol, name, weight, price, change, changePercent, sector })
  }
  return constituents
}

const initialMarketData: MarketIndex[] = [
  {
    id: "NIFTY_50",
    name: "NIFTY 50",
    exchange: "NSE",
    price: 23500,
    change: 0,
    changePercent: 0,
    open: 23450,
    high: 23550,
    low: 23400,
    volume: 250_000_000,
    marketCap: "₹150T",
    constituents: generateConstituents(50, 1500),
  },
  {
    id: "SENSEX",
    name: "S&P BSE SENSEX",
    exchange: "BSE",
    price: 77000,
    change: 0,
    changePercent: 0,
    open: 76800,
    high: 77100,
    low: 76700,
    volume: 50_000_000,
    marketCap: "₹140T",
    constituents: generateConstituents(30, 2500),
  },
  {
    id: "NIFTY_BANK",
    name: "NIFTY BANK",
    exchange: "NSE",
    price: 51000,
    change: 0,
    changePercent: 0,
    open: 50800,
    high: 51100,
    low: 50700,
    volume: 100_000_000,
    marketCap: "₹30T",
    constituents: generateConstituents(12, 1000),
  },
  {
    id: "BSE_MIDCAP",
    name: "S&P BSE MidCap",
    exchange: "BSE",
    price: 45000,
    change: 0,
    changePercent: 0,
    open: 44900,
    high: 45100,
    low: 44800,
    volume: 80_000_000,
    marketCap: "₹25T",
    constituents: generateConstituents(100, 500),
  },
]

let marketData: MarketIndex[] = JSON.parse(JSON.stringify(initialMarketData))

// Simulate real-time updates
const updateMarketData = () => {
  marketData = marketData.map((index) => {
    const changeFactor = (Math.random() - 0.5) * 0.001 // Small random change
    const priceChange = index.price * changeFactor
    const newPrice = index.price + priceChange

    return {
      ...index,
      price: newPrice,
      change: newPrice - index.open,
      changePercent: ((newPrice - index.open) / index.open) * 100,
      high: Math.max(index.high, newPrice),
      low: Math.min(index.low, newPrice),
      volume: index.volume + Math.floor(Math.random() * 10000),
    }
  })
}

// Simulate market being open from 9:15 AM to 3:30 PM IST
const isMarketOpen = () => {
  const now = new Date()
  const istOffset = 330 // IST is UTC+5:30
  const istTime = new Date(now.getTime() + istOffset * 60 * 1000)
  const day = istTime.getUTCDay()
  const hours = istTime.getUTCHours()
  const minutes = istTime.getUTCMinutes()

  if (day === 0 || day === 6) return false // Sunday or Saturday

  const timeInMinutes = hours * 60 + minutes
  const marketOpenTime = 9 * 60 + 15
  const marketCloseTime = 15 * 60 + 30

  return timeInMinutes >= marketOpenTime && timeInMinutes <= marketCloseTime
}

class NSEBSEDataService {
  private indices: Map<string, IndexData> = new Map()
  private updateInterval: NodeJS.Timeout | null = null
  private subscribers: Set<(data: IndexData[]) => void> = new Set()

  constructor() {
    this.initializeIndices()
    this.startRealTimeUpdates()
  }

  private initializeIndices() {
    // NSE Indices
    const nseIndices: Omit<IndexData, "price" | "change" | "changePercent" | "high" | "low" | "open" | "volume">[] = [
      {
        symbol: "NIFTY50",
        name: "NIFTY 50",
        exchange: "NSE",
        sector: "Broad Market",
        constituents: [
          {
            symbol: "RELIANCE",
            name: "Reliance Industries",
            price: 2450,
            change: 25,
            changePercent: 1.03,
            weight: 10.2,
            sector: "Energy",
            marketCap: 1650000,
          },
          {
            symbol: "TCS",
            name: "Tata Consultancy Services",
            price: 3520,
            change: -15,
            changePercent: -0.42,
            weight: 8.5,
            sector: "IT",
            marketCap: 1280000,
          },
          {
            symbol: "HDFCBANK",
            name: "HDFC Bank",
            price: 1580,
            change: 12,
            changePercent: 0.77,
            weight: 7.8,
            sector: "Banking",
            marketCap: 1200000,
          },
          {
            symbol: "INFY",
            name: "Infosys",
            price: 1420,
            change: -8,
            changePercent: -0.56,
            weight: 6.2,
            sector: "IT",
            marketCap: 590000,
          },
          {
            symbol: "ICICIBANK",
            name: "ICICI Bank",
            price: 950,
            change: 18,
            changePercent: 1.93,
            weight: 5.9,
            sector: "Banking",
            marketCap: 665000,
          },
        ],
      },
      {
        symbol: "BANKNIFTY",
        name: "BANK NIFTY",
        exchange: "NSE",
        sector: "Banking",
        constituents: [
          {
            symbol: "HDFCBANK",
            name: "HDFC Bank",
            price: 1580,
            change: 12,
            changePercent: 0.77,
            weight: 25.2,
            sector: "Banking",
            marketCap: 1200000,
          },
          {
            symbol: "ICICIBANK",
            name: "ICICI Bank",
            price: 950,
            change: 18,
            changePercent: 1.93,
            weight: 22.8,
            sector: "Banking",
            marketCap: 665000,
          },
          {
            symbol: "KOTAKBANK",
            name: "Kotak Mahindra Bank",
            price: 1720,
            change: -5,
            changePercent: -0.29,
            weight: 12.5,
            sector: "Banking",
            marketCap: 340000,
          },
          {
            symbol: "SBIN",
            name: "State Bank of India",
            price: 580,
            change: 8,
            changePercent: 1.4,
            weight: 11.2,
            sector: "Banking",
            marketCap: 515000,
          },
        ],
      },
      {
        symbol: "NIFTYIT",
        name: "NIFTY IT",
        exchange: "NSE",
        sector: "Information Technology",
        constituents: [
          {
            symbol: "TCS",
            name: "Tata Consultancy Services",
            price: 3520,
            change: -15,
            changePercent: -0.42,
            weight: 18.5,
            sector: "IT",
            marketCap: 1280000,
          },
          {
            symbol: "INFY",
            name: "Infosys",
            price: 1420,
            change: -8,
            changePercent: -0.56,
            weight: 16.2,
            sector: "IT",
            marketCap: 590000,
          },
          {
            symbol: "HCLTECH",
            name: "HCL Technologies",
            price: 1180,
            change: 22,
            changePercent: 1.9,
            weight: 12.8,
            sector: "IT",
            marketCap: 320000,
          },
          {
            symbol: "WIPRO",
            name: "Wipro",
            price: 420,
            change: -3,
            changePercent: -0.71,
            weight: 8.5,
            sector: "IT",
            marketCap: 230000,
          },
        ],
      },
      {
        symbol: "NIFTYAUTO",
        name: "NIFTY AUTO",
        exchange: "NSE",
        sector: "Automobile",
        constituents: [
          {
            symbol: "MARUTI",
            name: "Maruti Suzuki",
            price: 10200,
            change: 150,
            changePercent: 1.49,
            weight: 15.2,
            sector: "Auto",
            marketCap: 308000,
          },
          {
            symbol: "M&M",
            name: "Mahindra & Mahindra",
            price: 1450,
            change: 25,
            changePercent: 1.75,
            weight: 12.8,
            sector: "Auto",
            marketCap: 180000,
          },
          {
            symbol: "TATAMOTORS",
            name: "Tata Motors",
            price: 720,
            change: -12,
            changePercent: -1.64,
            weight: 11.5,
            sector: "Auto",
            marketCap: 265000,
          },
        ],
      },
      {
        symbol: "NIFTYPHARMA",
        name: "NIFTY PHARMA",
        exchange: "NSE",
        sector: "Pharmaceuticals",
        constituents: [
          {
            symbol: "SUNPHARMA",
            name: "Sun Pharmaceutical",
            price: 1120,
            change: 18,
            changePercent: 1.63,
            weight: 18.2,
            sector: "Pharma",
            marketCap: 268000,
          },
          {
            symbol: "DRREDDY",
            name: "Dr. Reddy's Labs",
            price: 5200,
            change: -45,
            changePercent: -0.86,
            weight: 15.8,
            sector: "Pharma",
            marketCap: 86500,
          },
          {
            symbol: "CIPLA",
            name: "Cipla",
            price: 1380,
            change: 22,
            changePercent: 1.62,
            weight: 12.5,
            sector: "Pharma",
            marketCap: 111000,
          },
        ],
      },
    ]

    // BSE Indices
    const bseIndices: Omit<IndexData, "price" | "change" | "changePercent" | "high" | "low" | "open" | "volume">[] = [
      {
        symbol: "SENSEX",
        name: "S&P BSE SENSEX",
        exchange: "BSE",
        sector: "Broad Market",
        constituents: [
          {
            symbol: "RELIANCE",
            name: "Reliance Industries",
            price: 2450,
            change: 25,
            changePercent: 1.03,
            weight: 9.8,
            sector: "Energy",
            marketCap: 1650000,
          },
          {
            symbol: "TCS",
            name: "Tata Consultancy Services",
            price: 3520,
            change: -15,
            changePercent: -0.42,
            weight: 8.2,
            sector: "IT",
            marketCap: 1280000,
          },
          {
            symbol: "HDFCBANK",
            name: "HDFC Bank",
            price: 1580,
            change: 12,
            changePercent: 0.77,
            weight: 7.5,
            sector: "Banking",
            marketCap: 1200000,
          },
          {
            symbol: "INFY",
            name: "Infosys",
            price: 1420,
            change: -8,
            changePercent: -0.56,
            weight: 6.0,
            sector: "IT",
            marketCap: 590000,
          },
        ],
      },
      {
        symbol: "BSE100",
        name: "S&P BSE 100",
        exchange: "BSE",
        sector: "Large Cap",
        constituents: [
          {
            symbol: "RELIANCE",
            name: "Reliance Industries",
            price: 2450,
            change: 25,
            changePercent: 1.03,
            weight: 8.5,
            sector: "Energy",
            marketCap: 1650000,
          },
          {
            symbol: "TCS",
            name: "Tata Consultancy Services",
            price: 3520,
            change: -15,
            changePercent: -0.42,
            weight: 7.2,
            sector: "IT",
            marketCap: 1280000,
          },
        ],
      },
      {
        symbol: "BSE200",
        name: "S&P BSE 200",
        exchange: "BSE",
        sector: "Mid Cap",
        constituents: [
          {
            symbol: "BAJFINANCE",
            name: "Bajaj Finance",
            price: 6800,
            change: 85,
            changePercent: 1.27,
            weight: 4.2,
            sector: "Financial Services",
            marketCap: 420000,
          },
          {
            symbol: "ASIANPAINT",
            name: "Asian Paints",
            price: 3200,
            change: -25,
            changePercent: -0.77,
            weight: 3.8,
            sector: "Consumer Goods",
            marketCap: 307000,
          },
        ],
      },
      {
        symbol: "BSEMIDCAP",
        name: "S&P BSE MidCap",
        exchange: "BSE",
        sector: "Mid Cap",
        constituents: [
          {
            symbol: "GODREJCP",
            name: "Godrej Consumer Products",
            price: 1150,
            change: 15,
            changePercent: 1.32,
            weight: 2.8,
            sector: "FMCG",
            marketCap: 117000,
          },
          {
            symbol: "PIDILITIND",
            name: "Pidilite Industries",
            price: 2450,
            change: -18,
            changePercent: -0.73,
            weight: 2.5,
            sector: "Chemicals",
            marketCap: 118000,
          },
        ],
      },
      {
        symbol: "BSESMALLCAP",
        name: "S&P BSE SmallCap",
        exchange: "BSE",
        sector: "Small Cap",
        constituents: [
          {
            symbol: "DIXON",
            name: "Dixon Technologies",
            price: 4200,
            change: 120,
            changePercent: 2.94,
            weight: 1.2,
            sector: "Electronics",
            marketCap: 25000,
          },
          {
            symbol: "CAMS",
            name: "Computer Age Management Services",
            price: 2800,
            change: -45,
            changePercent: -1.58,
            weight: 1.0,
            sector: "Financial Services",
            marketCap: 13200,
          },
        ],
      },
    ]

    // Initialize with base prices and calculate derived values
    const allIndices = [...nseIndices, ...bseIndices]

    allIndices.forEach((indexBase) => {
      const basePrice = this.getBasePriceForIndex(indexBase.symbol)
      const volatility = this.getVolatilityForIndex(indexBase.symbol)

      const index: IndexData = {
        ...indexBase,
        price: basePrice,
        change: 0,
        changePercent: 0,
        high: basePrice * (1 + volatility),
        low: basePrice * (1 - volatility),
        open: basePrice * (1 + (Math.random() - 0.5) * volatility * 0.5),
        volume: this.getVolumeForIndex(indexBase.symbol),
        marketCap: this.getMarketCapForIndex(indexBase.symbol),
      }

      this.indices.set(indexBase.symbol, index)
    })
  }

  private getBasePriceForIndex(symbol: string): number {
    const basePrices: Record<string, number> = {
      NIFTY50: 21500,
      BANKNIFTY: 46800,
      NIFTYIT: 32400,
      NIFTYAUTO: 16200,
      NIFTYPHARMA: 14800,
      SENSEX: 71200,
      BSE100: 18500,
      BSE200: 9800,
      BSEMIDCAP: 28500,
      BSESMALLCAP: 32100,
    }
    return basePrices[symbol] || 10000
  }

  private getVolatilityForIndex(symbol: string): number {
    const volatilities: Record<string, number> = {
      NIFTY50: 0.015,
      BANKNIFTY: 0.025,
      NIFTYIT: 0.02,
      NIFTYAUTO: 0.022,
      NIFTYPHARMA: 0.018,
      SENSEX: 0.015,
      BSE100: 0.016,
      BSE200: 0.018,
      BSEMIDCAP: 0.025,
      BSESMALLCAP: 0.03,
    }
    return volatilities[symbol] || 0.02
  }

  private getVolumeForIndex(symbol: string): number {
    const volumes: Record<string, number> = {
      NIFTY50: 125000000,
      BANKNIFTY: 85000000,
      NIFTYIT: 45000000,
      NIFTYAUTO: 32000000,
      NIFTYPHARMA: 28000000,
      SENSEX: 95000000,
      BSE100: 65000000,
      BSE200: 42000000,
      BSEMIDCAP: 38000000,
      BSESMALLCAP: 25000000,
    }
    return volumes[symbol] || 10000000
  }

  private getMarketCapForIndex(symbol: string): string {
    const marketCaps: Record<string, string> = {
      NIFTY50: "₹155T",
      BANKNIFTY: "₹42T",
      NIFTYIT: "₹38T",
      NIFTYAUTO: "₹12T",
      NIFTYPHARMA: "₹85T",
      SENSEX: "₹128T",
      BSE100: "₹85T",
      BSE200: "₹52T",
      BSEMIDCAP: "₹28T",
      BSESMALLCAP: "₹15T",
    }
    return marketCaps[symbol] || "₹1T"
  }

  private startRealTimeUpdates() {
    this.updateInterval = setInterval(() => {
      this.updatePrices()
      this.notifySubscribers()
    }, 5000) // Update every 5 seconds
  }

  private updatePrices() {
    const marketStatus = this.getMarketStatus()

    this.indices.forEach((index, symbol) => {
      const volatility = this.getVolatilityForIndex(symbol)
      const changePercent = (Math.random() - 0.5) * volatility * 2

      // Reduce volatility when market is closed
      const adjustedChangePercent = marketStatus.isOpen ? changePercent : changePercent * 0.3

      const newPrice = index.price * (1 + adjustedChangePercent)
      const change = newPrice - index.price

      // Update high/low
      const newHigh = Math.max(index.high, newPrice)
      const newLow = Math.min(index.low, newPrice)

      this.indices.set(symbol, {
        ...index,
        price: Math.round(newPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(adjustedChangePercent * 10000) / 100,
        high: Math.round(newHigh * 100) / 100,
        low: Math.round(newLow * 100) / 100,
        volume: index.volume + Math.floor(Math.random() * 1000000),
      })

      // Update constituents
      if (index.constituents) {
        index.constituents.forEach((stock) => {
          const stockChangePercent = (Math.random() - 0.5) * volatility * 1.5
          const stockChange = stock.price * stockChangePercent
          stock.price = Math.round((stock.price + stockChange) * 100) / 100
          stock.change = Math.round(stockChange * 100) / 100
          stock.changePercent = Math.round(stockChangePercent * 10000) / 100
        })
      }
    })
  }

  private notifySubscribers() {
    const data = Array.from(this.indices.values())
    this.subscribers.forEach((callback) => callback(data))
  }

  public subscribe(callback: (data: IndexData[]) => void): () => void {
    this.subscribers.add(callback)

    // Send initial data
    callback(Array.from(this.indices.values()))

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback)
    }
  }

  public getAllIndices(): IndexData[] {
    return Array.from(this.indices.values())
  }

  public getIndicesByExchange(exchange: "NSE" | "BSE"): IndexData[] {
    return Array.from(this.indices.values()).filter((index) => index.exchange === exchange)
  }

  public getIndexBySymbol(symbol: string): IndexData | undefined {
    return this.indices.get(symbol)
  }

  public getIndicesBySector(sector: string): IndexData[] {
    return Array.from(this.indices.values()).filter((index) =>
      index.sector?.toLowerCase().includes(sector.toLowerCase()),
    )
  }

  public getMarketStatus(): MarketStatus {
    const now = new Date()
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    const currentHour = istTime.getHours()
    const currentMinute = istTime.getMinutes()
    const currentTime = currentHour * 60 + currentMinute

    // Market hours: 9:15 AM to 3:30 PM IST
    const marketOpen = 9 * 60 + 15 // 9:15 AM
    const marketClose = 15 * 60 + 30 // 3:30 PM

    const isWeekday = istTime.getDay() >= 1 && istTime.getDay() <= 5
    const isMarketHours = currentTime >= marketOpen && currentTime <= marketClose

    return {
      isOpen: isWeekday && isMarketHours,
      timezone: "Asia/Kolkata",
      nextOpen:
        !isWeekday || currentTime > marketClose
          ? "Next Monday 9:15 AM"
          : currentTime < marketOpen
            ? "Today 9:15 AM"
            : undefined,
      nextClose: isWeekday && currentTime < marketClose ? "Today 3:30 PM" : undefined,
    }
  }

  public destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    this.subscribers.clear()
  }
}

export const nseBseDataService = new NSEBSEDataService()

export const marketDataService = {
  getIndices: (): MarketIndex[] => {
    return marketData
  },
  getIndexById: (id: string): MarketIndex | undefined => {
    return marketData.find((index) => index.id === id)
  },
  isMarketOpen,
  subscribe: (callback: (data: MarketIndex[]) => void) => {
    const intervalId = setInterval(() => {
      if (isMarketOpen()) {
        callback(marketData)
      }
    }, 5000)
    return () => clearInterval(intervalId)
  },
}
