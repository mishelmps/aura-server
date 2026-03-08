import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  glow?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'cyan';
  subtitle?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, glow = 'blue', subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`glass-card p-5 glow-${glow} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-2 rounded-lg bg-secondary/50">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
