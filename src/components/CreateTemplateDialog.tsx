import { useState } from "react";
import { Plus, ChevronRight, ChevronLeft, Shield, Key, FileText, Globe, Lock, Server } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface SanEntry {
  type: string;
  value: string;
}

const SAN_TYPES = [
  { value: "DNS", label: "DNS Name", prefix: "DNS:", example: "www.example.com" },
  { value: "IP", label: "IP Address", prefix: "IP:", example: "10.0.0.50" },
  { value: "Email", label: "Email (RFC822)", prefix: "email:", example: "admin@example.com" },
  { value: "URI", label: "URI", prefix: "URI:", example: "https://idp.example.com/metadata" },
  { value: "DirName", label: "Directory Name", prefix: "dirName:", example: "CN=svc,O=MyOrg,C=IL" },
  { value: "RID", label: "Registered ID (OID)", prefix: "RID:", example: "1.2.3.4.5" },
  { value: "UPN", label: "otherName (UPN)", prefix: "otherName:", example: "user@domain.com" },
  { value: "SRV", label: "otherName (SRV)", prefix: "otherName:", example: "_ldap._tcp.dc.local" },
];

const KEY_ALGORITHMS = [
  { value: "RSA", sizes: ["2048", "3072", "4096"], description: "Universal compatibility" },
  { value: "ECDSA", sizes: ["P-256", "P-384", "P-521"], description: "Faster, smaller keys" },
  { value: "Ed25519", sizes: ["255"], description: "Fast signing, limited TLS support" },
  { value: "Ed448", sizes: ["448"], description: "High security Edwards curve" },
];

const SIGNATURE_ALGORITHMS = ["SHA-256", "SHA-384", "SHA-512"];

const KEY_USAGES = [
  { id: "digitalSignature", label: "Digital Signature" },
  { id: "keyEncipherment", label: "Key Encipherment" },
  { id: "keyAgreement", label: "Key Agreement" },
  { id: "dataEncipherment", label: "Data Encipherment" },
  { id: "certSigning", label: "Certificate Signing" },
  { id: "crlSigning", label: "CRL Signing" },
];

const ENHANCED_KEY_USAGES = [
  { id: "serverAuth", label: "Server Authentication", oid: "1.3.6.1.5.5.7.3.1" },
  { id: "clientAuth", label: "Client Authentication", oid: "1.3.6.1.5.5.7.3.2" },
  { id: "codeSigning", label: "Code Signing", oid: "1.3.6.1.5.5.7.3.3" },
  { id: "emailProtection", label: "Email Protection", oid: "1.3.6.1.5.5.7.3.4" },
  { id: "timeStamping", label: "Time Stamping", oid: "1.3.6.1.5.5.7.3.8" },
  { id: "ocspSigning", label: "OCSP Signing", oid: "1.3.6.1.5.5.7.3.9" },
];

const OUTPUT_FORMATS = ["PEM (.pem/.crt)", "DER (.der/.cer)", "PFX/PKCS#12 (.pfx/.p12)", "PKCS#8 (.p8)"];

