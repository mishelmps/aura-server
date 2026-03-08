import { Monitor, ShieldCheck, Bell, AlertTriangle, Clock, Users, Scale } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { agents, certificates, alerts } from "@/data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const agentStatusData = [
  { name: 'Online', value: agents.filter(a => a.status === 'Online').length, color: 'hsl(142, 71%, 45%)' },
  { name: 'Offline', value: agents.filter(a => a.status === 'Offline').length, color: 'hsl(0, 72%, 51%)' },
  { name: 'Pending', value: agents.filter(a => a.status === 'Pending').length, color: 'hsl(45, 93%, 47%)' },
];

const recentAlerts = alerts.filter(a => !a.acknowledged).slice(0, 5);
const expiringCerts = certificates.filter(c => c.status === 'Expiring').length;

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Certificate management overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="animate-fade-in-up stagger-1">
          <StatCard title="Total Agents" value={agents.length} icon={Monitor} glow="blue" />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard title="Certificates" value={certificates.length} icon={ShieldCheck} glow="green" />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard title="Active Alerts" value={alerts.filter(a => !a.acknowledged).length} icon={Bell} glow="red" />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard title="Expiring Soon" value={expiringCerts} icon={Clock} glow="orange" />
        </div>
        <div className="animate-fade-in-up stagger-5">
          <StatCard title="Pending Agents" value={agents.filter(a => a.status === 'Pending').length} icon={Users} glow="purple" />
        </div>
        <div className="animate-fade-in-up stagger-6">
          <StatCard title="License Usage" value="12/14" icon={Scale} glow="cyan" subtitle="85% used" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="glass-card p-6 animate-fade-in-up stagger-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Agent Status</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={agentStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                  {agentStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(222, 41%, 8%)', border: '1px solid hsl(215, 28%, 16%)', borderRadius: '8px', color: 'hsl(210, 40%, 92%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {agentStatusData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="glass-card p-6 animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Recent Alerts</h3>
            <Link to="/alerts" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-2 rounded-lg bg-secondary/30">
                <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${alert.severity === 'Critical' ? 'text-red-400' : alert.severity === 'Warning' ? 'text-orange-400' : 'text-blue-400'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Status List */}
        <div className="glass-card p-6 animate-fade-in-up stagger-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Agent Status</h3>
            <Link to="/agents" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {agents.slice(0, 7).map(agent => (
              <div key={agent.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-2 min-w-0">
                  <Monitor className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate">{agent.hostname}</span>
                </div>
                <StatusBadge status={agent.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
