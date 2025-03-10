
import { Button } from "@/components/ui/button";
import { Trade, TradeDirection, TradeStatus } from "@/types/forex";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface TradeListProps {
  trades: Trade[];
  limit?: number;
}

export function TradeList({ trades, limit }: TradeListProps) {
  const displayTrades = limit ? trades.slice(0, limit) : trades;

  const getDirectionIcon = (direction: TradeDirection) => {
    if (direction === 'buy') return <ArrowUp className="h-4 w-4 text-forex-success" />;
    return <ArrowDown className="h-4 w-4 text-forex-danger" />;
  };

  const getStatusColor = (status: TradeStatus) => {
    switch (status) {
      case 'win': return 'text-forex-success';
      case 'loss': return 'text-forex-danger';
      case 'breakeven': return 'text-forex-neutral';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {displayTrades.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No trades found</p>
          <Button asChild className="mt-4">
            <Link to="/add-trade">Add Your First Trade</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {displayTrades.map(trade => (
              <Link
                to={`/trades/${trade.id}`}
                key={trade.id}
                className="group block"
              >
                <div className="forex-card hover:border-primary transition-colors">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {getDirectionIcon(trade.direction)}
                        <span className="font-medium">{trade.pair}</span>
                        <span className="text-sm text-muted-foreground capitalize">{trade.direction}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${getStatusColor(trade.status)}`}>
                          {trade.profit > 0 ? '+' : ''}{trade.profit}
                        </span>
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(trade.entryDate)}</span>
                      <ArrowRight className="h-4 w-4" />
                      <span>{formatDate(trade.exitDate)}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {trade.tags.map(tag => (
                        <span key={tag} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {limit && trades.length > limit && (
            <div className="text-center">
              <Button variant="outline" asChild>
                <Link to="/trades">View All Trades</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
