export interface AgentPort {
  id: string;
  port: number;
  proto: string;
  process: string;
  service: string;
  application?: string;
  applicationTag?: string;
  encryption: string;
  certificate?: string;
  expires?: string;
}

export interface AgentBinding {
  id: string;
  service: string;
  serviceColor: string;
  purpose: string;
  endpoint: string;
  endpointPort: number;
  certificate?: string;
  expires?: string;
  impact: string;
}

export interface AgentApplication {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  certCount: number;
  serviceCount: number;
}

export interface MachineIdentity {
  machine: string;
  domain: string;
  status: string;
  message: string;
}

export interface HistoryEntry {
  id: string;
  type: 'Added' | 'Removed' | 'Changed';
  entity: string;
  key: string;
  timestamp: string;
}

export const agentPorts: Record<string, AgentPort[]> = {
  '1': [
    { id: 'p1', port: 135, proto: 'TCP', process: 'RPC Endpoint Mapper', service: 'RPC', application: 'Insider Threat', applicationTag: 'Insider Threat', encryption: 'None' },
    { id: 'p2', port: 139, proto: 'TCP', process: 'System (Kernel)', service: 'File Sharing', encryption: 'None' },
    { id: 'p3', port: 443, proto: 'TCP', process: 'w3wp.exe', service: 'IIS', application: 'Web Server', encryption: 'TLS 1.2', certificate: 'A1B2C3D4...', expires: '2025-06-15' },
    { id: 'p4', port: 445, proto: 'TCP', process: 'System (Kernel)', service: 'File Sharing', encryption: 'None' },
    { id: 'p5', port: 1042, proto: 'TCP', process: 'asus_framework', service: 'Application', encryption: 'Plain-text' },
    { id: 'p6', port: 3389, proto: 'TCP', process: 'svchost', service: 'RDP', application: 'Remote Desktop', encryption: 'TLS 1.2' },
    { id: 'p7', port: 5000, proto: 'TCP', process: 'MDCertManager.Server', service: 'Application', encryption: 'Plain-text' },
    { id: 'p8', port: 5040, proto: 'TCP', process: 'svchost (:5040)', service: 'System Service', application: 'Insider Threat', applicationTag: 'Insider Threat', encryption: 'None' },
    { id: 'p9', port: 8080, proto: 'TCP', process: 'java.exe', service: 'Application', application: 'API Gateway', encryption: 'TLS 1.3', certificate: 'B2C3D4E5...', expires: '2025-03-10' },
  ],
  '2': [
    { id: 'p1', port: 443, proto: 'TCP', process: 'w3wp.exe', service: 'IIS', application: 'Web Server', encryption: 'TLS 1.2', certificate: 'D4E5F6A1...', expires: '2025-08-22' },
    { id: 'p2', port: 80, proto: 'TCP', process: 'w3wp.exe', service: 'IIS', encryption: 'None' },
    { id: 'p3', port: 3389, proto: 'TCP', process: 'svchost', service: 'RDP', encryption: 'TLS 1.2' },
  ],
};

export const agentBindings: Record<string, AgentBinding[]> = {
  '1': [
    { id: 'b1', service: 'RDP', serviceColor: 'orange', purpose: 'Remote Desktop Connection (RDP)', endpoint: '0.0.0.0', endpointPort: 3389, certificate: '000000000000...', impact: 'MEDIUM' },
    { id: 'b2', service: 'HTTP.sys/IIS', serviceColor: 'green', purpose: 'IIS HTTP.sys Binding (Port 443)', endpoint: '0.0.0.0', endpointPort: 443, certificate: 'a1b2c3d4e5f6...', expires: '2025-06-15', impact: 'HIGH' },
    { id: 'b3', service: 'HTTP.sys/IIS', serviceColor: 'green', purpose: 'IIS HTTP.sys Binding (Port 8080)', endpoint: '0.0.0.0', endpointPort: 8080, certificate: 'b2c3d4e5f6a1...', expires: '2025-03-10', impact: 'MEDIUM' },
    { id: 'b4', service: 'HTTP.sys/IIS', serviceColor: 'green', purpose: 'IIS HTTP.sys Binding (Port 80)', endpoint: '0.0.0.0', endpointPort: 80, impact: 'LOW' },
  ],
  '2': [
    { id: 'b1', service: 'HTTP.sys/IIS', serviceColor: 'green', purpose: 'IIS HTTP.sys Binding (Port 443)', endpoint: '0.0.0.0', endpointPort: 443, certificate: 'd4e5f6a1b2c3...', expires: '2025-08-22', impact: 'HIGH' },
    { id: 'b2', service: 'RDP', serviceColor: 'orange', purpose: 'Remote Desktop Connection (RDP)', endpoint: '0.0.0.0', endpointPort: 3389, impact: 'MEDIUM' },
  ],
};

