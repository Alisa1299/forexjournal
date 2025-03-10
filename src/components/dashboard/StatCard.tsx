
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  trendValue, 
  className 
}: StatCardProps) {
  return (
    <div className={cn("forex-stat-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="forex-stat-label">{title}</p>
          <p className="forex-stat-value">{value}</p>
        </div>
        {icon && (
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            {icon}
          </div>
        )}
      </div>
      {(description || trend) && (
        <div className="flex items-center text-xs">
          {trend && (
            <span className={cn(
              "mr-1 flex items-center", 
              trend === 'up' ? "text-forex-success" : 
              trend === 'down' ? "text-forex-danger" : 
              "text-forex-neutral"
            )}>
              {trend === 'up' && <ArrowUpIcon className="mr-1 h-3 w-3" />}
              {trend === 'down' && <ArrowDownIcon className="mr-1 h-3 w-3" />}
              {trendValue}
            </span>
          )}
          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
