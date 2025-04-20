export interface ICurrentExchangeDto {
  exchangeRate: number,
  fromSymbol: string,
  lastUpdatedAt: Date,
  rateLimitExceeded: boolean,
  success: boolean,
  toSymbol: string
}

export interface ICurrentExchange {
  exchangeRate: number,
  fromSymbol: string,
  toSymbol: string
  lastUpdatedAt: Date,
}

export interface IDailyExchangeDto {
  data: {
    close: number,
    date: Date,
    high: number,
    low: number,
    open: number
  }[]
}

export interface IDailyExchange {
  close: number,
  date: Date,
  high: number,
  low: number,
  open: number,
  closeDiff: number
}

