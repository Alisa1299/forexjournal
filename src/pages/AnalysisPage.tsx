
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrades } from "@/contexts/TradeContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

const AnalysisPage = () => {
  const { trades, stats } = useTrades();
  
  // Calculate win/loss ratio for pie chart
  const winCount = trades.filter(t => t.status === 'win').length;
  const lossCount = trades.filter(t => t.status === 'loss').length;
  const breakevenCount = trades.filter(t => t.status === 'breakeven').length;
  
  const resultData = [
    { name: 'Wins', value: winCount, color: '#10B981' },
    { name: 'Losses', value: lossCount, color: '#EF4444' },
    { name: 'Breakeven', value: breakevenCount, color: '#6B7280' }
  ];
  
  // Calculate currency pair performance
  const pairPerformance = trades.reduce((acc: Record<string, { profit: number, count: number }>, trade) => {
    if (!acc[trade.pair]) {
      acc[trade.pair] = { profit: 0, count: 0 };
    }
    acc[trade.pair].profit += trade.profit;
    acc[trade.pair].count += 1;
    return acc;
  }, {});
  
  // Convert to array and sort by profit
  const pairData = Object.entries(pairPerformance)
    .map(([pair, { profit, count }]) => ({
      pair,
      profit,
      count
    }))
    .sort((a, b) => b.profit - a.profit);
  
  // Calculate setup type performance
  const setupPerformance = trades.reduce((acc: Record<string, { profit: number, count: number }>, trade) => {
    if (!acc[trade.setupType]) {
      acc[trade.setupType] = { profit: 0, count: 0 };
    }
    acc[trade.setupType].profit += trade.profit;
    acc[trade.setupType].count += 1;
    return acc;
  }, {});
  
  // Convert to array and sort by profit
  const setupData = Object.entries(setupPerformance)
    .map(([setup, { profit, count }]) => ({
      setup,
      profit,
      count
    }))
    .sort((a, b) => b.profit - a.profit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trade Analysis</h1>
        <p className="text-muted-foreground">Analyze your trading performance to identify patterns.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Win/Loss Ratio</CardTitle>
            <CardDescription>
              Distribution of your trade outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resultData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {resultData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} trades`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Currency Pair Performance</CardTitle>
            <CardDescription>
              Profit/loss breakdown by currency pair
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pairData}>
                  <XAxis dataKey="pair" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'profit') return [`${value.toFixed(2)}`, 'Profit/Loss'];
                      return [value, name];
                    }}
                  />
                  <Bar 
                    dataKey="profit" 
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Setup Type Analysis</CardTitle>
            <CardDescription>
              Performance by trade setup strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={setupData}>
                  <XAxis dataKey="setup" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'profit') return [`${value.toFixed(2)}`, 'Profit/Loss'];
                      if (name === 'count') return [`${value}`, 'Number of Trades'];
                      return [value, name];
                    }}
                  />
                  <Bar 
                    dataKey="profit" 
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trading Summary</CardTitle>
            <CardDescription>
              Overall trading statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="forex-stat-card">
                  <span className="forex-stat-label">Win Rate</span>
                  <span className="forex-stat-value text-forex-success">{stats.winRate}%</span>
                </div>
                <div className="forex-stat-card">
                  <span className="forex-stat-label">Profit Factor</span>
                  <span className="forex-stat-value">{stats.profitFactor}</span>
                </div>
                <div className="forex-stat-card">
                  <span className="forex-stat-label">Average Profit</span>
                  <span className={`forex-stat-value ${stats.averageProfit >= 0 ? 'text-forex-success' : 'text-forex-danger'}`}>
                    {stats.averageProfit}
                  </span>
                </div>
                <div className="forex-stat-card">
                  <span className="forex-stat-label">Total Trades</span>
                  <span className="forex-stat-value">{stats.totalTrades}</span>
                </div>
              </div>
              <div className="forex-stat-card">
                <span className="forex-stat-label">Total P/L</span>
                <span className={`forex-stat-value ${stats.totalProfit >= 0 ? 'text-forex-success' : 'text-forex-danger'}`}>
                  {stats.totalProfit > 0 ? '+' : ''}{stats.totalProfit}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisPage;
