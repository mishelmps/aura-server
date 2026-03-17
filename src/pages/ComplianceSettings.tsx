import { useState } from "react";
import { Save, Check, ShieldCheck } from "lucide-react";
import { complianceProfiles } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const badgeColorMap: Record<string, string> = {
  cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  red: "bg-red-500/20 text-red-300 border-red-500/30",
};

const specRows = [
  { key: "minRsa", label: "Min RSA Key" },
  { key: "minEcc", label: "Min ECC Curve" },
  { key: "hashAlgorithms", label: "Hash Algorithms" },
  { key: "maxValidity", label: "Max Validity" },
  { key: "keyUsage", label: "Key Usage" },
  { key: "sanRequired", label: "SAN Required" },
] as const;

export default function ComplianceSettings() {
  const [selected, setSelected] = useState("none");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Compare and select a cryptographic compliance profile. Applies globally to all certificate requests.
        </p>
      </div>

      <div className="glass-card overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Header - Profile names */}
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-muted-foreground font-medium w-[160px] min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Setting
                  </div>
                </th>
                {complianceProfiles.map((profile) => (
                  <th key={profile.id} className="p-4 text-center min-w-[150px]">
                    <button
                      onClick={() => setSelected(profile.id)}
                      className="w-full group"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selected === profile.id
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/40 group-hover:border-muted-foreground/70"
                          }`}
                        >
                          {selected === profile.id && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className={`font-semibold text-sm transition-colors ${
                          selected === profile.id ? "text-primary" : "text-foreground"
                        }`}>
                          {profile.name}
                        </span>
                        <div className="flex flex-wrap justify-center gap-1">
                          {profile.standards.map((std, j) => (
                            <span
                              key={j}
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${badgeColorMap[std.color] || "bg-muted text-muted-foreground border-border"}`}
                            >
                              {std.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body - Spec rows */}
            <tbody>
              {specRows.map((row, i) => (
                <tr
                  key={row.key}
                  className={`border-b border-border/30 last:border-0 ${
                    i % 2 === 0 ? "bg-card/30" : ""
                  }`}
                >
                  <td className="p-4 text-muted-foreground font-medium whitespace-nowrap">
                    {row.label}
                  </td>
                  {complianceProfiles.map((profile) => {
                    const value = profile.specs[row.key];
                    const display = typeof value === "boolean"
                      ? value ? "Yes" : "No"
                      : value;
                    const isSelected = selected === profile.id;

                    return (
                      <td
                        key={profile.id}
                        className={`p-4 text-center transition-colors ${
                          isSelected
                            ? "bg-primary/5"
                            : ""
                        }`}
                      >
                        <span className={`text-sm ${
                          isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                        }`}>
                          {display}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected profile description */}
      {selected !== "none" && (
        <div className="glass-card p-4 border-primary/30 bg-primary/5 animate-fade-in-up">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">
              {complianceProfiles.find(p => p.id === selected)?.name}:
            </span>{" "}
            {complianceProfiles.find(p => p.id === selected)?.description}
          </p>
        </div>
      )}

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
