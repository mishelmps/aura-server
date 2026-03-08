import { FileCode2, Check, X } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { templates } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Templates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Templates</h1>
        <p className="text-muted-foreground text-sm mt-1">Certificate templates from Active Directory and custom sources</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="AD Templates" value={templates.filter(t => t.source === 'AD').length} icon={FileCode2} glow="blue" />
        <StatCard title="Published" value={templates.filter(t => t.published).length} icon={FileCode2} glow="green" />
        <StatCard title="Custom" value={templates.filter(t => t.source === 'Custom').length} icon={FileCode2} glow="purple" />
      </div>

      <div className="glass-card overflow-hidden glow-yellow">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>OID</TableHead>
              <TableHead>Key Algorithm</TableHead>
              <TableHead>Key Size</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Auto-Enroll</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map(t => (
              <TableRow key={t.id} className="border-border/30 hover:bg-secondary/30">
                <TableCell className="font-medium">{t.displayName}</TableCell>
                <TableCell className="font-mono-data text-muted-foreground text-xs">{t.oid}</TableCell>
                <TableCell>{t.keyAlgorithm}</TableCell>
                <TableCell>{t.keySize}</TableCell>
                <TableCell>{t.validityPeriod}</TableCell>
                <TableCell>
                  <Badge variant={t.source === 'AD' ? 'default' : 'secondary'} className="text-xs">{t.source}</Badge>
                </TableCell>
                <TableCell>{t.published ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
                <TableCell>{t.autoEnroll ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
