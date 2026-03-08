import { Building2, Wifi, FileCode2, FileText } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { certificateAuthorities } from "@/data/mockData";
import { Button } from "@/components/ui/button";

export default function CaManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Certificate Authority</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage Certificate Authority connections</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Discover CAs</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Active CAs" value={certificateAuthorities.filter(ca => ca.status === 'Online').length} icon={Building2} glow="green" />
        <StatCard title="Connection Issues" value={certificateAuthorities.filter(ca => ca.status !== 'Online').length} icon={Wifi} glow="orange" />
        <StatCard title="Total CAs" value={certificateAuthorities.length} icon={Building2} glow="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {certificateAuthorities.map((ca, i) => (
          <div key={ca.id} className={`glass-card-hover p-6 animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{ca.commonName}</h3>
                  <p className="text-xs text-muted-foreground">{ca.hostname}</p>
                </div>
              </div>
              <StatusBadge status={ca.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground">{ca.type}</span></div>
              <div><span className="text-muted-foreground">Templates:</span> <span className="text-foreground">{ca.templateCount}</span></div>
              <div><span className="text-muted-foreground">Issued:</span> <span className="text-foreground">{ca.issuedCount.toLocaleString()}</span></div>
              <div><span className="text-muted-foreground">Last Sync:</span> <span className="text-foreground text-xs">{new Date(ca.lastSync).toLocaleDateString()}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
