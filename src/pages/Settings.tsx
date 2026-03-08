import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const alertRules = [
  { id: '1', name: 'Certificate Expiry Warning', description: 'Alert when cert expires within 30 days', enabled: true },
  { id: '2', name: 'Certificate Expired', description: 'Alert when cert has expired', enabled: true },
  { id: '3', name: 'Agent Offline', description: 'Alert when agent offline > 24 hours', enabled: true },
  { id: '4', name: 'Agent Version Outdated', description: 'Alert when agent version is behind', enabled: false },
  { id: '5', name: 'CA Connection Lost', description: 'Alert when CA is unreachable', enabled: true },
  { id: '6', name: 'License Usage High', description: 'Alert when license usage > 80%', enabled: true },
  { id: '7', name: 'Compliance Violation', description: 'Alert on compliance scan failures', enabled: true },
];

export default function Settings() {
  const [rules, setRules] = useState(alertRules);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text-blue">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure system settings</p>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger value="alerts">Alert Rules</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="internal-ca">Internal CA</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <div className="glass-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>Rule</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-20">Enabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map(rule => (
                  <TableRow key={rule.id} className="border-border/30 hover:bg-secondary/30">
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell className="text-muted-foreground">{rule.description}</TableCell>
                    <TableCell><Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="general">
          <div className="glass-card p-6 space-y-4 max-w-lg">
            <div><Label>Server Display Name</Label><Input defaultValue="MD CertManager" className="mt-1 bg-secondary/50 border-border/50" /></div>
            <div><Label>Default Scan Interval (hours)</Label><Input type="number" defaultValue="6" className="mt-1 bg-secondary/50 border-border/50" /></div>
            <div><Label>Certificate Expiry Warning (days)</Label><Input type="number" defaultValue="30" className="mt-1 bg-secondary/50 border-border/50" /></div>
            <div><Label>Max Concurrent Scans</Label><Input type="number" defaultValue="5" className="mt-1 bg-secondary/50 border-border/50" /></div>
            <Button className="bg-primary text-primary-foreground">Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="internal-ca">
          <div className="glass-card p-6 max-w-lg">
            <h3 className="font-medium text-foreground mb-4">Internal Certificate Authority</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Status</span><span className="text-emerald-400">Active</span></div>
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Common Name</span><span className="text-foreground">Contoso Internal CA</span></div>
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Valid Until</span><span className="text-foreground">2030-12-31</span></div>
              <div className="flex justify-between py-2"><span className="text-muted-foreground">Issued Certificates</span><span className="text-foreground">47</span></div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
