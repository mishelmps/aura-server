import { Users, ShieldCheck, UserCog, Eye } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { roleAssignments } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const roleBadgeVariant = (role: string) => {
  if (role === 'Admin') return 'destructive' as const;
  if (role === 'Operator') return 'default' as const;
  return 'secondary' as const;
};

export default function Authorization() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text-red">Authorization & Roles</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage user roles and permissions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={roleAssignments.length} icon={Users} glow="blue" />
        <StatCard title="Admins" value={roleAssignments.filter(r => r.role === 'Admin').length} icon={ShieldCheck} glow="red" />
        <StatCard title="Operators" value={roleAssignments.filter(r => r.role === 'Operator').length} icon={UserCog} glow="green" />
        <StatCard title="Auditors" value={roleAssignments.filter(r => r.role === 'Auditor').length} icon={Eye} glow="purple" />
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Assigned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roleAssignments.map(r => (
              <TableRow key={r.id} className="border-border/30 hover:bg-secondary/30">
                <TableCell className="font-medium">{r.userName}</TableCell>
                <TableCell className="text-muted-foreground">{r.email}</TableCell>
                <TableCell><Badge variant={roleBadgeVariant(r.role)}>{r.role}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{r.scope}</TableCell>
                <TableCell className="text-muted-foreground">{r.assignedDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
