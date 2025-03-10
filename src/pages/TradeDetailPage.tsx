
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useTrades } from "@/contexts/TradeContext";
import { TradeDirection, TradeStatus } from "@/types/forex";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TradeForm } from "@/components/trades/TradeForm";

const TradeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getTrade, deleteTrade, updateTrade } = useTrades();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const trade = getTrade(id || "");
  
  if (!trade) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Trade Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The trade you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <Link to="/trades">Back to Trades</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteTrade(trade.id);
    navigate("/trades");
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
      return format(new Date(dateString), 'PPP HH:mm');
    } catch (error) {
      return dateString;
    }
  };
  
  const handleUpdate = (data: Omit<any, "id">) => {
    updateTrade({ ...data, id: trade.id });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {trade.pair} {trade.direction.toUpperCase()}
          </h1>
          <p className="text-muted-foreground">
            {formatDate(trade.entryDate)}
          </p>
        </div>
        <div className="flex space-x-2">
          {!isEditing && (
            <>
              <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="text-forex-danger">
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Trade</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this trade? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-forex-danger text-white hover:bg-forex-danger/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          
          {isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel Editing
            </Button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeForm initialData={trade} onSubmit={handleUpdate} isEditing />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trade Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Direction</span>
                    <div className="flex items-center">
                      {trade.direction === 'buy' ? (
                        <ArrowUp className="mr-2 h-4 w-4 text-forex-success" />
                      ) : (
                        <ArrowDown className="mr-2 h-4 w-4 text-forex-danger" />
                      )}
                      <span className="font-medium capitalize">{trade.direction}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Result</span>
                    <span className={`font-medium capitalize ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit/Loss</span>
                    <span className={`font-medium ${getStatusColor(trade.status)}`}>
                      {trade.profit > 0 ? '+' : ''}{trade.profit}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pips</span>
                    <span className={`font-medium ${getStatusColor(trade.status)}`}>
                      {trade.pips > 0 ? '+' : ''}{trade.pips *0.01}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Setup Type</span>
                    <span className="font-medium">{trade.setupType}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position Size</span>
                    <span className="font-medium">{trade.size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Entry & Exit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Price</span>
                    <span className="font-medium">{trade.entryPrice}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exit Price</span>
                    <span className="font-medium">{trade.exitPrice}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Date</span>
                    <span className="font-medium">{formatDate(trade.entryDate)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exit Date</span>
                    <span className="font-medium">{formatDate(trade.exitDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trade.tags.length > 0 ? (
                    trade.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No tags added</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {trade.notes ? (
                <p className="whitespace-pre-line">{trade.notes}</p>
              ) : (
                <p className="text-muted-foreground">No notes added</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Images & Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trade.images.length > 0 ? (
                  trade.images.map((image, index) => (
                    <div key={index} className="aspect-video rounded-md overflow-hidden border">
                      <img
                        src={image}
                        alt={`Trade chart ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full">No images added</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TradeDetailPage;
