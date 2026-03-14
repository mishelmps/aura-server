import { useState, useRef } from "react";
import { FilePlus, ArrowRight, ArrowLeft, Check, Upload, FileText, X, FileCode, Search, Shield, Key, ClipboardList, Monitor } from "lucide-react";
import { templates } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const manualSteps = [
  { label: "Template", icon: ClipboardList },
  { label: "Subject", icon: Monitor },
  { label: "Key Options", icon: Key },
  { label: "Review", icon: Shield },
];
const csrSteps = [
  { label: "Upload CSR", icon: Upload },
  { label: "Template", icon: ClipboardList },
  { label: "Review", icon: Shield },
];

export default function RequestCertificate() {
  const [mode, setMode] = useState<"manual" | "csr">("manual");
  const [step, setStep] = useState(0);
  const [csrFile, setCsrFile] = useState<File | null>(null);
  const [csrText, setCsrText] = useState("");
  const [csrParsed, setCsrParsed] = useState<{ cn: string; san: string; algorithm: string; keySize: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [templateSearch, setTemplateSearch] = useState("");
  const [form, setForm] = useState({
    templateId: "",
    commonName: "",
    san: "",
    organization: "",
    country: "",
    state: "",
    locality: "",
    keyAlgorithm: "RSA",
    keySize: "2048",
    signatureAlgorithm: "SHA-256",
  });

  const steps = mode === "manual" ? manualSteps : csrSteps;
  const selectedTemplate = templates.find(t => t.id === form.templateId);

  const publishedTemplates = templates.filter(t => t.published);
  const filteredTemplates = publishedTemplates.filter(t =>
    t.displayName.toLowerCase().includes(templateSearch.toLowerCase()) ||
    t.keyAlgorithm.toLowerCase().includes(templateSearch.toLowerCase())
  );

  const handleCsrFile = (file: File) => {
    if (!file.name.match(/\.(csr|pem|req|txt)$/i)) {
      toast.error("Invalid file type. Please upload a .csr, .pem, .req, or .txt file.");
      return;
    }
    setCsrFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsrText(text);
      setCsrParsed({
        cn: "server.contoso.com",
        san: "DNS:server.contoso.com, DNS:server",
        algorithm: "RSA",
        keySize: "2048",
      });
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleCsrFile(file);
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode as "manual" | "csr");
    setStep(0);
    setCsrFile(null);
    setCsrText("");
    setCsrParsed(null);
  };

  const canProceed = () => {
    if (mode === "manual") {
      if (step === 0) return !!form.templateId;
      return true;
    } else {
      if (step === 0) return !!csrParsed;
      if (step === 1) return !!form.templateId;
      return true;
    }
  };

  const isLastStep = step === steps.length - 1;

  // Template selection grid (shared between modes)
  const renderTemplateSelection = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Select Certificate Template</h3>
        <p className="text-sm text-muted-foreground mt-1">Choose a published template for your certificate</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={templateSearch}
          onChange={e => setTemplateSearch(e.target.value)}
          placeholder="Search templates by name or algorithm..."
          className="pl-10 bg-secondary/30 border-border/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredTemplates.map(t => {
          const isSelected = form.templateId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setForm(f => ({ ...f, templateId: t.id }))}
              className={`group relative rounded-lg border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-primary/60 bg-primary/10 shadow-[0_0_15px_hsl(var(--primary)/0.15)]'
                  : 'border-border/40 bg-secondary/20 hover:border-border hover:bg-secondary/40'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
              <p className="font-medium text-foreground text-sm pr-6">{t.displayName}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                  {t.keyAlgorithm} {t.keySize}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{t.validityPeriod}</span>
              </div>
              <Badge variant={t.source === 'AD' ? 'default' : 'secondary'} className="text-[10px] mt-2 px-1.5 py-0">
                {t.source}
              </Badge>
            </button>
          );
        })}
      </div>
      {filteredTemplates.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No templates match your search.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Request Certificate</h1>
          <p className="text-muted-foreground text-sm mt-1">Submit a new certificate request via manual entry or CSR upload</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left: Vertical stepper */}
        <div className="hidden md:flex flex-col w-52 shrink-0">
          <Tabs value={mode} onValueChange={handleModeChange} className="mb-6">
            <TabsList className="w-full bg-secondary/50">
              <TabsTrigger value="manual" className="flex-1 text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="h-3.5 w-3.5" /> Manual
              </TabsTrigger>
              <TabsTrigger value="csr" className="flex-1 text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Upload className="h-3.5 w-3.5" /> CSR
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative flex flex-col gap-1">
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              const isCompleted = i < step;
              const isCurrent = i === step;
              return (
                <div key={s.label} className="relative">
                  <button
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                      isCurrent
                        ? 'bg-primary/10 text-foreground'
                        : isCompleted
                        ? 'text-foreground/80 hover:bg-secondary/50 cursor-pointer'
                        : 'text-muted-foreground/50 cursor-default'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-primary/20 text-primary'
                        : isCurrent
                        ? 'bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]'
                        : 'bg-secondary/50 text-muted-foreground/50'
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isCurrent ? 'text-foreground' : ''}`}>{s.label}</p>
                      <p className="text-[10px] text-muted-foreground">Step {i + 1}</p>
                    </div>
                  </button>
                  {i < steps.length - 1 && (
                    <div className="absolute left-[1.35rem] top-[3.25rem] w-px h-2 bg-border/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile stepper */}
        <div className="flex md:hidden items-center gap-2 w-full mb-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                i < step ? 'bg-primary/20 text-primary' :
                i === step ? 'bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]' :
                'bg-secondary text-muted-foreground'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-6 h-px ${i < step ? 'bg-primary/40' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        {/* Right: Content area */}
        <div className="flex-1 min-w-0">
          <div className="glass-card p-6 min-h-[460px]">
            {/* ===== MANUAL MODE ===== */}
            {mode === "manual" && step === 0 && renderTemplateSelection()}

            {mode === "manual" && step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Subject Details</h3>
                  <p className="text-sm text-muted-foreground mt-1">Provide the distinguished name fields for your certificate</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Common Name (CN) <span className="text-destructive">*</span></Label>
                    <Input value={form.commonName} onChange={e => setForm(f => ({ ...f, commonName: e.target.value }))} placeholder="server.contoso.com" className="mt-1.5 bg-secondary/30 border-border/50" />
                    <p className="text-[11px] text-muted-foreground mt-1">Primary FQDN — browsers rely on SAN but most CAs still require CN</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Subject Alternative Names (SANs)</Label>
                    <Textarea value={form.san} onChange={e => setForm(f => ({ ...f, san: e.target.value }))} placeholder="DNS:server.contoso.com&#10;DNS:server&#10;IP:10.0.0.50" className="mt-1.5 bg-secondary/30 border-border/50 min-h-[80px] font-mono text-xs" />
                    <p className="text-[11px] text-muted-foreground mt-1">One SAN per line. Include the CN value. Supports DNS, IP, Email, URI prefixes.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Organization (O)</Label>
                      <Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="Contoso Ltd" className="mt-1.5 bg-secondary/30 border-border/50" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Country (C)</Label>
                      <Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="IL" maxLength={2} className="mt-1.5 bg-secondary/30 border-border/50 uppercase" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">State / Province (ST)</Label>
                      <Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="Tel Aviv" className="mt-1.5 bg-secondary/30 border-border/50" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Locality (L)</Label>
                      <Input value={form.locality} onChange={e => setForm(f => ({ ...f, locality: e.target.value }))} placeholder="Tel Aviv" className="mt-1.5 bg-secondary/30 border-border/50" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === "manual" && step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Key Options</h3>
                  <p className="text-sm text-muted-foreground mt-1">Configure the cryptographic key parameters</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Key Algorithm</Label>
                    <Select value={form.keyAlgorithm} onValueChange={v => setForm(f => ({ ...f, keyAlgorithm: v, keySize: v === 'RSA' ? '2048' : '256' }))}>
                      <SelectTrigger className="mt-1.5 bg-secondary/30 border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RSA">RSA</SelectItem>
                        <SelectItem value="ECDSA">ECDSA</SelectItem>
                        <SelectItem value="Ed25519">Ed25519</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Key Size</Label>
                    <Select value={form.keySize} onValueChange={v => setForm(f => ({ ...f, keySize: v }))}>
                      <SelectTrigger className="mt-1.5 bg-secondary/30 border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {form.keyAlgorithm === 'RSA' && (
                          <>
                            <SelectItem value="2048">2048 bit</SelectItem>
                            <SelectItem value="3072">3072 bit</SelectItem>
                            <SelectItem value="4096">4096 bit</SelectItem>
                          </>
                        )}
                        {form.keyAlgorithm === 'ECDSA' && (
                          <>
                            <SelectItem value="256">P-256 (128-bit)</SelectItem>
                            <SelectItem value="384">P-384 (192-bit)</SelectItem>
                            <SelectItem value="521">P-521 (256-bit)</SelectItem>
                          </>
                        )}
                        {form.keyAlgorithm === 'Ed25519' && (
                          <SelectItem value="255">255 bit (fixed)</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Signature Algorithm</Label>
                  <Select value={form.signatureAlgorithm} onValueChange={v => setForm(f => ({ ...f, signatureAlgorithm: v }))}>
                    <SelectTrigger className="mt-1.5 bg-secondary/30 border-border/50 sm:w-1/2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHA-256">SHA-256</SelectItem>
                      <SelectItem value="SHA-384">SHA-384</SelectItem>
                      <SelectItem value="SHA-512">SHA-512</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Info panel */}
                <div className="rounded-lg border border-border/40 bg-secondary/20 p-4 mt-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Recommendation</p>
                  <p className="text-sm text-foreground/80">
                    {form.keyAlgorithm === 'RSA'
                      ? 'RSA 2048 is the minimum accepted. Use 4096 for long-lived or high-security certificates. Larger keys result in slower TLS handshakes.'
                      : form.keyAlgorithm === 'ECDSA'
                      ? 'ECDSA P-256 offers 128-bit security with smaller keys and faster performance than RSA. P-384 is required by some government standards (CNSA).'
                      : 'Ed25519 provides very fast signing, commonly used in SSH and internal PKI. Limited browser/CA support for TLS certificates.'}
                  </p>
                </div>
              </div>
            )}

            {mode === "manual" && step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Review & Submit</h3>
                  <p className="text-sm text-muted-foreground mt-1">Verify all details before submitting your certificate request</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-secondary/10 divide-y divide-border/30">
                  <ReviewRow label="Template" value={selectedTemplate?.displayName} />
                  <ReviewRow label="Common Name" value={form.commonName} />
                  <ReviewRow label="SANs" value={form.san} mono />
                  <ReviewRow label="Organization" value={form.organization} />
                  <ReviewRow label="Country" value={form.country} />
                  {form.state && <ReviewRow label="State" value={form.state} />}
                  {form.locality && <ReviewRow label="Locality" value={form.locality} />}
                  <ReviewRow label="Key Algorithm" value={`${form.keyAlgorithm} ${form.keySize}-bit`} />
                  <ReviewRow label="Signature" value={form.signatureAlgorithm} />
                  <ReviewRow label="Validity" value={selectedTemplate?.validityPeriod} />
                </div>
              </div>
            )}

            {/* ===== CSR MODE ===== */}
            {mode === "csr" && step === 0 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Upload CSR</h3>
                  <p className="text-sm text-muted-foreground mt-1">Upload a Certificate Signing Request file or paste its PEM content</p>
                </div>

                {!csrFile ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="group border-2 border-dashed border-border/50 rounded-xl p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <input ref={fileInputRef} type="file" accept=".csr,.pem,.req,.txt" className="hidden" onChange={e => e.target.files?.[0] && handleCsrFile(e.target.files[0])} />
                    <div className="w-14 h-14 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                      <FileCode className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Drag & drop your CSR file here</p>
                    <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      {['.csr', '.pem', '.req', '.txt'].map(ext => (
                        <Badge key={ext} variant="secondary" className="text-[10px] px-1.5 py-0">{ext}</Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{csrFile.name}</p>
                          <p className="text-xs text-muted-foreground">{(csrFile.size / 1024).toFixed(1)} KB · Parsed successfully</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setCsrFile(null); setCsrText(""); setCsrParsed(null); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {csrParsed && (
                      <div className="rounded-lg border border-border/40 bg-secondary/10 divide-y divide-border/30">
                        <ReviewRow label="Common Name" value={csrParsed.cn} />
                        <ReviewRow label="SANs" value={csrParsed.san} mono />
                        <ReviewRow label="Algorithm" value={`${csrParsed.algorithm} ${csrParsed.keySize}-bit`} />
                      </div>
                    )}
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-x-0 top-0 flex items-center justify-center -translate-y-1/2">
                    <span className="bg-card px-3 text-xs text-muted-foreground">or paste PEM content</span>
                  </div>
                  <Textarea
                    value={csrText}
                    onChange={e => {
                      setCsrText(e.target.value);
                      if (e.target.value.includes("BEGIN CERTIFICATE REQUEST")) {
                        setCsrParsed({ cn: "server.contoso.com", san: "DNS:server.contoso.com", algorithm: "RSA", keySize: "2048" });
                        setCsrFile(null);
                      }
                    }}
                    placeholder={"-----BEGIN CERTIFICATE REQUEST-----\nMIIC...\n-----END CERTIFICATE REQUEST-----"}
                    className="mt-3 bg-secondary/30 border-border/50 font-mono text-xs min-h-[100px]"
                  />
                </div>
              </div>
            )}

            {mode === "csr" && step === 1 && renderTemplateSelection()}

            {mode === "csr" && step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Review & Submit</h3>
                  <p className="text-sm text-muted-foreground mt-1">Verify all details before submitting your certificate request</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-secondary/10 divide-y divide-border/30">
                  <ReviewRow label="Source" value="CSR Upload" />
                  {csrFile && <ReviewRow label="File" value={csrFile.name} />}
                  <ReviewRow label="Template" value={selectedTemplate?.displayName} />
                  <ReviewRow label="Common Name" value={csrParsed?.cn} />
                  <ReviewRow label="SANs" value={csrParsed?.san} mono />
                  <ReviewRow label="Key" value={`${csrParsed?.algorithm} ${csrParsed?.keySize}-bit`} />
                  <ReviewRow label="Validity" value={selectedTemplate?.validityPeriod} />
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="border-border/50">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
            </Button>
            {!isLastStep ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                Next <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                onClick={() => toast.success("Certificate request submitted successfully!")}
                className="bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
              >
                <FilePlus className="h-4 w-4 mr-1.5" /> Submit Request
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start px-4 py-3">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className={`text-sm text-foreground text-right max-w-[60%] break-all ${mono ? 'font-mono text-xs' : ''}`}>
        {value || '—'}
      </span>
    </div>
  );
}
