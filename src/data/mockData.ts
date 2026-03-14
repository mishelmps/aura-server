export interface Agent {
  id: string;
  hostname: string;
  ipAddress: string;
  os: string;
  status: 'Online' | 'Offline' | 'Pending';
  lastSeen: string;
  version: string;
  certificateCount: number;
  complianceProfile: string;
}

export interface Certificate {
  id: string;
  subject: string;
  thumbprint: string;
  issuer: string;
  status: 'Valid' | 'Expiring' | 'Expired';
  expiryDate: string;
  agentId: string;
  agentHostname: string;
  serialNumber: string;
  templateName: string;
}

export interface IssuedCertificate {
  id: string;
  subject: string;
  serialNumber: string;
  templateName: string;
  status: 'Active' | 'Revoked' | 'Pending';
  issuedDate: string;
  expiryDate: string;
  requestedBy: string;
}

export interface Alert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  message: string;
  timestamp: string;
  source: string;
  acknowledged: boolean;
}

export interface CertificateAuthority {
  id: string;
  commonName: string;
  hostname: string;
  status: 'Online' | 'Offline' | 'Degraded';
  type: 'Enterprise' | 'Standalone';
  templateCount: number;
  issuedCount: number;
  lastSync: string;
}

export interface Template {
  id: string;
  name: string;
  displayName: string;
  oid: string;
  keyAlgorithm: string;
  keySize: number;
  validityPeriod: string;
  published: boolean;
  autoEnroll: boolean;
  source: 'AD' | 'Custom';
}

export interface RoleAssignment {
  id: string;
  userName: string;
  email: string;
  role: 'Admin' | 'Operator' | 'Auditor' | 'Requester';
  scope: string;
  assignedDate: string;
}

export interface EnrollmentKey {
  id: string;
  label: string;
  key: string;
  status: 'Active' | 'Expired' | 'Revoked';
  createdDate: string;
  expiryDate: string;
  usageCount: number;
}

export interface MsiPackage {
  id: string;
  name: string;
  version: string;
  createdDate: string;
  size: string;
  architecture: string;
}

export const agents: Agent[] = [
  { id: '1', hostname: 'WEB-PROD-01', ipAddress: '10.0.1.10', os: 'Windows Server 2022', status: 'Online', lastSeen: '2024-01-15T14:30:00Z', version: '3.2.1', certificateCount: 5, complianceProfile: 'Production' },
  { id: '2', hostname: 'WEB-PROD-02', ipAddress: '10.0.1.11', os: 'Windows Server 2022', status: 'Online', lastSeen: '2024-01-15T14:28:00Z', version: '3.2.1', certificateCount: 3, complianceProfile: 'Production' },
  { id: '3', hostname: 'DB-PROD-01', ipAddress: '10.0.2.10', os: 'Windows Server 2019', status: 'Online', lastSeen: '2024-01-15T14:25:00Z', version: '3.2.0', certificateCount: 2, complianceProfile: 'Production' },
  { id: '4', hostname: 'APP-STAGING-01', ipAddress: '10.0.3.10', os: 'Windows Server 2022', status: 'Online', lastSeen: '2024-01-15T14:20:00Z', version: '3.2.1', certificateCount: 4, complianceProfile: 'Staging' },
  { id: '5', hostname: 'DC-01', ipAddress: '10.0.0.5', os: 'Windows Server 2022', status: 'Online', lastSeen: '2024-01-15T14:30:00Z', version: '3.2.1', certificateCount: 8, complianceProfile: 'Domain Controllers' },
  { id: '6', hostname: 'MAIL-01', ipAddress: '10.0.4.10', os: 'Windows Server 2019', status: 'Offline', lastSeen: '2024-01-14T08:00:00Z', version: '3.1.5', certificateCount: 3, complianceProfile: 'Production' },
  { id: '7', hostname: 'FILE-01', ipAddress: '10.0.5.10', os: 'Windows Server 2019', status: 'Online', lastSeen: '2024-01-15T14:15:00Z', version: '3.2.1', certificateCount: 1, complianceProfile: 'Standard' },
  { id: '8', hostname: 'DEV-WS-01', ipAddress: '10.0.10.20', os: 'Windows 11', status: 'Pending', lastSeen: '2024-01-15T10:00:00Z', version: '3.2.1', certificateCount: 0, complianceProfile: 'Development' },
  { id: '9', hostname: 'DEV-WS-02', ipAddress: '10.0.10.21', os: 'Windows 11', status: 'Pending', lastSeen: '2024-01-15T09:45:00Z', version: '3.2.1', certificateCount: 0, complianceProfile: 'Development' },
  { id: '10', hostname: 'PROXY-01', ipAddress: '10.0.0.100', os: 'Windows Server 2022', status: 'Online', lastSeen: '2024-01-15T14:29:00Z', version: '3.2.1', certificateCount: 6, complianceProfile: 'DMZ' },
  { id: '11', hostname: 'BACKUP-01', ipAddress: '10.0.6.10', os: 'Windows Server 2019', status: 'Offline', lastSeen: '2024-01-13T22:00:00Z', version: '3.0.8', certificateCount: 1, complianceProfile: 'Standard' },
  { id: '12', hostname: 'API-PROD-01', ipAddress: '10.0.1.50', os: 'Windows Server 2022', status: 'Online', lastSeen: '2024-01-15T14:30:00Z', version: '3.2.1', certificateCount: 4, complianceProfile: 'Production' },
];

