
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TradeStats } from "@/types/forex";
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface PerformanceChartProps {
  stats: TradeStats;
}

export function PerformanceChart({ stats }: PerformanceChartProps) {
  // Prepare data for the chart
  const chartData = [
    {
      name: "Win Rate",
      value: stats.winRate,
      color: stats.winRate >= 50 ? "#10B981" : "#EF4444"
    },
    {
      name: "Profit",
      value: stats.totalProfit,
      color: stats.totalProfit >= 0 ? "#10B981" : "#EF4444"
    },
    {
      name: "Trades",
      value: stats.totalTrades,
      color: "#8B5CF6"
    },
    {
      name: "Avg Profit",
      value: stats.averageProfit,
      color: stats.averageProfit >= 0 ? "#10B981" : "#EF4444"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "Win Rate") return [`${value.toFixed(2)}%`, name];
                return [value.toFixed(2), name];
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
