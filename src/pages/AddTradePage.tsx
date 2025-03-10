
import { TradeForm } from "@/components/trades/TradeForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrades } from "@/contexts/TradeContext";
import { Trade } from "@/types/forex";
import { useNavigate } from "react-router-dom";

const AddTradePage = () => {
  const { addTrade } = useTrades();
  const navigate = useNavigate();
  
  const handleSubmit = (data: Omit<Trade, "id" | "pips" | "profit" | "images">) => {
    addTrade(data);
    navigate("/trades");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Trade</h1>
        <p className="text-muted-foreground">Record a new trade in your journal.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Trade Details</CardTitle>
          <CardDescription>
            Enter the details of your trade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TradeForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTradePage;