export const certificates: Certificate[] = [
  { id: '1', subject: 'CN=web-prod-01.contoso.com', thumbprint: 'A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2', issuer: 'CN=Contoso Enterprise CA', status: 'Valid', expiryDate: '2025-06-15', agentId: '1', agentHostname: 'WEB-PROD-01', serialNumber: '6100000004A2B3C4D5', templateName: 'Web Server' },
  { id: '2', subject: 'CN=web-prod-01.contoso.com', thumbprint: 'B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3', issuer: 'CN=Contoso Enterprise CA', status: 'Expiring', expiryDate: '2024-02-20', agentId: '1', agentHostname: 'WEB-PROD-01', serialNumber: '6100000005B3C4D5E6', templateName: 'Web Server' },
  { id: '3', subject: 'CN=*.contoso.com', thumbprint: 'C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4', issuer: 'CN=DigiCert Global CA G2', status: 'Valid', expiryDate: '2025-03-10', agentId: '1', agentHostname: 'WEB-PROD-01', serialNumber: '0F3E2D1C0B9A8F7E6D', templateName: 'Wildcard SSL' },
  { id: '4', subject: 'CN=web-prod-02.contoso.com', thumbprint: 'D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5', issuer: 'CN=Contoso Enterprise CA', status: 'Valid', expiryDate: '2025-08-22', agentId: '2', agentHostname: 'WEB-PROD-02', serialNumber: '6100000006C4D5E6F7', templateName: 'Web Server' },
  { id: '5', subject: 'CN=db-prod-01.contoso.com', thumbprint: 'E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6', issuer: 'CN=Contoso Enterprise CA', status: 'Valid', expiryDate: '2025-11-30', agentId: '3', agentHostname: 'DB-PROD-01', serialNumber: '6100000007D5E6F7A8', templateName: 'Computer' },
  { id: '6', subject: 'CN=app-staging-01.contoso.com', thumbprint: 'F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1', issuer: 'CN=Contoso Enterprise CA', status: 'Expired', expiryDate: '2024-01-05', agentId: '4', agentHostname: 'APP-STAGING-01', serialNumber: '6100000008E6F7A8B9', templateName: 'Web Server' },
  { id: '7', subject: 'CN=DC-01.contoso.com', thumbprint: 'A7B8C9D0E1F2A7B8C9D0E1F2A7B8C9D0E1F2A7B8', issuer: 'CN=Contoso Enterprise CA', status: 'Valid', expiryDate: '2025-04-18', agentId: '5', agentHostname: 'DC-01', serialNumber: '6100000009F7A8B9C0', templateName: 'Domain Controller' },
  { id: '8', subject: 'CN=mail.contoso.com', thumbprint: 'B8C9D0E1F2A7B8C9D0E1F2A7B8C9D0E1F2A7B8C9', issuer: 'CN=Contoso Enterprise CA', status: 'Expiring', expiryDate: '2024-02-10', agentId: '6', agentHostname: 'MAIL-01', serialNumber: '610000000AA8B9C0D1', templateName: 'Exchange Server' },
  { id: '9', subject: 'CN=proxy-01.contoso.com', thumbprint: 'C9D0E1F2A7B8C9D0E1F2A7B8C9D0E1F2A7B8C9D0', issuer: 'CN=DigiCert Global CA G2', status: 'Valid', expiryDate: '2025-09-05', agentId: '10', agentHostname: 'PROXY-01', serialNumber: '1A2B3C4D5E6F7A8B9C', templateName: 'SSL Certificate' },
  { id: '10', subject: 'CN=api.contoso.com', thumbprint: 'D0E1F2A7B8C9D0E1F2A7B8C9D0E1F2A7B8C9D0E1', issuer: 'CN=Contoso Enterprise CA', status: 'Valid', expiryDate: '2025-07-14', agentId: '12', agentHostname: 'API-PROD-01', serialNumber: '610000000BB9C0D1E2', templateName: 'Web Server' },
  { id: '11', subject: 'CN=api-internal.contoso.com', thumbprint: 'E1F2A7B8C9D0E1F2A7B8C9D0E1F2A7B8C9D0E1F2', issuer: 'CN=Contoso Enterprise CA', status: 'Expiring', expiryDate: '2024-02-28', agentId: '12', agentHostname: 'API-PROD-01', serialNumber: '610000000CC0D1E2F3', templateName: 'Web Server Internal' },
  { id: '12', subject: 'CN=file-01.contoso.com', thumbprint: 'F2A7B8C9D0E1F2A7B8C9D0E1F2A7B8C9D0E1F2A7', issuer: 'CN=Contoso Enterprise CA', status: 'Valid', expiryDate: '2025-12-01', agentId: '7', agentHostname: 'FILE-01', serialNumber: '610000000DD1E2F3A4', templateName: 'Computer' },
];