export default function CreateTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  // Step 0: Subject Info
  const [commonName, setCommonName] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [locality, setLocality] = useState("");
  const [ou, setOu] = useState("");

  // Step 1: SANs
  const [sans, setSans] = useState<SanEntry[]>([]);
  const [newSanType, setNewSanType] = useState("DNS");
  const [newSanValue, setNewSanValue] = useState("");

  // Step 2: Key Options
  const [keyAlgorithm, setKeyAlgorithm] = useState("RSA");
  const [keySize, setKeySize] = useState("2048");
  const [signatureAlgorithm, setSignatureAlgorithm] = useState("SHA-256");
  const [exportable, setExportable] = useState(false);
  const [keyStorage, setKeyStorage] = useState("software");
  const [outputFormat, setOutputFormat] = useState("PEM (.pem/.crt)");

  // Step 3: Usage & Policy
  const [keyUsages, setKeyUsages] = useState<string[]>(["digitalSignature", "keyEncipherment"]);
  const [ekus, setEkus] = useState<string[]>(["serverAuth"]);
  const [validityPeriod, setValidityPeriod] = useState("1 Year");
  const [autoEnroll, setAutoEnroll] = useState(false);
  const [published, setPublished] = useState(true);

  const steps = [
    { label: "Subject", icon: FileText },
    { label: "SANs", icon: Globe },
    { label: "Key", icon: Key },
    { label: "Policy", icon: Shield },
  ];

  const currentAlgo = KEY_ALGORITHMS.find(a => a.value === keyAlgorithm);

  const addSan = () => {
    if (newSanValue.trim()) {
      setSans([...sans, { type: newSanType, value: newSanValue.trim() }]);
      setNewSanValue("");
    }
  };

  const removeSan = (index: number) => {
    setSans(sans.filter((_, i) => i !== index));
  };

  const toggleKeyUsage = (id: string) => {
    setKeyUsages(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  };

  const toggleEku = (id: string) => {
    setEkus(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    setOpen(false);
    setStep(0);
    // Reset form
    setCommonName(""); setOrganization(""); setCountry(""); setState(""); setLocality(""); setOu("");
    setSans([]); setNewSanValue("");
    setKeyAlgorithm("RSA"); setKeySize("2048"); setSignatureAlgorithm("SHA-256");
    setExportable(false); setKeyStorage("software"); setOutputFormat("PEM (.pem/.crt)");
    setKeyUsages(["digitalSignature", "keyEncipherment"]); setEkus(["serverAuth"]);
    setValidityPeriod("1 Year"); setAutoEnroll(false); setPublished(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-[0_0_20px_hsl(var(--glow-blue)/0.3)]">
          <Plus className="h-4 w-4" /> New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-hidden flex flex-col bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">Create Certificate Template</DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center gap-1 px-1 py-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={i} className="flex items-center gap-1 flex-1">
                <button
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full
                    ${isActive ? "bg-primary/15 text-primary border border-primary/30" : ""}
                    ${isDone ? "bg-secondary text-foreground" : ""}
                    ${!isActive && !isDone ? "text-muted-foreground hover:text-foreground" : ""}
                  `}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
                {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-1 space-y-4 min-h-0">
          {/* STEP 0: Subject */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="glass-card p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Required Information
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Common Name (CN) *</Label>
                    <Input placeholder="www.example.com" value={commonName} onChange={e => setCommonName(e.target.value)} className="mt-1 bg-secondary/50 border-border/50" />
                    <p className="text-[10px] text-muted-foreground mt-1">Primary FQDN. Browsers rely on SAN, but most CAs still require this.</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Signature Algorithm *</Label>
                    <Select value={signatureAlgorithm} onValueChange={setSignatureAlgorithm}>
                      <SelectTrigger className="mt-1 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SIGNATURE_ALGORITHMS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Server className="h-4 w-4 text-accent" /> Organization (OV/EV)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Organization (O)</Label>
                    <Input placeholder="Contoso Ltd." value={organization} onChange={e => setOrganization(e.target.value)} className="mt-1 bg-secondary/50 border-border/50" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Country (C)</Label>
                    <Input placeholder="IL" maxLength={2} value={country} onChange={e => setCountry(e.target.value.toUpperCase())} className="mt-1 bg-secondary/50 border-border/50" />
                    <p className="text-[10px] text-muted-foreground mt-1">ISO 3166-1 alpha-2</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">State / Province (ST)</Label>
                    <Input placeholder="Tel Aviv" value={state} onChange={e => setState(e.target.value)} className="mt-1 bg-secondary/50 border-border/50" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Locality (L)</Label>
                    <Input placeholder="Tel Aviv" value={locality} onChange={e => setLocality(e.target.value)} className="mt-1 bg-secondary/50 border-border/50" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Organizational Unit (OU)</Label>
                    <Input placeholder="IT Department" value={ou} onChange={e => setOu(e.target.value)} className="mt-1 bg-secondary/50 border-border/50" />
                    <p className="text-[10px] text-muted-foreground mt-1">Deprecated by most CAs since 2022</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: SANs */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="glass-card p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" /> Subject Alternative Names
                </h3>
                <p className="text-[11px] text-muted-foreground">All FQDNs / IPs the certificate should cover. Must include the CN value.</p>

                <div className="flex gap-2">
                  <Select value={newSanType} onValueChange={setNewSanType}>
                    <SelectTrigger className="w-[160px] bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SAN_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder={SAN_TYPES.find(t => t.value === newSanType)?.example}
                    value={newSanValue}
                    onChange={e => setNewSanValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addSan()}
                    className="flex-1 bg-secondary/50 border-border/50"
                  />
                  <Button onClick={addSan} size="sm" variant="outline">Add</Button>
                </div>

                {sans.length > 0 && (
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                    {sans.map((san, i) => {
                      const typeInfo = SAN_TYPES.find(t => t.value === san.type);
                      return (
                        <div key={i} className="flex items-center justify-between bg-secondary/40 rounded-lg px-3 py-2 group">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-mono">{typeInfo?.prefix}</Badge>
                            <span className="text-sm font-mono text-foreground">{san.value}</span>
                          </div>
                          <button onClick={() => removeSan(i)} className="text-muted-foreground hover:text-destructive text-xs opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {sans.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground text-xs border border-dashed border-border/50 rounded-lg">
                    No SANs added yet. Public CAs typically only issue DNS and IP SANs.
                  </div>
                )}
              </div>

              <div className="glass-card p-4">
                <h3 className="text-xs font-semibold text-muted-foreground mb-2">SAN Types Reference</h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {SAN_TYPES.map(t => (
                    <div key={t.value} className="text-[10px] text-muted-foreground flex items-start gap-1">
                      <code className="text-primary/70 font-mono shrink-0">{t.prefix}</code>
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Key Options */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="glass-card p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" /> Key Algorithm
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {KEY_ALGORITHMS.map(algo => (
                    <button
                      key={algo.value}
                      onClick={() => { setKeyAlgorithm(algo.value); setKeySize(algo.sizes[0]); }}
                      className={`p-3 rounded-lg border text-left transition-all
                        ${keyAlgorithm === algo.value
                          ? "border-primary/50 bg-primary/10 shadow-[0_0_12px_hsl(var(--glow-blue)/0.15)]"
                          : "border-border/30 bg-secondary/30 hover:border-border/60"}
                      `}
                    >
                      <div className="text-sm font-semibold text-foreground">{algo.value}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{algo.description}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Key Size</Label>
                    <Select value={keySize} onValueChange={setKeySize}>
                      <SelectTrigger className="mt-1 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {currentAlgo?.sizes.map(s => <SelectItem key={s} value={s}>{s}{keyAlgorithm === "RSA" ? " bits" : ""}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger className="mt-1 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {OUTPUT_FORMATS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-accent" /> Key Protection
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Key Storage Provider</Label>
                    <Select value={keyStorage} onValueChange={setKeyStorage}>
                      <SelectTrigger className="mt-1 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software">Software (OS Key Store)</SelectItem>
                        <SelectItem value="tpm">TPM</SelectItem>
                        <SelectItem value="hsm">HSM (PKCS#11)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-3 mt-5">
                    <Label className="text-xs text-muted-foreground">Exportable Key</Label>
                    <Switch checked={exportable} onCheckedChange={setExportable} />
                  </div>
                </div>
                {exportable && (
                  <p className="text-[10px] text-orange-400/80 bg-orange-400/5 border border-orange-400/10 rounded-md px-3 py-2">
                    ⚠ Exportable keys are less secure. Only enable if backup or migration is required.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Usage & Policy */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="glass-card p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Key Usage (KU)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {KEY_USAGES.map(ku => (
                    <label key={ku.id} className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-secondary/50 transition-colors">
                      <Checkbox checked={keyUsages.includes(ku.id)} onCheckedChange={() => toggleKeyUsage(ku.id)} />
                      <span className="text-xs text-foreground">{ku.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent" /> Enhanced Key Usage (EKU)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {ENHANCED_KEY_USAGES.map(eku => (
                    <label key={eku.id} className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-secondary/50 transition-colors">
                      <Checkbox checked={ekus.includes(eku.id)} onCheckedChange={() => toggleEku(eku.id)} />
                      <div>
                        <span className="text-xs text-foreground block">{eku.label}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{eku.oid}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Template Settings</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Validity Period</Label>
                    <Select value={validityPeriod} onValueChange={setValidityPeriod}>
                      <SelectTrigger className="mt-1 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90 Days">90 Days</SelectItem>
                        <SelectItem value="6 Months">6 Months</SelectItem>
                        <SelectItem value="1 Year">1 Year</SelectItem>
                        <SelectItem value="2 Years">2 Years</SelectItem>
                        <SelectItem value="3 Years">3 Years</SelectItem>
                        <SelectItem value="5 Years">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3 mt-5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Auto-Enroll</Label>
                      <Switch checked={autoEnroll} onCheckedChange={setAutoEnroll} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Published</Label>
                      <Switch checked={published} onCheckedChange={setPublished} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <Button
            variant="ghost"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="gap-1 text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Back
          </Button>
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/50" : "w-1.5 bg-border"}`} />
            ))}
          </div>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} className="gap-1 text-xs">
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button onClick={handleCreate} className="gap-1 text-xs shadow-[0_0_20px_hsl(var(--glow-green)/0.3)] bg-emerald-600 hover:bg-emerald-500">
              Create Template
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
