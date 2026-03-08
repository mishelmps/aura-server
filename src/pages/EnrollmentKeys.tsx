import { Key, Copy } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { enrollmentKeys } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EnrollmentKeys() {
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Key copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text-yellow">Enrollment Keys</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage agent enrollment keys</p>
        </div>
        <Button className="bg-primary text-primary-foreground"><Key className="h-4 w-4 mr-1" />Create Key</Button>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Label</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollmentKeys.map(ek => (
              <TableRow key={ek.id} className="border-border/30 hover:bg-secondary/30">
                <TableCell className="font-medium">{ek.label}</TableCell>
                <TableCell className="font-mono-data text-muted-foreground">
                  {ek.key.substring(0, 10)}••••••••
                </TableCell>
                <TableCell><StatusBadge status={ek.status} /></TableCell>
                <TableCell>{ek.usageCount}</TableCell>
                <TableCell className="text-muted-foreground">{ek.createdDate}</TableCell>
                <TableCell className="text-muted-foreground">{ek.expiryDate}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" onClick={() => copyKey(ek.key)} className="h-7 text-muted-foreground hover:text-foreground">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