export const issuedCertificates: IssuedCertificate[] = [
  { id: '1', subject: 'CN=web-prod-01.contoso.com', serialNumber: '6100000004A2B3C4D5', templateName: 'Web Server', status: 'Active', issuedDate: '2024-06-15', expiryDate: '2025-06-15', requestedBy: 'admin@contoso.com' },
  { id: '2', subject: 'CN=web-prod-02.contoso.com', serialNumber: '6100000006C4D5E6F7', templateName: 'Web Server', status: 'Active', issuedDate: '2024-08-22', expiryDate: '2025-08-22', requestedBy: 'admin@contoso.com' },
  { id: '3', subject: 'CN=db-prod-01.contoso.com', serialNumber: '6100000007D5E6F7A8', templateName: 'Computer', status: 'Active', issuedDate: '2024-11-30', expiryDate: '2025-11-30', requestedBy: 'svc-autopilot@contoso.com' },
  { id: '4', subject: 'CN=old-server.contoso.com', serialNumber: '6100000001A1B1C1D1', templateName: 'Web Server', status: 'Revoked', issuedDate: '2023-03-15', expiryDate: '2024-03-15', requestedBy: 'admin@contoso.com' },
  { id: '5', subject: 'CN=dev-api.contoso.com', serialNumber: '610000000EE2F3A4B5', templateName: 'Web Server Internal', status: 'Pending', issuedDate: '2024-01-15', expiryDate: '2025-01-15', requestedBy: 'dev@contoso.com' },
  { id: '6', subject: 'CN=api.contoso.com', serialNumber: '610000000BB9C0D1E2', templateName: 'Web Server', status: 'Active', issuedDate: '2024-07-14', expiryDate: '2025-07-14', requestedBy: 'admin@contoso.com' },
];

