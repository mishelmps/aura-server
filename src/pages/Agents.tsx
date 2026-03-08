import { useState } from "react";
import { Monitor, Search } from "lucide-react";
import { FilterPills } from "@/components/FilterPills";
import { StatusBadge } from "@/components/StatusBadge";
import { agents } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";

export default function Agents() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = agents.filter(a => {
    if (filter !== "All" && a.status !== filter) return false;
    if (search && !a.hostname.toLowerCase().includes(search.toLowerCase()) && !a.ipAddress.includes(search)) return false;
    return true;
  });

  const pillOptions = [
    { label: "All", value: "All", count: agents.length },
    { label: "Online", value: "Online", count: agents.filter(a => a.status === 'Online').length },
    { label: "Offline", value: "Offline", count: agents.filter(a => a.status === 'Offline').length },
    { label: "Pending", value: "Pending", count: agents.filter(a => a.status === 'Pending').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text-cyan">Agents</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage and monitor enrolled agents</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <FilterPills options={pillOptions} selected={filter} onSelect={setFilter} />
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search agents..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary/50 border-border/50" />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Hostname</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Certificates</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(agent => (
              <TableRow key={agent.id} className="border-border/30 hover:bg-secondary/30">
                <TableCell>
                  <Link to={`/agents/${agent.id}`} className="flex items-center gap-2 text-primary hover:underline font-medium">
                    <Monitor className="h-3.5 w-3.5" />
                    {agent.hostname}
                  </Link>
                </TableCell>
                <TableCell className="font-mono-data">{agent.ipAddress}</TableCell>
                <TableCell className="text-muted-foreground">{agent.os}</TableCell>
                <TableCell><StatusBadge status={agent.status} /></TableCell>
                <TableCell className="font-mono-data">{agent.version}</TableCell>
                <TableCell>{agent.certificateCount}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{new Date(agent.lastSeen).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
