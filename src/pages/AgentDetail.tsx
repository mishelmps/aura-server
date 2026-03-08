import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Monitor, ShieldCheck, Clock, Wifi } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { agents, certificates } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AgentDetail() {
  const { id } = useParams();
  const agent = agents.find(a => a.id === id);

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Agent not found</p>
      </div>
    );
  }

  const agentCerts = certificates.filter(c => c.agentId === agent.id);

  return (
    <div className="space-y-6">
      <Link to="/agents" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Agents
      </Link>

      <div className="glass-card p-6 glow-blue">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-secondary/50">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{agent.hostname}</h1>
              <p className="text-muted-foreground text-sm">{agent.ipAddress} · {agent.os}</p>
            </div>
          </div>
          <StatusBadge status={agent.status} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Wifi className="h-3 w-3" />Version</p>
            <p className="text-sm font-medium font-mono-data">{agent.version}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="h-3 w-3" />Certificates</p>
            <p className="text-sm font-medium">{agent.certificateCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Last Seen</p>
            <p className="text-sm font-medium">{new Date(agent.lastSeen).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Compliance</p>
            <p className="text-sm font-medium">{agent.complianceProfile}</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-medium text-foreground">Certificates ({agentCerts.length})</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Subject</TableHead>
              <TableHead>Thumbprint</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agentCerts.map(cert => (
              <TableRow key={cert.id} className="border-border/30 hover:bg-secondary/30">
                <TableCell className="font-medium">{cert.subject}</TableCell>
                <TableCell className="font-mono-data text-muted-foreground">{cert.thumbprint.substring(0, 16)}...</TableCell>
                <TableCell className="text-muted-foreground text-sm">{cert.issuer}</TableCell>
                <TableCell><StatusBadge status={cert.status} /></TableCell>
                <TableCell className="text-muted-foreground">{cert.expiryDate}</TableCell>
              </TableRow>
            ))}
            {agentCerts.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No certificates found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