export const alerts: Alert[] = [
  { id: '1', severity: 'Critical', title: 'Certificate Expired', message: 'Certificate for app-staging-01.contoso.com has expired on 2024-01-05', timestamp: '2024-01-15T14:00:00Z', source: 'APP-STAGING-01', acknowledged: false },
  { id: '2', severity: 'Critical', title: 'Agent Offline', message: 'Agent on BACKUP-01 has not reported in 48+ hours', timestamp: '2024-01-15T10:00:00Z', source: 'BACKUP-01', acknowledged: false },
  { id: '3', severity: 'Warning', title: 'Certificate Expiring Soon', message: 'Certificate for web-prod-01.contoso.com expires in 36 days', timestamp: '2024-01-15T08:00:00Z', source: 'WEB-PROD-01', acknowledged: false },
  { id: '4', severity: 'Warning', title: 'Certificate Expiring Soon', message: 'Certificate for mail.contoso.com expires in 26 days', timestamp: '2024-01-15T08:00:00Z', source: 'MAIL-01', acknowledged: true },
  { id: '5', severity: 'Warning', title: 'Agent Version Outdated', message: 'BACKUP-01 is running agent version 3.0.8 (latest: 3.2.1)', timestamp: '2024-01-14T12:00:00Z', source: 'BACKUP-01', acknowledged: false },
  { id: '6', severity: 'Warning', title: 'Certificate Expiring Soon', message: 'Certificate for api-internal.contoso.com expires in 44 days', timestamp: '2024-01-15T08:00:00Z', source: 'API-PROD-01', acknowledged: false },
  { id: '7', severity: 'Info', title: 'Agent Registered', message: 'New agent DEV-WS-01 registered and awaiting approval', timestamp: '2024-01-15T10:00:00Z', source: 'DEV-WS-01', acknowledged: true },
  { id: '8', severity: 'Info', title: 'Agent Registered', message: 'New agent DEV-WS-02 registered and awaiting approval', timestamp: '2024-01-15T09:45:00Z', source: 'DEV-WS-02', acknowledged: true },
  { id: '9', severity: 'Info', title: 'Certificate Renewed', message: 'Certificate for DC-01.contoso.com was auto-renewed successfully', timestamp: '2024-01-14T06:00:00Z', source: 'DC-01', acknowledged: true },
  { id: '10', severity: 'Critical', title: 'CA Connection Lost', message: 'Unable to reach MAIL-01 Certificate Authority', timestamp: '2024-01-14T08:00:00Z', source: 'MAIL-01', acknowledged: false },
  { id: '11', severity: 'Info', title: 'Compliance Scan Completed', message: 'Compliance scan completed for Production profile. 2 issues found.', timestamp: '2024-01-15T06:00:00Z', source: 'System', acknowledged: true },
  { id: '12', severity: 'Warning', title: 'License Usage High', message: 'Agent license usage is at 85% (12/14 slots used)', timestamp: '2024-01-15T07:00:00Z', source: 'System', acknowledged: false },
];

export const certificateAuthorities: CertificateAuthority[] = [
  { id: '1', commonName: 'Contoso Enterprise CA', hostname: 'CA-01.contoso.com', status: 'Online', type: 'Enterprise', templateCount: 12, issuedCount: 1547, lastSync: '2024-01-15T14:00:00Z' },
  { id: '2', commonName: 'Contoso Root CA', hostname: 'ROOT-CA.contoso.com', status: 'Online', type: 'Standalone', templateCount: 0, issuedCount: 3, lastSync: '2024-01-15T14:00:00Z' },
  { id: '3', commonName: 'Contoso Issuing CA 02', hostname: 'CA-02.contoso.com', status: 'Degraded', type: 'Enterprise', templateCount: 8, issuedCount: 892, lastSync: '2024-01-14T22:00:00Z' },
];

