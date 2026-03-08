import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  glow?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'cyan' | 'pink' | 'yellow';
  subtitle?: string;
  className?: string;
}

const iconColorMap: Record<string, string> = {
  blue: 'text-blue-400',
  green: 'text-emerald-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
  cyan: 'text-cyan-400',
  pink: 'text-pink-400',
  yellow: 'text-yellow-400',
};

const valuColorMap: Record<string, string> = {
  blue: 'text-blue-300',
  green: 'text-emerald-300',
  orange: 'text-orange-300',
  red: 'text-red-300',
  purple: 'text-purple-300',
  cyan: 'text-cyan-300',
  pink: 'text-pink-300',
  yellow: 'text-yellow-300',
};

export function StatCard({ title, value, icon: Icon, glow = 'blue', subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`glass-card p-5 glow-${glow} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${valuColorMap[glow] || 'text-foreground'}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-2.5 rounded-xl bg-secondary/60">
          <Icon className={`h-5 w-5 ${iconColorMap[glow] || 'text-muted-foreground'}`} />
        </div>
      </div>
    </div>
  );
}
