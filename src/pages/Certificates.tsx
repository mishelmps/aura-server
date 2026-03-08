import { useState } from "react";
import { Search } from "lucide-react";
import { FilterPills } from "@/components/FilterPills";
import { StatusBadge } from "@/components/StatusBadge";
import { certificates } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Certificates() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = certificates.filter(c => {
    if (filter !== "All" && c.status !== filter) return false;
    if (search && !c.subject.toLowerCase().includes(search.toLowerCase()) && !c.thumbprint.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pillOptions = [
    { label: "All", value: "All", count: certificates.length },
    { label: "Valid", value: "Valid", count: certificates.filter(c => c.status === 'Valid').length },
    { label: "Expiring", value: "Expiring", count: certificates.filter(c => c.status === 'Expiring').length },
    { label: "Expired", value: "Expired", count: certificates.filter(c => c.status === 'Expired').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Certificates</h1>
        <p className="text-muted-foreground text-sm mt-1">Discovered certificates across all agents</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <FilterPills options={pillOptions} selected={filter} onSelect={setFilter} />
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search certificates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary/50 border-border/50" />
        </div>
      </div>

      <div className="glass-card overflow-hidden glow-green">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Subject</TableHead>
              <TableHead>Thumbprint</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Agent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(cert => (
              <TableRow key={cert.id} className="border-border/30 hover:bg-secondary/30">
                <TableCell className="font-medium">{cert.subject}</TableCell>
                <TableCell className="font-mono-data text-muted-foreground">{cert.thumbprint.substring(0, 16)}...</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{cert.issuer}</TableCell>
                <TableCell><StatusBadge status={cert.status} /></TableCell>
                <TableCell className="text-muted-foreground">{cert.expiryDate}</TableCell>
                <TableCell className="text-muted-foreground">{cert.agentHostname}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