export const templates: Template[] = [
  { id: '1', name: 'WebServer', displayName: 'Web Server', oid: '1.3.6.1.4.1.311.21.8.1', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'AD' },
  { id: '2', name: 'Computer', displayName: 'Computer', oid: '1.3.6.1.4.1.311.21.8.2', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '3', name: 'DomainController', displayName: 'Domain Controller', oid: '1.3.6.1.4.1.311.21.8.3', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '4', name: 'ExchangeServer', displayName: 'Exchange Server', oid: '1.3.6.1.4.1.311.21.8.4', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Years', published: true, autoEnroll: false, source: 'AD' },
  { id: '5', name: 'WebServerInternal', displayName: 'Web Server Internal', oid: '1.3.6.1.4.1.311.21.8.5', keyAlgorithm: 'RSA', keySize: 4096, validityPeriod: '2 Years', published: true, autoEnroll: false, source: 'AD' },
  { id: '6', name: 'CodeSigning', displayName: 'Code Signing', oid: '1.3.6.1.4.1.311.21.8.6', keyAlgorithm: 'RSA', keySize: 4096, validityPeriod: '3 Years', published: false, autoEnroll: false, source: 'AD' },
  { id: '7', name: 'SSLCertificate', displayName: 'SSL Certificate', oid: '1.3.6.1.4.1.311.21.8.7', keyAlgorithm: 'ECDSA', keySize: 384, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'Custom' },
  { id: '8', name: 'WildcardSSL', displayName: 'Wildcard SSL', oid: '1.3.6.1.4.1.311.21.8.8', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'Custom' },
  { id: '9', name: 'UserAuth', displayName: 'User Authentication', oid: '1.3.6.1.4.1.311.21.8.9', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '10', name: 'SmartCardLogon', displayName: 'Smart Card Logon', oid: '1.3.6.1.4.1.311.21.8.10', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '11', name: 'IPSecOffline', displayName: 'IPSec (Offline)', oid: '1.3.6.1.4.1.311.21.8.11', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Years', published: false, autoEnroll: false, source: 'AD' },
  { id: '12', name: 'EFS', displayName: 'Encrypting File System', oid: '1.3.6.1.4.1.311.21.8.12', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'AD' },
  { id: '13', name: 'EFSRecovery', displayName: 'EFS Recovery Agent', oid: '1.3.6.1.4.1.311.21.8.13', keyAlgorithm: 'RSA', keySize: 4096, validityPeriod: '5 Years', published: false, autoEnroll: false, source: 'AD' },
  { id: '14', name: 'DomainControllerAuth', displayName: 'Domain Controller Authentication', oid: '1.3.6.1.4.1.311.21.8.14', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '15', name: 'DirectoryEmailReplication', displayName: 'Directory Email Replication', oid: '1.3.6.1.4.1.311.21.8.15', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '16', name: 'KerberosAuth', displayName: 'Kerberos Authentication', oid: '1.3.6.1.4.1.311.21.8.16', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '17', name: 'OCSP', displayName: 'OCSP Response Signing', oid: '1.3.6.1.4.1.311.21.8.17', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Weeks', published: true, autoEnroll: false, source: 'AD' },
  { id: '18', name: 'RASandIAS', displayName: 'RAS and IAS Server', oid: '1.3.6.1.4.1.311.21.8.18', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Years', published: true, autoEnroll: false, source: 'AD' },
  { id: '19', name: 'CrossCA', displayName: 'Cross Certification Authority', oid: '1.3.6.1.4.1.311.21.8.19', keyAlgorithm: 'RSA', keySize: 4096, validityPeriod: '10 Years', published: false, autoEnroll: false, source: 'AD' },
  { id: '20', name: 'SubCA', displayName: 'Subordinate CA', oid: '1.3.6.1.4.1.311.21.8.20', keyAlgorithm: 'RSA', keySize: 4096, validityPeriod: '5 Years', published: true, autoEnroll: false, source: 'AD' },
  { id: '21', name: 'KeyRecoveryAgent', displayName: 'Key Recovery Agent', oid: '1.3.6.1.4.1.311.21.8.21', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Years', published: false, autoEnroll: false, source: 'AD' },
  { id: '22', name: 'CTLSigning', displayName: 'CTL Signing', oid: '1.3.6.1.4.1.311.21.8.22', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: false, autoEnroll: false, source: 'AD' },
  { id: '23', name: 'EnrollmentAgent', displayName: 'Enrollment Agent', oid: '1.3.6.1.4.1.311.21.8.23', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Years', published: true, autoEnroll: false, source: 'AD' },
  { id: '24', name: 'SmartCardUser', displayName: 'Smart Card User', oid: '1.3.6.1.4.1.311.21.8.24', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'AD' },
  { id: '25', name: 'CAExchange', displayName: 'CA Exchange', oid: '1.3.6.1.4.1.311.21.8.25', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Weeks', published: true, autoEnroll: false, source: 'AD' },
  { id: '26', name: 'CEPEncryption', displayName: 'CEP Encryption', oid: '1.3.6.1.4.1.311.21.8.26', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: false, autoEnroll: false, source: 'AD' },
  { id: '27', name: 'ExchangeUserSig', displayName: 'Exchange Signature Only', oid: '1.3.6.1.4.1.311.21.8.27', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'AD' },
  { id: '28', name: 'ExchangeUserEnc', displayName: 'Exchange Encryption', oid: '1.3.6.1.4.1.311.21.8.28', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'AD' },
  { id: '29', name: 'MachineEnrollmentAgent', displayName: 'Machine Enrollment Agent', oid: '1.3.6.1.4.1.311.21.8.29', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Years', published: false, autoEnroll: false, source: 'AD' },
  { id: '30', name: 'Router', displayName: 'Router (Offline)', oid: '1.3.6.1.4.1.311.21.8.30', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Years', published: false, autoEnroll: false, source: 'AD' },
  { id: '31', name: 'TLSClientECDSA', displayName: 'TLS Client (ECDSA)', oid: '1.3.6.1.4.1.311.21.8.31', keyAlgorithm: 'ECDSA', keySize: 256, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'Custom' },
  { id: '32', name: 'TLSServerECDSA', displayName: 'TLS Server (ECDSA)', oid: '1.3.6.1.4.1.311.21.8.32', keyAlgorithm: 'ECDSA', keySize: 256, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'Custom' },
  { id: '33', name: 'InternalAPI', displayName: 'Internal API Gateway', oid: '1.3.6.1.4.1.311.21.8.33', keyAlgorithm: 'ECDSA', keySize: 384, validityPeriod: '2 Years', published: true, autoEnroll: false, source: 'Custom' },
  { id: '34', name: 'MutualTLS', displayName: 'Mutual TLS (mTLS)', oid: '1.3.6.1.4.1.311.21.8.34', keyAlgorithm: 'ECDSA', keySize: 256, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'Custom' },
  { id: '35', name: 'ServiceMesh', displayName: 'Service Mesh Identity', oid: '1.3.6.1.4.1.311.21.8.35', keyAlgorithm: 'ECDSA', keySize: 256, validityPeriod: '24 Hours', published: true, autoEnroll: true, source: 'Custom' },
  { id: '36', name: 'KubernetesIngress', displayName: 'Kubernetes Ingress', oid: '1.3.6.1.4.1.311.21.8.36', keyAlgorithm: 'ECDSA', keySize: 256, validityPeriod: '90 Days', published: true, autoEnroll: true, source: 'Custom' },
  { id: '37', name: 'DevOpsPipeline', displayName: 'DevOps Pipeline Signing', oid: '1.3.6.1.4.1.311.21.8.37', keyAlgorithm: 'RSA', keySize: 4096, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'Custom' },
  { id: '38', name: 'ContainerImage', displayName: 'Container Image Signing', oid: '1.3.6.1.4.1.311.21.8.38', keyAlgorithm: 'ECDSA', keySize: 256, validityPeriod: '6 Months', published: true, autoEnroll: false, source: 'Custom' },
  { id: '39', name: 'IoTDevice', displayName: 'IoT Device Identity', oid: '1.3.6.1.4.1.311.21.8.39', keyAlgorithm: 'ECDSA', keySize: 256, validityPeriod: '5 Years', published: true, autoEnroll: true, source: 'Custom' },
  { id: '40', name: 'IoTGateway', displayName: 'IoT Gateway', oid: '1.3.6.1.4.1.311.21.8.40', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '3 Years', published: true, autoEnroll: false, source: 'Custom' },
  { id: '41', name: 'TimestampAuthority', displayName: 'Timestamp Authority', oid: '1.3.6.1.4.1.311.21.8.41', keyAlgorithm: 'RSA', keySize: 4096, validityPeriod: '10 Years', published: true, autoEnroll: false, source: 'Custom' },
  { id: '42', name: 'DocumentSigning', displayName: 'Document Signing', oid: '1.3.6.1.4.1.311.21.8.42', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Years', published: true, autoEnroll: false, source: 'Custom' },
  { id: '43', name: 'EmailSMIME', displayName: 'Email S/MIME', oid: '1.3.6.1.4.1.311.21.8.43', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '44', name: 'VPNClient', displayName: 'VPN Client', oid: '1.3.6.1.4.1.311.21.8.44', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '45', name: 'WirelessAuth', displayName: '802.1X Wireless Auth', oid: '1.3.6.1.4.1.311.21.8.45', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '46', name: 'SCEPDevice', displayName: 'SCEP Device Enrollment', oid: '1.3.6.1.4.1.311.21.8.46', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'Custom' },
  { id: '47', name: 'WorkstationAuth', displayName: 'Workstation Authentication', oid: '1.3.6.1.4.1.311.21.8.47', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '48', name: 'BitLockerRecovery', displayName: 'BitLocker Recovery', oid: '1.3.6.1.4.1.311.21.8.48', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: true, source: 'AD' },
  { id: '49', name: 'ADFSProxy', displayName: 'ADFS Proxy SSL', oid: '1.3.6.1.4.1.311.21.8.49', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'AD' },
  { id: '50', name: 'SChannelInternal', displayName: 'SChannel Internal', oid: '1.3.6.1.4.1.311.21.8.50', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Years', published: false, autoEnroll: false, source: 'AD' },
  { id: '51', name: 'ZeroTrustEdge', displayName: 'Zero Trust Edge Gateway', oid: '1.3.6.1.4.1.311.21.8.51', keyAlgorithm: 'ECDSA', keySize: 384, validityPeriod: '1 Year', published: true, autoEnroll: false, source: 'Custom' },
  { id: '52', name: 'SIEMCollector', displayName: 'SIEM Log Collector', oid: '1.3.6.1.4.1.311.21.8.52', keyAlgorithm: 'RSA', keySize: 2048, validityPeriod: '2 Years', published: true, autoEnroll: false, source: 'Custom' },
];

export const roleAssignments: RoleAssignment[] = [
  { id: '1', userName: 'John Smith', email: 'john.smith@contoso.com', role: 'Admin', scope: 'Global', assignedDate: '2023-06-15' },
  { id: '2', userName: 'Sarah Johnson', email: 'sarah.j@contoso.com', role: 'Operator', scope: 'Production Templates', assignedDate: '2023-09-20' },
  { id: '3', userName: 'Mike Chen', email: 'mike.chen@contoso.com', role: 'Auditor', scope: 'Global', assignedDate: '2023-11-01' },
  { id: '4', userName: 'Emily Davis', email: 'emily.d@contoso.com', role: 'Requester', scope: 'Web Server, SSL Certificate', assignedDate: '2024-01-05' },
  { id: '5', userName: 'Alex Turner', email: 'alex.t@contoso.com', role: 'Operator', scope: 'Staging Templates', assignedDate: '2024-01-10' },
];

export const enrollmentKeys: EnrollmentKey[] = [
  { id: '1', label: 'Production Agents', key: 'ENRL-PROD-A1B2-C3D4-E5F6', status: 'Active', createdDate: '2023-06-01', expiryDate: '2025-06-01', usageCount: 8 },
  { id: '2', label: 'Staging Agents', key: 'ENRL-STAG-F7A8-B9C0-D1E2', status: 'Active', createdDate: '2023-09-15', expiryDate: '2025-09-15', usageCount: 2 },
  { id: '3', label: 'Development', key: 'ENRL-DEV0-1234-5678-9ABC', status: 'Active', createdDate: '2024-01-10', expiryDate: '2025-01-10', usageCount: 2 },
  { id: '4', label: 'Legacy Deployment', key: 'ENRL-LEG0-AAAA-BBBB-CCCC', status: 'Expired', createdDate: '2022-01-01', expiryDate: '2023-12-31', usageCount: 15 },
];

export const msiPackages: MsiPackage[] = [
  { id: '1', name: 'MDCertAgent-x64', version: '3.2.1', createdDate: '2024-01-10', size: '24.5 MB', architecture: 'x64' },
  { id: '2', name: 'MDCertAgent-x86', version: '3.2.1', createdDate: '2024-01-10', size: '18.2 MB', architecture: 'x86' },
  { id: '3', name: 'MDCertAgent-x64', version: '3.2.0', createdDate: '2023-12-05', size: '24.1 MB', architecture: 'x64' },
  { id: '4', name: 'MDCertAgent-ARM64', version: '3.2.1', createdDate: '2024-01-10', size: '22.8 MB', architecture: 'ARM64' },
];

export const complianceProfiles = [
  { id: '1', name: 'Production', description: 'Strict compliance for production servers. Requires RSA 2048+ or ECDSA 256+, max 1-year validity.', agentCount: 6, rules: 12 },
  { id: '2', name: 'Staging', description: 'Relaxed compliance for staging/test. Allows self-signed certificates.', agentCount: 1, rules: 6 },
  { id: '3', name: 'Development', description: 'Minimal enforcement for developer workstations.', agentCount: 2, rules: 3 },
  { id: '4', name: 'Domain Controllers', description: 'Specialized profile for domain controllers with Kerberos certificate requirements.', agentCount: 1, rules: 8 },
  { id: '5', name: 'DMZ', description: 'High-security profile for DMZ-facing servers. Requires TLS 1.2+ and strong cipher suites.', agentCount: 1, rules: 15 },
];
