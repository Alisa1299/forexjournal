
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Trade, TradeStats } from '../types/forex';
import { loadTrades, saveTrades, generateTradeStats } from '../utils/tradeData';
import { useToast } from '@/components/ui/use-toast';

interface TradeContextType {
  trades: Trade[];
  stats: TradeStats;
  addTrade: (trade: Omit<Trade, 'id'>) => void;
  updateTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  getTrade: (id: string) => Trade | undefined;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};

interface TradeProviderProps {
  children: ReactNode;
}

export const TradeProvider: React.FC<TradeProviderProps> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<TradeStats>({
    totalTrades: 0,
    winRate: 0,
    totalProfit: 0,
    averageProfit: 0,
    biggestWin: 0,
    biggestLoss: 0,
    profitFactor: 0,
    consecutiveWins: 0,
    consecutiveLosses: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load trades on initial mount
    const storedTrades = loadTrades();
    setTrades(storedTrades);
    setStats(generateTradeStats(storedTrades));
  }, []);

  useEffect(() => {
    // Update stats when trades change
    if (trades.length > 0) {
      saveTrades(trades);
      setStats(generateTradeStats(trades));
    }
  }, [trades]);

  const addTrade = (newTrade: Omit<Trade, 'id'>) => {
    const trade = {
      ...newTrade,
      id: Date.now().toString()
    };
    
    setTrades(prevTrades => {
      const updatedTrades = [trade, ...prevTrades];
      return updatedTrades;
    });
    
    toast({
      title: "Trade Added",
      description: `${newTrade.pair} ${newTrade.direction.toUpperCase()} trade has been added.`,
    });
  };

  const updateTrade = (updatedTrade: Trade) => {
    setTrades(prevTrades => {
      const updatedTrades = prevTrades.map(trade => 
        trade.id === updatedTrade.id ? updatedTrade : trade
      );
      return updatedTrades;
    });
    
    toast({
      title: "Trade Updated",
      description: `${updatedTrade.pair} trade has been updated.`,
    });
  };

  const deleteTrade = (id: string) => {
    const tradeToDelete = trades.find(trade => trade.id === id);
    
    setTrades(prevTrades => {
      const updatedTrades = prevTrades.filter(trade => trade.id !== id);
      return updatedTrades;
    });
    
    if (tradeToDelete) {
      toast({
        title: "Trade Deleted",
        description: `${tradeToDelete.pair} trade has been removed.`,
      });
    }
  };

  const getTrade = (id: string) => {
    return trades.find(trade => trade.id === id);
  };

  const value = {
    trades,
    stats,
    addTrade,
    updateTrade,
    deleteTrade,
    getTrade
  };

  return (
    <TradeContext.Provider value={value}>
      {children}
    </TradeContext.Provider>
  );
};
