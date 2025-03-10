
import { StatCard } from "@/components/dashboard/StatCard";
import { TradeList } from "@/components/dashboard/TradeList";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTrades } from "@/contexts/TradeContext";
import { BarChart3, LineChart, TrendingDown, TrendingUp } from "lucide-react";

const Index = () => {
  const { trades, stats } = useTrades();
  
  // Get the 5 most recent trades
  const recentTrades = [...trades].sort((a, b) => 
    new Date(b.exitDate).getTime() - new Date(a.exitDate).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your trading performance at a glance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Trades"
          value={stats.totalTrades}
          icon={<LineChart className="h-4 w-4" />}
        />
        <StatCard 
          title="Win Rate"
          value={`${stats.winRate}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={stats.winRate >= 50 ? "up" : "down"}
          trendValue={stats.winRate >= 50 ? "Good" : "Needs Improvement"}
        />
        <StatCard 
          title="Total Profit"
          value={stats.totalProfit}
          icon={<BarChart3 className="h-4 w-4" />}
          trend={stats.totalProfit >= 0 ? "up" : "down"}
          trendValue={stats.totalProfit >= 0 ? "Profitable" : "In Loss"}
        />
        <StatCard 
          title="Profit Factor"
          value={stats.profitFactor}
          icon={stats.profitFactor >= 1.5 ? 
            <TrendingUp className="h-4 w-4" /> : 
            <TrendingDown className="h-4 w-4" />
          }
          trend={stats.profitFactor >= 1.5 ? "up" : "down"}
          trendValue={stats.profitFactor >= 1.5 ? "Strong" : "Weak"}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
            <CardDescription>
              Your trading performance metrics visualized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart stats={stats} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trade Statistics</CardTitle>
            <CardDescription>
              Detailed breakdown of your trading metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biggest Win</span>
                <span className="font-medium text-forex-success">{stats.biggestWin}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biggest Loss</span>
                <span className="font-medium text-forex-danger">{stats.biggestLoss}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Profit</span>
                <span className="font-medium">{stats.averageProfit}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consecutive Wins</span>
                <span className="font-medium">{stats.consecutiveWins}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consecutive Losses</span>
                <span className="font-medium">{stats.consecutiveLosses}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>
            Your 5 most recent trades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TradeList trades={recentTrades} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
