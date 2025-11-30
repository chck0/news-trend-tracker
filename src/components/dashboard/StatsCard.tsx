import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'positive' | 'negative' | 'neutral';
  delay?: number;
}

export const StatsCard = ({ title, value, subtitle, icon: Icon, trend, delay = 0 }: StatsCardProps) => {
  return (
    <div 
      className="glass-card p-5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className={cn(
            "text-2xl font-bold font-mono",
            trend === 'positive' && "text-positive",
            trend === 'negative' && "text-negative",
            !trend && "text-foreground"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "p-2.5 rounded-lg",
          trend === 'positive' && "bg-positive/10 text-positive",
          trend === 'negative' && "bg-negative/10 text-negative",
          !trend && "bg-primary/10 text-primary"
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
