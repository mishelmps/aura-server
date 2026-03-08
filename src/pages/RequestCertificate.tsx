import { useState } from "react";
import { FilePlus, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { templates } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const steps = ["Select Template", "Subject Details", "Key Options", "Review & Submit"];

export default function RequestCertificate() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    templateId: "",
    commonName: "",
    san: "",
    organization: "",
    keyAlgorithm: "RSA",
    keySize: "2048",
  });

  const selectedTemplate = templates.find(t => t.id === form.templateId);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Request Certificate</h1>
        <p className="text-muted-foreground text-sm mt-1">Submit a new certificate request</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i < step ? 'bg-primary text-primary-foreground' : i === step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        {step === 0 && (
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

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Subject Details</h3>
            <div className="space-y-3">
              <div><Label>Common Name (CN)</Label><Input value={form.commonName} onChange={e => setForm(f => ({ ...f, commonName: e.target.value }))} placeholder="server.contoso.com" className="mt-1 bg-secondary/50 border-border/50" /></div>
              <div><Label>Subject Alternative Names (SANs)</Label><Input value={form.san} onChange={e => setForm(f => ({ ...f, san: e.target.value }))} placeholder="dns:server.contoso.com, dns:server" className="mt-1 bg-secondary/50 border-border/50" /></div>
              <div><Label>Organization</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="Contoso Ltd" className="mt-1 bg-secondary/50 border-border/50" /></div>
            </div>
          </div>
        )}

        {step === 2 && (
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

        {step === 3 && (
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
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="border-border/50">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.templateId}>
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button className="bg-primary text-primary-foreground">
            <FilePlus className="h-4 w-4 mr-1" /> Submit Request
          </Button>
        )}
      </div>
    </div>
  );
}
