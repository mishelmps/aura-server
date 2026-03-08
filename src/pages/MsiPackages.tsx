import { Package, Download } from "lucide-react";
import { msiPackages } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MsiPackages() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">MSI Packages</h1>
          <p className="text-muted-foreground text-sm mt-1">Agent installer packages for deployment</p>
        </div>
        <Button className="bg-primary text-primary-foreground"><Package className="h-4 w-4 mr-1" />Generate Package</Button>
      </div>

      <div className="glass-card p-4 border-l-4 border-l-blue-500 bg-blue-500/5">
        <p className="text-sm text-foreground">Download the MSI installer matching your target architecture. Agents will auto-connect using the enrollment key configured during installation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {msiPackages.map((pkg, i) => (
          <div key={pkg.id} className="glass-card-hover p-5 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(270,76%,60%,0.15)] to-[hsl(217,91%,60%,0.15)]">
                  <Package className="h-5 w-5 icon-bg-purple" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{pkg.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{pkg.architecture}</Badge>
                    <span className="text-xs text-muted-foreground">v{pkg.version}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-primary">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span>{pkg.size}</span>
              <span>{pkg.createdDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
