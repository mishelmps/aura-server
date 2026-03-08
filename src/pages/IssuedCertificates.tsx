import { useState } from "react";
import { Search, FileText, ShieldCheck, Ban, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { FilterPills } from "@/components/FilterPills";
import { StatusBadge } from "@/components/StatusBadge";
import { issuedCertificates } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function IssuedCertificates() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = issuedCertificates.filter(c => {
    if (filter !== "All" && c.status !== filter) return false;
    if (search && !c.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pillOptions = [
    { label: "All", value: "All", count: issuedCertificates.length },
    { label: "Active", value: "Active", count: issuedCertificates.filter(c => c.status === 'Active').length },
    { label: "Revoked", value: "Revoked", count: issuedCertificates.filter(c => c.status === 'Revoked').length },
    { label: "Pending", value: "Pending", count: issuedCertificates.filter(c => c.status === 'Pending').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Issued Certificates</h1>
        <p className="text-muted-foreground text-sm mt-1">Certificates issued by your Certificate Authorities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Issued" value={issuedCertificates.length} icon={FileText} glow="blue" />
        <StatCard title="Active" value={issuedCertificates.filter(c => c.status === 'Active').length} icon={ShieldCheck} glow="green" />
        <StatCard title="Revoked" value={issuedCertificates.filter(c => c.status === 'Revoked').length} icon={Ban} glow="red" />
        <StatCard title="Pending" value={issuedCertificates.filter(c => c.status === 'Pending').length} icon={Clock} glow="orange" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <FilterPills options={pillOptions} selected={filter} onSelect={setFilter} />
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary/50 border-border/50" />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Subject</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Requested By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(cert => (
              <TableRow key={cert.id} className="border-border/30 hover:bg-secondary/30">
                <TableCell className="font-medium">{cert.subject}</TableCell>
                <TableCell className="font-mono-data text-muted-foreground">{cert.serialNumber}</TableCell>
                <TableCell className="text-muted-foreground">{cert.templateName}</TableCell>
                <TableCell><StatusBadge status={cert.status} /></TableCell>
                <TableCell className="text-muted-foreground">{cert.issuedDate}</TableCell>
                <TableCell className="text-muted-foreground">{cert.expiryDate}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{cert.requestedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
