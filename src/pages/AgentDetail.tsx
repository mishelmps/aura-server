import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Monitor, ShieldCheck, Clock, Wifi, RefreshCw, Power, Globe,
  Link2, LayoutGrid, Fingerprint, History, Search, ChevronDown, ChevronRight,
  Info, AlertTriangle, CheckCircle, XCircle, HelpCircle, Lock, Unlock,
  Activity, Server, Eye, Zap, Shield, Database
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";
import { agents, certificates } from "@/data/mockData";
import { agentPorts, agentBindings, agentApplications, agentMachineIdentity, agentHistory } from "@/data/agentDetailData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

function SecurityScoreRing({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? 'hsl(152, 76%, 44%)' : score >= 50 ? 'hsl(45, 93%, 58%)' : 'hsl(0, 84%, 60%)';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="88" height="88" className="transform -rotate-90">
        <circle cx="44" cy="44" r="36" fill="none" stroke="hsl(220, 20%, 16%)" strokeWidth="6" />
        <circle
          cx="44" cy="44" r="36" fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ marginTop: '20px' }}>
        <span className="text-xl font-bold text-foreground">{score}%</span>
      </div>
      <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
}

function QuickInfoPill({ icon: Icon, label, value, color = 'blue' }: { icon: any; label: string; value: string | number; color?: string }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-emerald-400 bg-emerald-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
    red: 'text-red-400 bg-red-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-secondary/30">
      <div className={`p-1.5 rounded-md ${c.split(' ')[1]}`}>
        <Icon className={`h-3.5 w-3.5 ${c.split(' ')[0]}`} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function AgentDetail() {
  const { id } = useParams();
  const agent = agents.find(a => a.id === id);
  const [searchPorts, setSearchPorts] = useState("");
  const [searchCerts, setSearchCerts] = useState("");
  const [searchBindings, setSearchBindings] = useState("");
  const [activeTab, setActiveTab] = useState("ports");

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

  const securityScore = Math.round(
    ((encryptedPorts.length / Math.max(ports.length, 1)) * 40) +
    ((validCerts.length / Math.max(agentCerts.length, 1)) * 40) +
    (agent.status === 'Online' ? 20 : 0)
  );

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

  const impactColors: Record<string, string> = {
    HIGH: 'bg-red-500/15 text-red-400 border-red-500/30',
    MEDIUM: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    LOW: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };

  return (
    <div className="space-y-5">
      <Link to="/agents" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Agents
      </Link>

      {/* Agent Header — Redesigned with side overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main info panel */}
        <div className="lg:col-span-3 glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/30">
                  <Monitor className="h-9 w-9 text-primary" />
                </div>
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                  agent.status === 'Online' ? 'bg-emerald-400 shadow-[0_0_8px_hsl(152,76%,44%/0.6)]' :
                  agent.status === 'Offline' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
                }`} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">{agent.hostname}</h1>
                  <StatusBadge status={agent.status} />
                </div>
                <p className="text-muted-foreground text-sm">{agent.os}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <QuickInfoPill icon={Zap} label="Version" value={agent.version} color="blue" />
                  <QuickInfoPill icon={Clock} label="Last Seen" value={new Date(agent.lastSeen).toLocaleDateString()} color="cyan" />
                  <QuickInfoPill icon={Shield} label="Profile" value={agent.complianceProfile} color="purple" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isPending ? (
                <>
                  <Button className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_hsl(152,76%,44%/0.3)] hover:shadow-[0_0_30px_hsl(152,76%,44%/0.5)] transition-all">
                    <CheckCircle className="h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" className="gap-2 shadow-[0_0_20px_hsl(0,84%,60%/0.2)] hover:shadow-[0_0_30px_hsl(0,84%,60%/0.4)] transition-all">
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="gap-2 hover:border-primary/50 transition-colors">
                    <RefreshCw className="h-4 w-4" /> Rescan
                  </Button>
                  <Button variant="outline" className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/60 transition-colors">
                    <Power className="h-4 w-4" /> Disable
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Security overview mini-panel */}
        <div className="glass-card p-5 flex flex-col items-center justify-center gap-3">
          <div className="relative flex items-center justify-center">
            <SecurityScoreRing score={securityScore} label="Security Score" />
          </div>
          <div className="w-full space-y-2 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Encryption</span>
              <span className="text-foreground font-medium">{encryptedPorts.length}/{ports.length}</span>
            </div>
            <Progress value={ports.length > 0 ? (encryptedPorts.length / ports.length) * 100 : 0} className="h-1.5" />
            <div className="flex justify-between text-xs mt-2">
              <span className="text-muted-foreground">Cert Health</span>
              <span className="text-foreground font-medium">{validCerts.length}/{agentCerts.length}</span>
            </div>
            <Progress value={agentCerts.length > 0 ? (validCerts.length / agentCerts.length) * 100 : 0} className="h-1.5" />
          </div>
        </div>
      </div>

      {/* Tabs — Bottom underline style */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="glass-card p-1.5 overflow-x-auto">
          <TabsList className="bg-transparent w-full justify-start gap-0.5 h-auto">
            {[
              { value: 'ports', icon: Wifi, label: 'Ports', count: ports.length, countColor: 'bg-red-500/80' },
              { value: 'certificates', icon: ShieldCheck, label: 'Certificates', count: agentCerts.length, countColor: 'bg-emerald-500/80' },
              { value: 'bindings', icon: Link2, label: 'Bindings', count: bindings.length, countColor: 'bg-orange-500/80' },
              { value: 'applications', icon: LayoutGrid, label: 'Applications', count: applications.length, countColor: 'bg-purple-500/80' },
              { value: 'machine-identity', icon: Fingerprint, label: 'Machine Identity' },
              { value: 'history', icon: History, label: 'History', count: history.length, countColor: 'bg-cyan-500/80' },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-secondary/80 data-[state=active]:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] data-[state=active]:text-foreground text-muted-foreground transition-all hover:text-foreground/80"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white ${tab.countColor}`}>
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* =================== PORTS TAB =================== */}
        <TabsContent value="ports" className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <StatCard title="ENCRYPTED (TLS)" value={encryptedPorts.length} icon={Lock} glow="green" />
            <StatCard title="APP-MANAGED" value={encryptedPorts.length} icon={ShieldCheck} glow="blue" />
            <StatCard title="NOT ENCRYPTED" value={notEncryptedPorts.length} icon={Unlock} glow="red" />
            <StatCard title="UNKNOWN" value={unknownPorts.length} icon={HelpCircle} glow="yellow" />
            <StatCard title="RECOGNIZED" value={ports.length} icon={Eye} glow="green" />
            <StatCard title="UNRECOGNIZED" value={0} icon={HelpCircle} glow="purple" />
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Listening Ports</h3>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search port, process, application..." value={searchPorts} onChange={e => setSearchPorts(e.target.value)} className="pl-9 bg-secondary/50 border-border/50" />
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
                {filteredPorts.map((port, idx) => (
                  <TableRow key={port.id} className="border-border/30 hover:bg-secondary/20 transition-colors" style={{ animationDelay: `${idx * 30}ms` }}>
                    <TableCell>
                      <span className={`inline-flex items-center justify-center min-w-[3rem] h-7 rounded-full text-sm font-bold ${
                        port.port <= 443 ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20' :
                        port.port <= 1024 ? 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20' :
                        'bg-secondary/60 text-muted-foreground ring-1 ring-border/50'
                      }`}>
                        {port.port}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono tracking-wider border-blue-500/20 text-blue-400/80">{port.proto}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{port.process}</TableCell>
                    <TableCell className="text-muted-foreground">{port.service}</TableCell>
                    <TableCell>
                      {port.applicationTag ? (
                        <Badge className="text-xs bg-orange-500/15 text-orange-400 border border-orange-500/25">{port.applicationTag}</Badge>
                      ) : port.application ? (
                        <span className="text-sm text-foreground/70">{port.application}</span>
                      ) : <span className="text-muted-foreground/50">—</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {port.encryption === 'None' ? (
                          <span className="flex items-center gap-1 text-muted-foreground text-sm"><Unlock className="h-3 w-3" /> None</span>
                        ) : port.encryption === 'Plain-text' ? (
                          <span className="flex items-center gap-1 text-orange-400 text-sm"><AlertTriangle className="h-3 w-3" /> Plain-text</span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-400 text-sm"><Lock className="h-3 w-3" /> {port.encryption}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono-data text-muted-foreground/70">{port.certificate || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{port.expires || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* =================== CERTIFICATES TAB =================== */}
        <TabsContent value="certificates" className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <StatCard title="TOTAL" value={agentCerts.length} icon={Database} glow="blue" />
            <StatCard title="VALID" value={validCerts.length} icon={CheckCircle} glow="green" />
            <StatCard title="EXPIRED" value={expiredCerts.length} icon={XCircle} glow="red" />
            <StatCard title="EXPIRING" value={expiringCerts.length} icon={AlertTriangle} glow="orange" />
            <StatCard title="IN USE" value={agentCerts.length} icon={Link2} glow="cyan" />
            <StatCard title="REMOVABLE" value={expiredCerts.length} icon={Power} glow="purple" />
          </div>

          {/* Alert banners */}
          {expiringCerts.length > 0 && (
            <div className="glass-card p-3.5 flex items-center gap-3 border-l-[3px] border-l-[hsl(var(--glow-orange))]">
              <div className="p-1.5 rounded-lg bg-orange-500/10">
                <Info className="h-4 w-4 text-orange-400" />
              </div>
              <p className="text-sm text-foreground/80">
                <strong className="text-orange-300">{expiringCerts.length} certificate(s)</strong> expiring soon — consider renewal.
              </p>
            </div>
          )}
          {expiredCerts.length > 0 && (
            <div className="glass-card p-3.5 flex items-center gap-3 border-l-[3px] border-l-[hsl(var(--glow-red))]">
              <div className="p-1.5 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </div>
              <p className="text-sm text-foreground/80">
                <strong className="text-red-300">{expiredCerts.length} certificate(s)</strong> expired — may be auto-selected. Do not remove without investigation.
              </p>
            </div>
          )}

          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Certificates</h3>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search subject, thumbprint, issuer..." value={searchCerts} onChange={e => setSearchCerts(e.target.value)} className="pl-9 bg-secondary/50 border-border/50" />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>SUBJECT</TableHead>
                  <TableHead>ISSUER</TableHead>
                  <TableHead>THUMBPRINT</TableHead>
                  <TableHead>STORE</TableHead>
                  <TableHead>EXPIRES</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCerts.map(cert => {
                  const daysLeft = Math.round((new Date(cert.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <TableRow key={cert.id} className="border-border/30 hover:bg-secondary/20 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 shadow-[0_0_6px] ${
                            cert.status === 'Valid' ? 'bg-emerald-400 shadow-emerald-400/50' :
                            cert.status === 'Expiring' ? 'bg-orange-400 shadow-orange-400/50' :
                            'bg-red-400 shadow-red-400/50'
                          }`} />
                          <div>
                            <span className="font-medium text-foreground">{cert.subject.replace('CN=', '')}</span>
                            {cert.templateName && <p className="text-[11px] text-muted-foreground">{cert.templateName}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{cert.issuer.replace('CN=', '')}</TableCell>
                      <TableCell className="font-mono-data text-muted-foreground/70">{cert.thumbprint.substring(0, 14)}...</TableCell>
                      <TableCell className="text-muted-foreground text-sm">LocalMachine\My</TableCell>
                      <TableCell>
                        <div>
                          <span className="text-sm text-foreground">{cert.expiryDate}</span>
                          <p className={`text-[11px] ${daysLeft <= 0 ? 'text-red-400' : daysLeft <= 60 ? 'text-orange-400' : 'text-emerald-400'}`}>
                            {daysLeft <= 0 ? `Expired (${Math.abs(daysLeft)}d ago)` : `Valid (${daysLeft}d)`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                          cert.status === 'Expired' ? 'border-red-500/30 text-red-400' : 'border-emerald-500/30 text-emerald-400'
                        }`}>
                          {cert.status === 'Expired' ? 'Removable' : 'In Use'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {agentCerts.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No certificates found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* =================== BINDINGS TAB =================== */}
        <TabsContent value="bindings" className="space-y-4 animate-fade-in-up">
          {/* Filter chips */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'All', count: bindings.length, icon: LayoutGrid, active: true },
              { label: 'IIS/HTTP.sys', count: bindings.filter(b => b.service.includes('IIS')).length, icon: Globe },
              { label: 'RDP', count: bindings.filter(b => b.service === 'RDP').length, icon: Monitor },
              { label: 'Machine ID', count: 0, icon: Fingerprint },
            ].map((chip, i) => (
              <button
                key={i}
                className={`glass-card px-4 py-2.5 flex items-center gap-2.5 transition-all hover:border-primary/20 ${
                  chip.active ? 'ring-1 ring-primary/30 bg-primary/5' : ''
                }`}
              >
                <div className={`p-1.5 rounded-md ${chip.active ? 'bg-primary/15' : 'bg-secondary/60'}`}>
                  <chip.icon className={`h-4 w-4 ${chip.active ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <span className="text-lg font-bold text-foreground">{chip.count}</span>
                <span className="text-xs text-muted-foreground">{chip.label}</span>
              </button>
            ))}
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{bindings.length} bindings</h3>
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
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBindings.map(binding => (
                  <TableRow key={binding.id} className="border-border/30 hover:bg-secondary/20 transition-colors">
                    <TableCell>
                      <Badge className={`text-xs font-semibold ${
                        binding.serviceColor === 'green' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' :
                        'bg-orange-500/15 text-orange-400 border-orange-500/25'
                      }`} variant="outline">
                        {binding.service}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm">{binding.purpose}</span>
                        <Info className="h-3.5 w-3.5 text-primary/40 hover:text-primary cursor-help transition-colors" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center min-w-[3.5rem] h-6 rounded-md bg-emerald-500/15 text-emerald-400 text-xs font-bold ring-1 ring-emerald-500/20">
                          {binding.endpointPort}
                        </span>
                        <span className="text-xs text-muted-foreground">{binding.endpoint}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono-data text-muted-foreground/70">{binding.certificate || '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{binding.expires || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] font-bold tracking-wide ${impactColors[binding.impact] || ''}`}>
                        {binding.impact}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ChevronDown className="h-4 w-4 text-muted-foreground/50 hover:text-foreground cursor-pointer transition-colors" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* =================== APPLICATIONS TAB =================== */}
        <TabsContent value="applications" className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatCard title="APPLICATIONS" value={applications.length} icon={LayoutGrid} glow="purple" />
            <StatCard title="CERTIFICATES" value={agentCerts.length} icon={ShieldCheck} glow="cyan" />
            <StatCard title="SERVICES" value={bindings.length} icon={Server} glow="green" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {applications.map(app => (
              <div key={app.id} className="glass-card p-5 flex items-center justify-between group hover:bg-secondary/20 transition-all cursor-pointer border border-transparent hover:border-border/50">
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-2xl transition-transform group-hover:scale-105 ${
                    app.iconColor === 'blue' ? 'bg-blue-500/10 ring-1 ring-blue-500/20' : 'bg-orange-500/10 ring-1 ring-orange-500/20'
                  }`}>
                    {app.icon === 'globe' ? (
                      <Globe className={`h-6 w-6 ${app.iconColor === 'blue' ? 'text-blue-400' : 'text-orange-400'}`} />
                    ) : (
                      <Monitor className={`h-6 w-6 ${app.iconColor === 'blue' ? 'text-blue-400' : 'text-orange-400'}`} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base">{app.name}</h4>
                    <div className="flex gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs border-cyan-500/25 text-cyan-400 bg-cyan-500/5">{app.certCount} cert{app.certCount !== 1 ? 's' : ''}</Badge>
                      <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">{app.serviceCount} service{app.serviceCount !== 1 ? 's' : ''}</Badge>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
            {applications.length === 0 && (
              <div className="glass-card p-10 text-center">
                <LayoutGrid className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No applications detected</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* =================== MACHINE IDENTITY TAB =================== */}
        <TabsContent value="machine-identity" className="space-y-4 animate-fade-in-up">
          {machineId ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard title="MACHINE" value={machineId.machine} icon={Monitor} glow="blue" />
                <StatCard title="DOMAIN" value={machineId.domain} icon={Globe} glow="cyan" />
                <StatCard title="STATUS" value={machineId.status} icon={Activity} glow="green" />
                <StatCard title="MESSAGE" value={machineId.message} icon={Info} glow="blue" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-purple-500/10">
                      <Fingerprint className="h-4 w-4 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-foreground">Candidates</h3>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4 font-mono-data text-sm text-muted-foreground overflow-auto max-h-72 border border-border/30">
                    <pre className="whitespace-pre-wrap">{JSON.stringify([{
                      thumbprint: agentCerts[0]?.thumbprint || "N/A",
                      subject: agentCerts[0]?.subject || "N/A",
                      issuer: agentCerts[0]?.issuer || "N/A",
                      hasPrivateKey: true,
                      keySize: 2048,
                    }], null, 2)}</pre>
                  </div>
                </div>

                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10">
                      <Link2 className="h-4 w-4 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-foreground">Consumer Bindings</h3>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4 font-mono-data text-sm text-muted-foreground overflow-auto max-h-72 border border-border/30">
                    <pre className="whitespace-pre-wrap">{JSON.stringify([{
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
              </div>
            </>
          ) : (
            <div className="glass-card p-12 text-center">
              <Fingerprint className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground">No machine identity data available</p>
            </div>
          )}
        </TabsContent>

        {/* =================== HISTORY TAB =================== */}
        <TabsContent value="history" className="space-y-4 animate-fade-in-up">
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <h3 className="font-semibold text-foreground">Change Timeline</h3>
            </div>
            {/* Timeline-style list */}
            <div className="divide-y divide-border/30">
              {history.map((entry, idx) => (
                <div key={entry.id} className="flex items-start gap-4 px-5 py-4 hover:bg-secondary/15 transition-colors">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center mt-1">
                    <div className={`w-3 h-3 rounded-full ring-4 ring-background ${
                      entry.type === 'Added' ? 'bg-emerald-400 shadow-[0_0_8px_hsl(152,76%,44%/0.5)]' :
                      entry.type === 'Removed' ? 'bg-red-400 shadow-[0_0_8px_hsl(0,84%,60%/0.5)]' :
                      'bg-blue-400 shadow-[0_0_8px_hsl(217,91%,60%/0.5)]'
                    }`} />
                    {idx < history.length - 1 && <div className="w-px h-8 bg-border/30 mt-1" />}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] font-bold tracking-wide ${
                        entry.type === 'Added' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' :
                        entry.type === 'Removed' ? 'bg-red-500/15 text-red-400 border-red-500/25' :
                        'bg-blue-500/15 text-blue-400 border-blue-500/25'
                      }`} variant="outline">
                        {entry.type}
                      </Badge>
                      <span className="font-medium text-foreground text-sm">{entry.entity}</span>
                    </div>
                    <p className="font-mono-data text-muted-foreground/70 mt-1 truncate">{entry.key}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">{entry.timestamp}</span>
                </div>
              ))}
              {history.length === 0 && (
                <div className="p-10 text-center">
                  <History className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-muted-foreground">No history entries</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
