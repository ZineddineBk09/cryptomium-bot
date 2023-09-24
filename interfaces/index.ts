export interface News {
  title: string
  author: string
  lead: string
  date: string
  category: string
  image: string
  pageUrl: string
}

export interface CryptoCurrency {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: any
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number // atl = all time low
  atl_change_percentage: number
  atl_date: string
}