export const agentApplications: Record<string, AgentApplication[]> = {
  '1': [
    { id: 'a1', name: 'IIS / HTTP.sys Web Server', icon: 'globe', iconColor: 'blue', certCount: 2, serviceCount: 3 },
    { id: 'a2', name: 'Remote Desktop', icon: 'monitor', iconColor: 'orange', certCount: 1, serviceCount: 1 },
  ],
  '2': [
    { id: 'a1', name: 'IIS / HTTP.sys Web Server', icon: 'globe', iconColor: 'blue', certCount: 1, serviceCount: 1 },
    { id: 'a2', name: 'Remote Desktop', icon: 'monitor', iconColor: 'orange', certCount: 0, serviceCount: 1 },
  ],
};

export const agentMachineIdentity: Record<string, MachineIdentity> = {
  '1': { machine: 'WEB-PROD-01', domain: 'contoso.com', status: 'Healthy', message: 'Valid — 365 days remaining' },
  '2': { machine: 'WEB-PROD-02', domain: 'contoso.com', status: 'Healthy', message: 'Valid — 400 days remaining' },
  '3': { machine: 'DB-PROD-01', domain: 'contoso.com', status: 'Healthy', message: 'Valid — 320 days remaining' },
  '5': { machine: 'DC-01', domain: 'contoso.com', status: 'Healthy', message: 'Valid — 365 days remaining' },
  '8': { machine: 'DEV-WS-01', domain: 'Not joined', status: 'Pending', message: 'Awaiting approval' },
  '9': { machine: 'DEV-WS-02', domain: 'Not joined', status: 'Pending', message: 'Awaiting approval' },
};

export const agentHistory: Record<string, HistoryEntry[]> = {
  '1': [
    { id: 'h1', type: 'Added', entity: 'Port', key: 'TCP:443:0.0.0.0', timestamp: '2024-01-15 14:12:55' },
    { id: 'h2', type: 'Added', entity: 'Binding', key: 'HTTP.sys/IIS:443:a1b2c3d4e5f6', timestamp: '2024-01-15 14:12:55' },
    { id: 'h3', type: 'Added', entity: 'Port', key: 'TCP:8080:0.0.0.0', timestamp: '2024-01-15 14:12:55' },
    { id: 'h4', type: 'Added', entity: 'Binding', key: 'HTTP.sys/IIS:8080:b2c3d4e5f6a1', timestamp: '2024-01-15 14:12:55' },
    { id: 'h5', type: 'Changed', entity: 'Certificate', key: 'CN=web-prod-01.contoso.com renewed', timestamp: '2024-01-14 06:00:00' },
    { id: 'h6', type: 'Added', entity: 'Port', key: 'TCP:5000:10.0.1.10', timestamp: '2024-01-13 10:30:00' },
    { id: 'h7', type: 'Removed', entity: 'Port', key: 'TCP:8443:0.0.0.0', timestamp: '2024-01-12 22:15:00' },
    { id: 'h8', type: 'Added', entity: 'Binding', key: 'RDP:3389:000000000000', timestamp: '2024-01-10 08:00:00' },
  ],
  '2': [
    { id: 'h1', type: 'Added', entity: 'Port', key: 'TCP:443:0.0.0.0', timestamp: '2024-01-15 14:10:00' },
    { id: 'h2', type: 'Added', entity: 'Binding', key: 'HTTP.sys/IIS:443:d4e5f6a1b2c3', timestamp: '2024-01-15 14:10:00' },
    { id: 'h3', type: 'Added', entity: 'Port', key: 'TCP:80:0.0.0.0', timestamp: '2024-01-15 14:10:00' },
  ],
};
