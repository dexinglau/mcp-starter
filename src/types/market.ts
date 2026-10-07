export type AssetType = 'stock' | 'crypto' | 'forex' | 'index' | 'futures' | 'bond';

export interface PricePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  symbol: string;
  displaySymbol: string;
  name: string;
  type: AssetType;
  exchange: string;
  country: string;
  price: number;
  change: number;
  changePercent: number;
  prevClose: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  volumeNum: number;
  marketCap?: string;
  marketCapNum?: number;
  peRatio?: number;
  dividendYield?: string;
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  technicalScore: number; // 0 to 100
  sector?: string;
  sparkline: number[]; // 10-15 recent relative points
  lastTickDirection?: 'up' | 'down' | 'none';
  high52w: number;
  low52w: number;
  history?: {
    '1D': PricePoint[];
    '1M': PricePoint[];
    '1Y': PricePoint[];
  };
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  readTime: string;
  relatedSymbols: string[];
}

export interface TradeIdea {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isPro: boolean;
  };
  symbol: string;
  assetName: string;
  title: string;
  description: string;
  direction: 'long' | 'short' | 'neutral';
  timeframe: string;
  boosts: number;
  comments: number;
  publishedAt: string;
  patternType: 'breakout' | 'reversal' | 'wedge' | 'support_bounce';
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  marketCap: string;
  marketCapNum: number;
  price: number;
  changePercent: number;
}

export interface HeatmapSector {
  sector: string;
  weight: number;
  items: HeatmapItem[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  flag: string;
  currency: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  actual: string;
  forecast: string;
  previous: string;
}

export interface PaperTradePosition {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
}
