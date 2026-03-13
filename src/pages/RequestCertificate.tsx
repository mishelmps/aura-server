import { useState, useRef } from "react";
import { FilePlus, ArrowRight, ArrowLeft, Check, Upload, FileText, X, FileCode } from "lucide-react";
import { templates } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const manualSteps = ["Select Template", "Subject Details", "Key Options", "Review & Submit"];
const csrSteps = ["Upload CSR", "Select Template", "Review & Submit"];

export default function RequestCertificate() {
  const [mode, setMode] = useState<"manual" | "csr">("manual");
  const [step, setStep] = useState(0);
  const [csrFile, setCsrFile] = useState<File | null>(null);
  const [csrText, setCsrText] = useState("");
  const [csrParsed, setCsrParsed] = useState<{ cn: string; san: string; algorithm: string; keySize: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    templateId: "",
    commonName: "",
    san: "",
    organization: "",
    keyAlgorithm: "RSA",
    keySize: "2048",
  });

  const steps = mode === "manual" ? manualSteps : csrSteps;
  const selectedTemplate = templates.find(t => t.id === form.templateId);

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
      // Simulate CSR parsing
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

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Request Certificate</h1>
        <p className="text-muted-foreground text-sm mt-1">Submit a new certificate request</p>
      </div>

      {/* Mode Toggle */}
      <Tabs value={mode} onValueChange={handleModeChange}>
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="manual" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-4 w-4" /> Manual Request
          </TabsTrigger>
          <TabsTrigger value="csr" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Upload className="h-4 w-4" /> Upload CSR
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              i < step ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30' : i === step ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/30 ring-offset-2 ring-offset-background' : 'bg-secondary text-muted-foreground'
            }`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-gradient-to-r from-primary to-accent' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        {/* ===== MANUAL MODE ===== */}
        {mode === "manual" && step === 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Select a certificate template</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.filter(t => t.published).map(t => (
                <button key={t.id} onClick={() => setForm(f => ({ ...f, templateId: t.id }))}
                  className={`glass-card-hover p-4 text-left ${form.templateId === t.id ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <p className="font-medium text-foreground">{t.displayName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.keyAlgorithm} {t.keySize} · {t.validityPeriod}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "manual" && step === 1 && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Subject Details</h3>
            <div className="space-y-3">
              <div><Label>Common Name (CN)</Label><Input value={form.commonName} onChange={e => setForm(f => ({ ...f, commonName: e.target.value }))} placeholder="server.contoso.com" className="mt-1 bg-secondary/50 border-border/50" /></div>
              <div><Label>Subject Alternative Names (SANs)</Label><Input value={form.san} onChange={e => setForm(f => ({ ...f, san: e.target.value }))} placeholder="dns:server.contoso.com, dns:server" className="mt-1 bg-secondary/50 border-border/50" /></div>
              <div><Label>Organization</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="Contoso Ltd" className="mt-1 bg-secondary/50 border-border/50" /></div>
            </div>
          </div>
        )}

        {mode === "manual" && step === 2 && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Key Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Key Algorithm</Label>
                <Select value={form.keyAlgorithm} onValueChange={v => setForm(f => ({ ...f, keyAlgorithm: v }))}>
                  <SelectTrigger className="mt-1 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="RSA">RSA</SelectItem><SelectItem value="ECDSA">ECDSA</SelectItem></SelectContent>
                </Select>
              </div>
              <div>
                <Label>Key Size</Label>
                <Select value={form.keySize} onValueChange={v => setForm(f => ({ ...f, keySize: v }))}>
                  <SelectTrigger className="mt-1 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="2048">2048</SelectItem><SelectItem value="4096">4096</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {mode === "manual" && step === 3 && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Review Request</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Template</span><span className="text-foreground">{selectedTemplate?.displayName}</span></div>
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Common Name</span><span className="text-foreground">{form.commonName || '—'}</span></div>
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">SANs</span><span className="text-foreground">{form.san || '—'}</span></div>
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Organization</span><span className="text-foreground">{form.organization || '—'}</span></div>
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Key</span><span className="text-foreground">{form.keyAlgorithm} {form.keySize}</span></div>
            </div>
          </div>
        )}

        {/* ===== CSR MODE ===== */}
        {mode === "csr" && step === 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Upload CSR File</h3>
            <p className="text-sm text-muted-foreground">Upload a Certificate Signing Request file (.csr, .pem, .req) or paste its content below.</p>

            {!csrFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/50 rounded-lg p-10 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <input ref={fileInputRef} type="file" accept=".csr,.pem,.req,.txt" className="hidden" onChange={e => e.target.files?.[0] && handleCsrFile(e.target.files[0])} />
                <FileCode className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">Drag & drop your CSR file here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse · .csr, .pem, .req, .txt</p>
              </div>
            ) : (
              <div className="border border-border/50 rounded-lg p-4 bg-secondary/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{csrFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(csrFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => { setCsrFile(null); setCsrText(""); setCsrParsed(null); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {csrParsed && (
                  <div className="space-y-1.5 text-sm border-t border-border/30 pt-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Parsed CSR Details</p>
                    <div className="flex justify-between"><span className="text-muted-foreground">Common Name</span><span className="text-foreground">{csrParsed.cn}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">SANs</span><span className="text-foreground">{csrParsed.san}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Algorithm</span><span className="text-foreground">{csrParsed.algorithm} {csrParsed.keySize}</span></div>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label className="text-muted-foreground text-xs">Or paste CSR content (PEM format)</Label>
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
                className="mt-1 bg-secondary/50 border-border/50 font-mono text-xs min-h-[120px]"
              />
            </div>
          </div>
        )}

        {mode === "csr" && step === 1 && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Select a certificate template</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.filter(t => t.published).map(t => (
                <button key={t.id} onClick={() => setForm(f => ({ ...f, templateId: t.id }))}
                  className={`glass-card-hover p-4 text-left ${form.templateId === t.id ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <p className="font-medium text-foreground">{t.displayName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.keyAlgorithm} {t.keySize} · {t.validityPeriod}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "csr" && step === 2 && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Review Request</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Source</span><span className="text-foreground font-medium">CSR Upload</span></div>
              {csrFile && <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">File</span><span className="text-foreground">{csrFile.name}</span></div>}
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Template</span><span className="text-foreground">{selectedTemplate?.displayName}</span></div>
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Common Name</span><span className="text-foreground">{csrParsed?.cn}</span></div>
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">SANs</span><span className="text-foreground">{csrParsed?.san}</span></div>
              <div className="flex justify-between py-2 border-b border-border/30"><span className="text-muted-foreground">Key</span><span className="text-foreground">{csrParsed?.algorithm} {csrParsed?.keySize}</span></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="border-border/50">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={() => toast.success("Certificate request submitted successfully!")} className="bg-primary text-primary-foreground">
            <FilePlus className="h-4 w-4 mr-1" /> Submit Request
          </Button>
        )}
      </div>
    </div>
  );
}