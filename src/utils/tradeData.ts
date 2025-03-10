
import { Trade, TradeStats } from '../types/forex';

// Mock data for initial trades
const sampleTrades: Trade[] = [
  {
    id: '1',
    pair: 'EUR/USD',
    direction: 'buy',
    entryPrice: 1.0850,
    exitPrice: 1.0920,
    status: 'win',
    pips: 70,
    profit: 70,
    size: 1,
    entryDate: '2023-06-10T09:30:00Z',
    exitDate: '2023-06-10T14:45:00Z',
    setupType: 'Trend Continuation',
    notes: 'Strong bullish momentum after support level held.',
    images: ['/placeholder.svg'],
    tags: ['trend', 'support']
  },
  {
    id: '2',
    pair: 'GBP/JPY',
    direction: 'sell',
    entryPrice: 185.75,
    exitPrice: 184.80,
    status: 'win',
    pips: 95,
    profit: 95,
    size: 1,
    entryDate: '2023-06-12T12:15:00Z',
    exitDate: '2023-06-13T10:30:00Z',
    setupType: 'Reversal',
    notes: 'Sold at resistance with bearish engulfing pattern.',
    images: ['/placeholder.svg'],
    tags: ['reversal', 'resistance']
  },
  {
    id: '3',
    pair: 'USD/JPY',
    direction: 'buy',
    entryPrice: 143.20,
    exitPrice: 142.75,
    status: 'loss',
    pips: -45,
    profit: -45,
    size: 1,
    entryDate: '2023-06-15T08:45:00Z',
    exitDate: '2023-06-15T16:30:00Z',
    setupType: 'Breakout',
    notes: 'False breakout, market quickly reversed.',
    images: ['/placeholder.svg'],
    tags: ['breakout', 'fakeout']
  },
  {
    id: '4',
    pair: 'AUD/USD',
    direction: 'sell',
    entryPrice: 0.6780,
    exitPrice: 0.6690,
    status: 'win',
    pips: 90,
    profit: 90,
    size: 1,
    entryDate: '2023-06-18T22:00:00Z',
    exitDate: '2023-06-19T06:15:00Z',
    setupType: 'News Event',
    notes: 'Sold after poor economic data from Australia.',
    images: ['/placeholder.svg'],
    tags: ['news', 'fundamentals']
  },
  {
    id: '5',
    pair: 'EUR/GBP',
    direction: 'buy',
    entryPrice: 0.8540,
    exitPrice: 0.8540,
    status: 'breakeven',
    pips: 0,
    profit: 0,
    size: 1,
    entryDate: '2023-06-20T14:30:00Z',
    exitDate: '2023-06-20T17:45:00Z',
    setupType: 'Range Trading',
    notes: 'Market lacked direction, closed at breakeven.',
    images: ['/placeholder.svg'],
    tags: ['range', 'consolidation']
  }
];

// Local storage key
const TRADES_STORAGE_KEY = 'forex-journal-trades';

// Load trades from localStorage or use sample data
export const loadTrades = (): Trade[] => {
  const storedTrades = localStorage.getItem(TRADES_STORAGE_KEY);
  return storedTrades ? JSON.parse(storedTrades) : sampleTrades;
};

// Save trades to localStorage
export const saveTrades = (trades: Trade[]): void => {
  localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
};

// Generate trade stats from trades
export const generateTradeStats = (trades: Trade[]): TradeStats => {
  if (!trades.length) {
    return {
      totalTrades: 0,
      winRate: 0,
      totalProfit: 0,
      averageProfit: 0,
      biggestWin: 0,
      biggestLoss: 0,
      profitFactor: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0
    };
  }

  const wins = trades.filter(trade => trade.status === 'win');
  const losses = trades.filter(trade => trade.status === 'loss');
  
  const winCount = wins.length;
  const totalTrades = trades.length;
  const winRate = (winCount / totalTrades) * 100;
  
  const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
  const averageProfit = totalProfit / totalTrades;
  
  const biggestWin = Math.max(...trades.map(t => t.profit), 0);
  const biggestLoss = Math.min(...trades.map(t => t.profit), 0);
  
  const totalGain = wins.reduce((sum, trade) => sum + trade.profit, 0);
  const totalLoss = Math.abs(losses.reduce((sum, trade) => sum + trade.profit, 0));
  const profitFactor = totalLoss === 0 ? totalGain : totalGain / totalLoss;
  
  // Calculate max consecutive wins/losses
  let currentWinStreak = 0;
  let maxWinStreak = 0;
  let currentLossStreak = 0;
  let maxLossStreak = 0;
  
  trades.forEach(trade => {
    if (trade.status === 'win') {
      currentWinStreak++;
      currentLossStreak = 0;
      if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
    } else if (trade.status === 'loss') {
      currentLossStreak++;
      currentWinStreak = 0;
      if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
    } else {
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
  });
  
  return {
    totalTrades,
    winRate: parseFloat(winRate.toFixed(2)),
    totalProfit: parseFloat(totalProfit.toFixed(2)),
    averageProfit: parseFloat(averageProfit.toFixed(2)),
    biggestWin: parseFloat(biggestWin.toFixed(2)),
    biggestLoss: parseFloat(biggestLoss.toFixed(2)),
    profitFactor: parseFloat(profitFactor.toFixed(2)),
    consecutiveWins: maxWinStreak,
    consecutiveLosses: maxLossStreak
  };
};
