import { useState } from "react";
import { ClipboardCheck, Check } from "lucide-react";
import { complianceProfiles } from "@/data/mockData";

export default function ComplianceSettings() {
  const [selected, setSelected] = useState("1");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text-green">Compliance Profiles</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure and assign compliance profiles to agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {complianceProfiles.map((profile, i) => (
          <button
            key={profile.id}
            onClick={() => setSelected(profile.id)}
            className={`glass-card-hover p-5 text-left animate-fade-in-up relative ${
              selected === profile.id ? 'border-primary/50 bg-primary/5' : ''
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {selected === profile.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-foreground">{profile.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{profile.description}</p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{profile.agentCount} agents</span>
              <span>{profile.rules} rules</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
