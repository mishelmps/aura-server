import { useState } from "react";
import { Save } from "lucide-react";
import { complianceProfiles } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const badgeColorMap: Record<string, string> = {
  cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  red: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function ComplianceSettings() {
  const [selected, setSelected] = useState("none");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Controls which cryptographic settings are permitted when requesting certificates. Applies globally to all certificate requests on this server.
        </p>
      </div>

      <div className="space-y-2">
        {complianceProfiles.map((profile, i) => (
          <button
            key={profile.id}
            onClick={() => setSelected(profile.id)}
            className={`w-full glass-card p-5 text-left transition-all duration-200 animate-fade-in-up flex items-start gap-4 ${
              selected === profile.id
                ? "border-primary/50 bg-primary/5"
                : "hover:border-border/60 hover:bg-card/60"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Radio circle */}
            <div className="mt-0.5 flex-shrink-0">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selected === profile.id
                    ? "border-primary"
                    : "border-muted-foreground/40"
                }`}
              >
                {selected === profile.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-semibold text-foreground">{profile.name}</h3>
                {profile.standards.map((std, j) => (
                  <span
                    key={j}
                    className={`text-xs font-mono px-2 py-0.5 rounded border ${badgeColorMap[std.color] || "bg-muted text-muted-foreground border-border"}`}
                  >
                    {std.label}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{profile.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => toast.success("Compliance profile saved")}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save Profile
        </Button>
      </div>
    </div>
  );
}
