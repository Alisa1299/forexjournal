import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trade, TradeDirection, TradeStatus } from "@/types/forex";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  pair: z.string().min(1, "Currency pair is required"),
  direction: z.enum(["buy", "sell"]),
  entryPrice: z.coerce.number().min(0, "Entry price must be a positive number"),
  exitPrice: z.coerce.number().min(0, "Exit price must be a positive number"),
  size: z.coerce.number().min(0.01, "Position size must be at least 0.01"),
  entryDate: z.date(),
  exitDate: z.date(),
  setupType: z.string().min(1, "Setup type is required"),
  notes: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["win", "loss", "breakeven"]),
  preTradeEmotion: z.string().optional(),
  postTradeEmotion: z.string().optional(),
  images: z.array(z.string()).optional(),
});

interface TradeFormProps {
  initialData?: Partial<Trade>;
  onSubmit: (data: Trade) => void;
  isEditing?: boolean;
}

export function TradeForm({ initialData, onSubmit, isEditing = false }: TradeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pair: initialData?.pair || "",
      direction: (initialData?.direction as TradeDirection) || "buy",
      entryPrice: initialData?.entryPrice || 0,
      exitPrice: initialData?.exitPrice || 0,
      size: initialData?.size || 1,
      entryDate: initialData?.entryDate ? new Date(initialData.entryDate) : new Date(),
      exitDate: initialData?.exitDate ? new Date(initialData.exitDate) : new Date(),
      setupType: initialData?.setupType || "",
      notes: initialData?.notes || "",
      tags: initialData?.tags?.join(", ") || "",
      status: (initialData?.status as TradeStatus) || "win",
      preTradeEmotion: initialData?.preTradeEmotion || "",
      postTradeEmotion: initialData?.postTradeEmotion || "",
      images: initialData?.images || [],
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Calculate pips and profit
    const pips = getPipDifference(values.direction, values.entryPrice, values.exitPrice);
    const profit = calculateProfit(values.direction, values.entryPrice, values.exitPrice, values.size, values.pair);
    
    // Format tags
    const tags = values.tags ? values.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [];
    
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      pair: values.pair,
      direction: values.direction,
      entryPrice: values.entryPrice,
      exitPrice: values.exitPrice,
      size: values.size,
      entryDate: values.entryDate.toISOString(),
      exitDate: values.exitDate.toISOString(),
      setupType: values.setupType,
      notes: values.notes || "",
      tags,
      pips,
      profit,
      status: values.status,
      images: values.images || [],
      preTradeEmotion: values.preTradeEmotion,
      postTradeEmotion: values.postTradeEmotion,
    });
  };

  const calculateProfit = (direction: TradeDirection, entry: number, exit: number, size: number, pair: string): number => {
    if (pair.includes("XAU")) {
      // Using MT5 gold calculation
      // 1 pip for gold (XAUUSD) is a price movement of 0.01
      // 1 lot (100 ounces) equals 1 USD per pip
      const onePip = 0.01;
      const difference = direction === "buy" ? exit - entry : entry - exit;
      
      // Calculate pip count (each 0.01 movement is 1 pip)
      const pipCount = difference / onePip;
      
      // Calculate profit: lot size × pipCount
      // Standard lot size (1.0) equals 100 ounces which equals 1 USD per pip
      return parseFloat((size * pipCount).toFixed(2));
    } else {
      const pips = getPipDifference(direction, entry, exit);
      return parseFloat((pips * size).toFixed(2));
    }
  };

  const getPipDifference = (direction: TradeDirection, entry: number, exit: number) => {
    const difference = direction === "buy" ? exit - entry : entry - exit;
    
    // Get the currency pair
    const pair = form.getValues("pair");
    
    // Calculate pips based on currency pair
    let pips = difference;
    
    if (pair.includes("JPY")) {
      // For JPY pairs, 1 pip = 0.01
      pips = difference * 100;
    } else if (pair.includes("XAU")) {
      // For gold (XAU), 1 pip = 0.01 movement
      // Example: 1000.10 to 1000.30 = 20 pips (not 0.2)
      const onePip = 0.01;
      pips = difference / onePip;
    } else if (pair.includes("XAG")) {
      // For silver, 1 pip = 0.01
      pips = difference * 100;
    } else {
      // For all other major and minor pairs, 1 pip = 0.0001
      pips = difference * 10000;
    }
    
    return parseFloat(pips.toFixed(2));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert files to base64 strings
    const imagePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            resolve(e.target.result);
          } else {
            reject(new Error('Failed to convert image'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64Images = await Promise.all(imagePromises);
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, ...base64Images]);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pair"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency Pair</FormLabel>
                <FormControl>
                  <Input placeholder="EUR/USD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="direction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direction</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="entryPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.00001" placeholder="1.0850" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="exitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exit Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.00001" placeholder="1.0920" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Size</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="1.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Result</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="win">Win</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                    <SelectItem value="breakeven">Breakeven</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="entryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Entry Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP HH:mm")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        value={format(field.value, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(field.value);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          field.onChange(newDate);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="exitDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Exit Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP HH:mm")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        value={format(field.value, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(field.value);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          field.onChange(newDate);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="setupType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setup Type</FormLabel>
                <FormControl>
                  <Input placeholder="Trend Continuation, Breakout, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="support, resistance, trend" {...field} />
                </FormControl>
                <FormDescription>
                  Separate tags with commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="preTradeEmotion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pre-Trade Emotion</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe how you felt before entering this trade..."
                    className="resize-none min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your emotional state and mindset before entering the trade
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="postTradeEmotion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post-Trade Emotion</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe how you felt after closing this trade..."
                    className="resize-none min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your emotional state and thoughts after the trade was completed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trade Screenshots</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Screenshots
                      </Button>
                    </div>
                    {field.value && field.value.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {field.value.map((image, index) => (
                          <div key={index} className="relative aspect-video">
                            <img
                              src={image}
                              alt={`Trade screenshot ${index + 1}`}
                              className="rounded-lg object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                const newImages = field.value?.filter((_, i) => i !== index);
                                form.setValue("images", newImages);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload screenshots of your trade setup and execution
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add your trade notes here..."
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full md:w-auto">
          {isEditing ? "Update Trade" : "Add Trade"}
        </Button>
      </form>
    </Form>
  );
}
