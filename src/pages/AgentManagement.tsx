import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { agents } from "@/data/mockData";
import { Monitor, Scale, UserCog, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AgentManagement() {
  const pendingAgents = agents.filter(a => a.status === 'Pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agent Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage agent deployment and licensing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Agents" value={agents.length} icon={Monitor} glow="blue" />
        <StatCard title="Pending Approval" value={pendingAgents.length} icon={UserCog} glow="orange" />
        <StatCard title="License Slots" value="12/14" icon={Scale} glow="cyan" />
      </div>

      <div className="glass-card p-6">
        <h3 className="font-medium text-foreground mb-3">License Usage</h3>
        <Progress value={85} className="h-3 colorful-progress" />
        <p className="text-xs text-muted-foreground mt-2">12 of 14 agent license slots used — <span className="gradient-text-orange font-semibold">85%</span></p>
      </div>

      {pendingAgents.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-medium text-foreground">Pending Agent Approvals</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Hostname</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAgents.map(agent => (
                <TableRow key={agent.id} className="border-border/30 hover:bg-secondary/30">
                  <TableCell className="font-medium">{agent.hostname}</TableCell>
                  <TableCell className="font-mono-data">{agent.ipAddress}</TableCell>
                  <TableCell className="text-muted-foreground">{agent.os}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(agent.lastSeen).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-primary text-primary-foreground h-7"><Check className="h-3 w-3 mr-1" />Approve</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-muted-foreground"><X className="h-3 w-3 mr-1" />Reject</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
