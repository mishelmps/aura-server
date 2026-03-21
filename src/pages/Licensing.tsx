import { useState } from "react";
import { Key, Monitor, CalendarDays, Hash, Copy, RefreshCw, CheckCircle, PackageOpen } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock data
const licenseStatus = {
  isActivated: true,
  isExpired: false,
  activeLicensedAgents: 18,
  maxLicensedAgents: 50,
  availableSlots: 32,
  expirationDate: "2026-12-31",
  generationCode: "MDCM-SRV-X7K9-4B2F-Q8W3-L5N1-R6P0-J9T2",
  activatedAt: "2025-06-15 14:30",
};

const agentRecords = [
  { hostname: "DC-SERVER-01", agentStatus: "Online" as const, isValid: true, createdAt: "2025-06-15 14:32" },
  { hostname: "WEB-PROD-03", agentStatus: "Online" as const, isValid: true, createdAt: "2025-06-16 09:10" },
  { hostname: "DB-CLUSTER-02", agentStatus: "Online" as const, isValid: true, createdAt: "2025-06-17 11:45" },
  { hostname: "APP-NODE-07", agentStatus: "Offline" as const, isValid: true, createdAt: "2025-07-01 08:20" },
  { hostname: "MAIL-RELAY-01", agentStatus: "Online" as const, isValid: true, createdAt: "2025-07-03 16:55" },
  { hostname: "DEV-BUILD-04", agentStatus: "Pending" as const, isValid: false, invalidationReason: "Machine fingerprint changed", createdAt: "2025-07-10 10:00" },
  { hostname: "PROXY-EDGE-02", agentStatus: "Online" as const, isValid: true, createdAt: "2025-07-12 13:30" },
  { hostname: "FILE-SHARE-01", agentStatus: "Offline" as const, isValid: true, createdAt: "2025-07-15 07:45" },
  { hostname: "MONITOR-HQ-01", agentStatus: "Online" as const, isValid: true, createdAt: "2025-07-20 14:12" },
  { hostname: "BACKUP-NAS-03", agentStatus: "Online" as const, isValid: false, invalidationReason: "Hardware replacement detected", createdAt: "2025-08-01 09:30" },
];

export default function Licensing() {
  const [activationCode, setActivationCode] = useState("");
  const [activating, setActivating] = useState(false);

  const status = licenseStatus.isActivated && !licenseStatus.isExpired
    ? "Active" as const
    : licenseStatus.isExpired ? "Expired" as const : "Pending" as const;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(licenseStatus.generationCode);
    toast.success("Generation code copied to clipboard");
  };

  const handleActivate = async () => {
    if (!activationCode.trim()) return;
    setActivating(true);
    await new Promise(r => setTimeout(r, 1500));
    setActivating(false);
    toast.success("License activated successfully!");
    setActivationCode("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Licensing</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage server license and agent license tracking</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            title="License Status"
            value={status}
            icon={Key}
            glow={status === "Active" ? "green" : status === "Expired" ? "red" : "yellow"}
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            title="Licensed Agents"
            value={`${licenseStatus.activeLicensedAgents} / ${licenseStatus.maxLicensedAgents}`}
            icon={Monitor}
            glow="blue"
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            title="Available Slots"
            value={licenseStatus.availableSlots}
            icon={Hash}
            glow={licenseStatus.availableSlots > 0 ? "cyan" : "red"}
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard
            title="Expiration Date"
            value={licenseStatus.expirationDate}
            icon={CalendarDays}
            glow="purple"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activation" className="space-y-4">
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger value="activation">Activation</TabsTrigger>
          <TabsTrigger value="agents">Agent Licenses</TabsTrigger>
        </TabsList>

        {/* Activation Tab */}
        <TabsContent value="activation" className="space-y-4">
          <div className="glass-card p-6 space-y-6">
            {/* Generation Code */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">Server Generation Code</h3>
              <p className="text-sm text-muted-foreground">
                Send this code to MdProsoft to receive an Activation Code for your server.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 rounded-lg bg-secondary/60 border border-border/50 font-mono text-sm text-foreground select-all break-all">
                  {licenseStatus.generationCode}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 h-10 w-10"
                  onClick={handleCopyCode}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-border/40" />

            {/* Activate License */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">Activate License</h3>
              <p className="text-sm text-muted-foreground">
                Enter the Activation Code you received from MdProsoft.
              </p>
              <div className="flex items-start gap-3">
                <textarea
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  placeholder="Paste your activation code here..."
                  rows={3}
                  className="flex-1 px-4 py-3 rounded-lg bg-secondary/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all"
                />
                <Button
                  onClick={handleActivate}
                  disabled={!activationCode.trim() || activating}
                  className="h-auto py-3 px-6"
                >
                  {activating ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Activating...
                    </span>
                  ) : (
                    "Activate"
                  )}
                </Button>
              </div>
            </div>

            {/* License Active Info */}
            {licenseStatus.isActivated && (
              <>
                <div className="border-t border-border/40" />
                <div className="flex items-start gap-3 p-4 rounded-lg bg-[hsl(var(--glow-green)/0.1)] border border-[hsl(var(--glow-green)/0.2)]">
                  <CheckCircle className="h-5 w-5 text-[hsl(var(--glow-green))] mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[hsl(var(--glow-green))]">License Active</p>
                    <p className="text-sm text-muted-foreground">
                      Licensed for <span className="font-semibold text-foreground">{licenseStatus.maxLicensedAgents}</span> agents.
                      {" "}Expires <span className="font-semibold text-foreground">{licenseStatus.expirationDate}</span>.
                      {" "}Activated on <span className="font-semibold text-foreground">{licenseStatus.activatedAt}</span>.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* Agent Licenses Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Agent License Records</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Each approved agent's machine fingerprint is stored encrypted. If an agent's machine changes, it will be flagged.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Refreshed")}
                className="shrink-0"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {agentRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <PackageOpen className="h-10 w-10 mb-3 opacity-50" />
                <p className="text-sm">No agent license records yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/30">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hostname</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agent Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">License</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Licensed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentRecords.map((record, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{record.hostname}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={record.agentStatus} />
                        </td>
                        <td className="px-4 py-3">
                          {record.isValid ? (
                            <StatusBadge status="Valid" />
                          ) : (
                            <span title={record.invalidationReason}>
                              <StatusBadge status="Critical" />
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{record.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
