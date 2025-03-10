export type TradeDirection = 'buy' | 'sell';
export type TradeStatus = 'win' | 'loss' | 'breakeven';

export interface Trade {
  id: string;
  pair: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number;
  status: TradeStatus;
  pips: number;
  profit: number;
  size: number;
  entryDate: string;
  exitDate: string;
  setupType: string;
  notes: string;
  images: string[];
  tags: string[];
  preTradeEmotion?: string;
  postTradeEmotion?: string;
}

export interface TradeStats {
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
  biggestWin: number;
  biggestLoss: number;
  profitFactor: number;
  consecutiveWins: number;
  consecutiveLosses: number;
}
