import { useState } from "react";
import { AlertTriangle, Bell, Info, Check, X } from "lucide-react";
import { FilterPills } from "@/components/FilterPills";
import { alerts as allAlerts } from "@/data/mockData";
import type { Alert } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const severityIcon = (s: Alert['severity']) => {
  if (s === 'Critical') return <AlertTriangle className="h-5 w-5 text-red-400" />;
  if (s === 'Warning') return <Bell className="h-5 w-5 text-orange-400" />;
  return <Info className="h-5 w-5 text-blue-400" />;
};

const severityBorder = (s: Alert['severity']) => {
  if (s === 'Critical') return 'border-l-red-500';
  if (s === 'Warning') return 'border-l-orange-500';
  return 'border-l-blue-500';
};

export default function Alerts() {
  const [filter, setFilter] = useState("All");
  const [alertList, setAlertList] = useState(allAlerts);

  const filtered = alertList.filter(a => {
    if (filter === "Unacknowledged") return !a.acknowledged;
    if (filter !== "All" && a.severity !== filter) return false;
    return true;
  });

  const pillOptions = [
    { label: "All", value: "All", count: alertList.length },
    { label: "Critical", value: "Critical", count: alertList.filter(a => a.severity === 'Critical').length },
    { label: "Warning", value: "Warning", count: alertList.filter(a => a.severity === 'Warning').length },
    { label: "Info", value: "Info", count: alertList.filter(a => a.severity === 'Info').length },
    { label: "Unacknowledged", value: "Unacknowledged", count: alertList.filter(a => !a.acknowledged).length },
  ];

  const acknowledge = (id: string) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor certificate and agent alerts</p>
      </div>

      <FilterPills options={pillOptions} selected={filter} onSelect={setFilter} />

      <div className="space-y-3">
        {filtered.map((alert, i) => (
          <div key={alert.id} className={`glass-card p-4 border-l-4 ${severityBorder(alert.severity)} animate-fade-in-up`} style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex items-start gap-3">
              {severityIcon(alert.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{alert.title}</span>
                  {alert.acknowledged && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">Acknowledged</span>}
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{alert.source}</span>
                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              </div>
              {!alert.acknowledged && (
                <Button variant="ghost" size="sm" onClick={() => acknowledge(alert.id)} className="shrink-0 text-muted-foreground hover:text-foreground">
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No alerts matching filter</div>
        )}
      </div>
    </div>
  );
}
