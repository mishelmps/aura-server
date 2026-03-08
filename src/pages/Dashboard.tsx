import { Monitor, ShieldCheck, Bell, AlertTriangle, Clock, Users, Scale, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { agents, certificates, alerts } from "@/data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const agentStatusData = [
  { name: 'Online', value: agents.filter(a => a.status === 'Online').length, color: 'hsl(152, 76%, 44%)' },
  { name: 'Offline', value: agents.filter(a => a.status === 'Offline').length, color: 'hsl(0, 84%, 60%)' },
  { name: 'Pending', value: agents.filter(a => a.status === 'Pending').length, color: 'hsl(45, 93%, 58%)' },
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
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Agent Status Distribution</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={agentStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={2} stroke="hsl(228, 25%, 6%)">
                  {agentStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(225, 25%, 9%)', border: '1px solid hsl(220, 20%, 16%)', borderRadius: '10px', color: 'hsl(210, 40%, 92%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 mt-2">
            {agentStatusData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }} />
                {d.name} <span className="font-bold text-foreground">({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="glass-card p-6 animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Recent Alerts</h3>
            <Link to="/alerts" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-2.5">
            {recentAlerts.map(alert => (
              <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border-l-2 ${
                alert.severity === 'Critical' ? 'bg-red-500/5 border-l-red-500' : alert.severity === 'Warning' ? 'bg-orange-500/5 border-l-orange-500' : 'bg-blue-500/5 border-l-blue-500'
              }`}>
                <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${alert.severity === 'Critical' ? 'text-red-400' : alert.severity === 'Warning' ? 'text-orange-400' : 'text-blue-400'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Status List */}
        <div className="glass-card p-6 animate-fade-in-up stagger-5 glow-green">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Agent Status</h3>
            <Link to="/agents" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-2">
            {agents.slice(0, 7).map(agent => (
              <div key={agent.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Monitor className="h-3.5 w-3.5 text-blue-400 shrink-0" />
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
