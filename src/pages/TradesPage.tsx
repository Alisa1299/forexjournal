
import { TradeList } from "@/components/dashboard/TradeList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useTrades } from "@/contexts/TradeContext";
import { Trade } from "@/types/forex";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const TradesPage = () => {
  const { trades } = useTrades();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<string>("all");
  
  // Filter trades based on search term and filter
  const filteredTrades = trades.filter(trade => {
    // Search term filter
    const matchesSearch = 
      trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.setupType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    const matchesFilter = 
      filterBy === "all" ||
      (filterBy === "win" && trade.status === "win") ||
      (filterBy === "loss" && trade.status === "loss") ||
      (filterBy === "breakeven" && trade.status === "breakeven");
    
    return matchesSearch && matchesFilter;
  });
  
  // Sort trades by date (most recent first)
  const sortedTrades = [...filteredTrades].sort((a, b) => 
    new Date(b.exitDate).getTime() - new Date(a.exitDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trade Journal</h1>
          <p className="text-muted-foreground">View and manage your trading history.</p>
        </div>
        <Button asChild>
          <Link to="/add-trade">
            <Plus className="mr-2 h-4 w-4" />
            Add Trade
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Trades</CardTitle>
          <CardDescription>
            Search and filter your trading history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trades..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={filterBy}
              onValueChange={setFilterBy}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="win">Winning Trades</SelectItem>
                <SelectItem value="loss">Losing Trades</SelectItem>
                <SelectItem value="breakeven">Breakeven Trades</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TradeList trades={sortedTrades} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TradesPage;
