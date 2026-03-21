import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Agents from "@/pages/Agents";
import AgentDetail from "@/pages/AgentDetail";
import Alerts from "@/pages/Alerts";
import Certificates from "@/pages/Certificates";
import IssuedCertificates from "@/pages/IssuedCertificates";
import CaManagement from "@/pages/CaManagement";
import Templates from "@/pages/Templates";
import RequestCertificate from "@/pages/RequestCertificate";
import Authorization from "@/pages/Authorization";
import Settings from "@/pages/Settings";
import AgentManagement from "@/pages/AgentManagement";
import EnrollmentKeys from "@/pages/EnrollmentKeys";
import MsiPackages from "@/pages/MsiPackages";
import ComplianceSettings from "@/pages/ComplianceSettings";
import Licensing from "@/pages/Licensing";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/:id" element={<AgentDetail />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/issued-certificates" element={<IssuedCertificates />} />
              <Route path="/ca-management" element={<CaManagement />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/request-certificate" element={<RequestCertificate />} />
              <Route path="/authorization" element={<Authorization />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/agents" element={<AgentManagement />} />
              <Route path="/settings/enrollment-keys" element={<EnrollmentKeys />} />
              <Route path="/settings/msi" element={<MsiPackages />} />
              <Route path="/settings/compliance" element={<ComplianceSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
