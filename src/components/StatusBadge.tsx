import { cn } from "@/lib/utils";

type StatusType = 'Online' | 'Offline' | 'Pending' | 'Valid' | 'Expiring' | 'Expired' | 'Active' | 'Revoked' | 'Degraded' | 'Critical' | 'Warning' | 'Info';

const statusConfig: Record<StatusType, { dot: string; bg: string; text: string }> = {
  Online: { dot: 'status-dot-online', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  Valid: { dot: 'status-dot-online', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  Active: { dot: 'status-dot-online', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  Offline: { dot: 'status-dot-offline', bg: 'bg-red-500/10', text: 'text-red-400' },
  Expired: { dot: 'status-dot-offline', bg: 'bg-red-500/10', text: 'text-red-400' },
  Revoked: { dot: 'status-dot-offline', bg: 'bg-red-500/10', text: 'text-red-400' },
  Critical: { dot: 'status-dot-offline', bg: 'bg-red-500/10', text: 'text-red-400' },
  Pending: { dot: 'status-dot-pending', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  Expiring: { dot: 'status-dot-warning', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  Warning: { dot: 'status-dot-warning', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  Degraded: { dot: 'status-dot-warning', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  Info: { dot: 'status-dot-online', bg: 'bg-blue-500/10', text: 'text-blue-400' },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status] || statusConfig.Info;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", config.bg, config.text)}>
      <span className={cn("status-dot", config.dot)} />
      {status}
    </span>
  );
}
