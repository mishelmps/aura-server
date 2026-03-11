import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Monitor, ShieldCheck, Clock, Wifi, RefreshCw, Power, Globe, Link2, LayoutGrid, Fingerprint, History, Search, ChevronDown, Info, AlertTriangle, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";
import { agents, certificates } from "@/data/mockData";
import { agentPorts, agentBindings, agentApplications, agentMachineIdentity, agentHistory } from "@/data/agentDetailData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AgentDetail() {
  const { id } = useParams();
  const agent = agents.find(a => a.id === id);
  const [searchPorts, setSearchPorts] = useState("");
  const [searchCerts, setSearchCerts] = useState("");
  const [searchBindings, setSearchBindings] = useState("");

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Agent not found</p>
      </div>
    );
  }

  const agentCerts = certificates.filter(c => c.agentId === agent.id);
  const ports = agentPorts[agent.id] || [];
  const bindings = agentBindings[agent.id] || [];
  const applications = agentApplications[agent.id] || [];
  const machineId = agentMachineIdentity[agent.id];
  const history = agentHistory[agent.id] || [];

  const encryptedPorts = ports.filter(p => p.encryption !== 'None' && p.encryption !== 'Plain-text');
  const notEncryptedPorts = ports.filter(p => p.encryption === 'Plain-text');
  const unknownPorts = ports.filter(p => p.encryption === 'None');

  const validCerts = agentCerts.filter(c => c.status === 'Valid');
  const expiredCerts = agentCerts.filter(c => c.status === 'Expired');
  const expiringCerts = agentCerts.filter(c => c.status === 'Expiring');

  const filteredPorts = ports.filter(p => {
    if (!searchPorts) return true;
    const s = searchPorts.toLowerCase();
    return p.port.toString().includes(s) || p.process.toLowerCase().includes(s) || p.service.toLowerCase().includes(s) || (p.application?.toLowerCase().includes(s));
  });

  const filteredCerts = agentCerts.filter(c => {
    if (!searchCerts) return true;
    const s = searchCerts.toLowerCase();
    return c.subject.toLowerCase().includes(s) || c.issuer.toLowerCase().includes(s) || c.thumbprint.toLowerCase().includes(s);
  });

  const filteredBindings = bindings.filter(b => {
    if (!searchBindings) return true;
    const s = searchBindings.toLowerCase();
    return b.service.toLowerCase().includes(s) || b.purpose.toLowerCase().includes(s);
  });

  const isPending = agent.status === 'Pending';

  return (
    <div className="space-y-6">
      <Link to="/agents" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Agents
      </Link>

      {/* Agent Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-secondary/50">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{agent.hostname}</h1>
                <StatusBadge status={agent.status} />
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {agent.os} · Version: {agent.version} · Heartbeat: {new Date(agent.lastSeen).toLocaleString()} · Last Scan: 20h ago
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPending ? (
              <>
                <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button variant="destructive" className="gap-2">
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Rescan
                </Button>
                <Button variant="outline" className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10">
                  <Power className="h-4 w-4" />
                  Disable
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ports" className="space-y-4">
        <TabsList className="bg-secondary/50 border border-border/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="ports" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Wifi className="h-4 w-4" /> Ports
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-red-500/20 text-red-400">{ports.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <ShieldCheck className="h-4 w-4" /> Certificates
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-green-500/20 text-green-400">{agentCerts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="bindings" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Link2 className="h-4 w-4" /> Bindings
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-orange-500/20 text-orange-400">{bindings.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <LayoutGrid className="h-4 w-4" /> Applications
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-purple-500/20 text-purple-400">{applications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="machine-identity" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Fingerprint className="h-4 w-4" /> Machine Identity
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <History className="h-4 w-4" /> History
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-cyan-500/20 text-cyan-400">{history.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* PORTS TAB */}
        <TabsContent value="ports" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <StatCard title="ENCRYPTED (TLS)" value={encryptedPorts.length} icon={ShieldCheck} glow="green" />
            <StatCard title="APP-MANAGED TLS" value={encryptedPorts.length} icon={ShieldCheck} glow="blue" />
            <StatCard title="NOT ENCRYPTED" value={notEncryptedPorts.length} icon={Power} glow="red" />
            <StatCard title="UNKNOWN" value={unknownPorts.length} icon={HelpCircle} glow="yellow" />
            <StatCard title="RECOGNIZED" value={ports.length} icon={CheckCircle} glow="green" />
            <StatCard title="UNRECOGNIZED" value={0} icon={HelpCircle} glow="purple" />
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-medium text-foreground">Listening Ports</h3>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search port, process, application, certificate..." value={searchPorts} onChange={e => setSearchPorts(e.target.value)} className="pl-9 bg-secondary/50 border-border/50" />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>PORT</TableHead>
                  <TableHead>PROTO</TableHead>
                  <TableHead>PROCESS</TableHead>
                  <TableHead>SERVICE</TableHead>
                  <TableHead>APPLICATION</TableHead>
                  <TableHead>ENCRYPTION</TableHead>
                  <TableHead>CERTIFICATE</TableHead>
                  <TableHead>EXPIRES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPorts.map(port => (
                  <TableRow key={port.id} className="border-border/30 hover:bg-secondary/30">
                    <TableCell>
                      <span className="inline-flex items-center justify-center w-12 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold">
                        {port.port}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                        {port.proto}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{port.process}</TableCell>
                    <TableCell className="text-muted-foreground">{port.service}</TableCell>
                    <TableCell>
                      {port.applicationTag ? (
                        <div>
                          <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400">{port.applicationTag}</Badge>
                        </div>
                      ) : port.application ? (
                        <span className="text-muted-foreground">{port.application}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${port.encryption === 'None' ? 'text-muted-foreground' : port.encryption === 'Plain-text' ? 'text-orange-400' : 'text-emerald-400'}`}>
                        — {port.encryption}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono-data text-muted-foreground">{port.certificate || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{port.expires || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* CERTIFICATES TAB */}
        <TabsContent value="certificates" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <StatCard title="TOTAL" value={agentCerts.length} icon={ShieldCheck} glow="blue" />
            <StatCard title="VALID" value={validCerts.length} icon={CheckCircle} glow="green" />
            <StatCard title="EXPIRED" value={expiredCerts.length} icon={XCircle} glow="red" />
            <StatCard title="EXPIRING" value={expiringCerts.length} icon={AlertTriangle} glow="orange" />
            <StatCard title="IN USE" value={agentCerts.length} icon={Link2} glow="cyan" />
            <StatCard title="REMOVABLE" value={expiredCerts.length} icon={Power} glow="purple" />
          </div>

          {expiredCerts.length > 0 && (
            <div className="glass-card p-3 border-l-4 border-l-yellow-500 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0" />
              <p className="text-sm text-yellow-300">
                <strong>{expiredCerts.length} certificate(s)</strong> expired — may need attention.
              </p>
            </div>
          )}

          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-medium text-foreground">Certificates</h3>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search subject, thumbprint, issuer, service..." value={searchCerts} onChange={e => setSearchCerts(e.target.value)} className="pl-9 bg-secondary/50 border-border/50" />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>SUBJECT</TableHead>
                  <TableHead>ISSUER</TableHead>
                  <TableHead>THUMBPRINT</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>EXPIRES</TableHead>
                  <TableHead>SERVICES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCerts.map(cert => (
                  <TableRow key={cert.id} className="border-border/30 hover:bg-secondary/30">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cert.status === 'Valid' ? 'bg-emerald-400' : cert.status === 'Expiring' ? 'bg-orange-400' : 'bg-red-400'}`} />
                        <span className="font-medium">{cert.subject.replace('CN=', '')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{cert.issuer.replace('CN=', '')}</TableCell>
                    <TableCell className="font-mono-data text-muted-foreground">{cert.thumbprint.substring(0, 16)}...</TableCell>
                    <TableCell><StatusBadge status={cert.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{cert.expiryDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">Removable</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {agentCerts.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No certificates found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* BINDINGS TAB */}
        <TabsContent value="bindings" className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            {[
              { label: `${bindings.length} All`, icon: LayoutGrid, color: 'blue' },
              { label: `${bindings.filter(b => b.service.includes('IIS')).length} IIS/HTTP.sys`, icon: Globe, color: 'green' },
              { label: `${bindings.filter(b => b.service === 'RDP').length} RDP`, icon: Monitor, color: 'orange' },
            ].map((item, i) => (
              <div key={i} className={`glass-card px-4 py-3 flex items-center gap-3 glow-${item.color}`}>
                <div className={`p-2 rounded-lg bg-${item.color === 'blue' ? 'primary' : item.color === 'green' ? 'emerald-500' : 'orange-500'}/20`}>
                  <item.icon className={`h-5 w-5 ${item.color === 'blue' ? 'text-primary' : item.color === 'green' ? 'text-emerald-400' : 'text-orange-400'}`} />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-medium text-foreground">{bindings.length} bindings</h3>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search service, port, cert, purpose..." value={searchBindings} onChange={e => setSearchBindings(e.target.value)} className="pl-9 bg-secondary/50 border-border/50" />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>SERVICE</TableHead>
                  <TableHead>PURPOSE</TableHead>
                  <TableHead>ENDPOINT</TableHead>
                  <TableHead>CERTIFICATE</TableHead>
                  <TableHead>EXPIRES</TableHead>
                  <TableHead>IMPACT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBindings.map(binding => (
                  <TableRow key={binding.id} className="border-border/30 hover:bg-secondary/30">
                    <TableCell>
                      <Badge className={`text-xs ${binding.serviceColor === 'green' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`} variant="outline">
                        {binding.service}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{binding.purpose}</span>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs" variant="outline">{binding.endpointPort}</Badge>
                        <p className="text-xs text-muted-foreground mt-0.5">{binding.endpoint}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono-data text-muted-foreground">{binding.certificate || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{binding.expires || '—'}</TableCell>
                    <TableCell className="text-muted-foreground font-medium">{binding.impact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* APPLICATIONS TAB */}
        <TabsContent value="applications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatCard title="APPLICATIONS" value={applications.length} icon={LayoutGrid} glow="purple" />
            <StatCard title="CERTIFICATES" value={agentCerts.length} icon={ShieldCheck} glow="cyan" />
            <StatCard title="SERVICES" value={bindings.length} icon={Globe} glow="green" />
          </div>

          <div className="space-y-3">
            {applications.map(app => (
              <div key={app.id} className="glass-card p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${app.iconColor === 'blue' ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}>
                    {app.icon === 'globe' ? (
                      <Globe className={`h-6 w-6 ${app.iconColor === 'blue' ? 'text-blue-400' : 'text-orange-400'}`} />
                    ) : (
                      <Monitor className={`h-6 w-6 ${app.iconColor === 'blue' ? 'text-blue-400' : 'text-orange-400'}`} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{app.name}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">{app.certCount} cert</Badge>
                      <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">{app.serviceCount} services</Badge>
                    </div>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* MACHINE IDENTITY TAB */}
        <TabsContent value="machine-identity" className="space-y-4">
          {machineId ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard title="MACHINE" value={machineId.machine} icon={Monitor} glow="blue" />
                <StatCard title="DOMAIN" value={machineId.domain} icon={Globe} glow="cyan" />
                <StatCard title="STATUS" value={machineId.status} icon={CheckCircle} glow="green" />
                <StatCard title="MESSAGE" value={machineId.message} icon={Info} glow="blue" />
              </div>

              <div className="glass-card p-5">
                <h3 className="font-semibold text-foreground mb-3">Candidates</h3>
                <div className="bg-secondary/40 rounded-lg p-4 font-mono-data text-sm text-muted-foreground overflow-auto max-h-64">
                  <pre>{JSON.stringify([{
                    thumbprint: agentCerts[0]?.thumbprint || "N/A",
                    subject: agentCerts[0]?.subject || "N/A",
                    issuer: agentCerts[0]?.issuer || "N/A",
                    hasPrivateKey: true,
                    keySize: 2048,
                  }], null, 2)}</pre>
                </div>
              </div>

              <div className="glass-card p-5">
                <h3 className="font-semibold text-foreground mb-3">Consumer Bindings</h3>
                <div className="bg-secondary/40 rounded-lg p-4 font-mono-data text-sm text-muted-foreground overflow-auto max-h-64">
                  <pre>{JSON.stringify([{
                    consumerName: "RDP",
                    port: 3389,
                    impactLevel: "Critical",
                    isApplicable: false,
                  }, {
                    consumerName: "IIS",
                    port: 443,
                    impactLevel: "High",
                    isApplicable: true,
                  }], null, 2)}</pre>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card p-8 text-center">
              <Fingerprint className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No machine identity data available</p>
            </div>
          )}
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="space-y-4">
          <div className="glass-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>TYPE</TableHead>
                  <TableHead>ENTITY</TableHead>
                  <TableHead>KEY</TableHead>
                  <TableHead>TIMESTAMP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map(entry => (
                  <TableRow key={entry.id} className="border-border/30 hover:bg-secondary/30">
                    <TableCell>
                      <Badge className={`text-xs ${
                        entry.type === 'Added' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        entry.type === 'Removed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`} variant="outline">
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.entity}</TableCell>
                    <TableCell className="font-mono-data text-muted-foreground">{entry.key}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.timestamp}</TableCell>
                  </TableRow>
                ))}
                {history.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No history entries</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
