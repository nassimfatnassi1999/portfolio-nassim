import type { ComponentType, SVGProps } from 'react';
import type { SimpleIcon } from 'simple-icons';
import {
  siAnsible,
  siApachemaven,
  siApachetomcat,
  siArgo,
  siCeph,
  siDocker,
  siDotnet,
  siDart,
  siGit,
  siGithub,
  siGitlab,
  siGnubash,
  siGo,
  siGrafana,
  siHarbor,
  siHelm,
  siJavascript,
  siJenkins,
  siKubernetes,
  siLaravel,
  siLinux,
  siManjaro,
  siMinio,
  siMongodb,
  siMysql,
  siNestjs,
  siNginx,
  siNodedotjs,
  siOpenstack,
  siOpentofu,
  siOpenvpn,
  siPfsense,
  siPhp,
  siPm2,
  siPopos,
  siPostgresql,
  siPrometheus,
  siProxmox,
  siPython,
  siRedhat,
  siRedis,
  siSnort,
  siSonarqubecloud,
  siSonarqubeserver,
  siSpringboot,
  siTerraform,
  siTrivy,
  siTypescript,
  siUbuntu,
  siVault,
  siVeeam,
  siVirtualbox,
  siVmware,
  siC,
} from 'simple-icons';
import AmazonWebServicesIcon from 'react-devicons/amazonwebservices/original-wordmark';
import AzureIcon from 'react-devicons/azure/original';
import CSharpIcon from 'react-devicons/csharp/original';
import GoogleCloudIcon from 'react-devicons/googlecloud/original';
import JavaIcon from 'react-devicons/java/original';
import OracleIcon from 'react-devicons/oracle/original';
import PowerShellIcon from 'react-devicons/powershell/original';
import WindowsIcon from 'react-devicons/windows11/original';

type DeviconComponent = ComponentType<SVGProps<SVGElement> & { size?: number | string }>;

export type TechnologyVisual =
  | { kind: 'brand'; source: 'simple-icons'; icon: SimpleIcon }
  | { kind: 'brand'; source: 'devicon'; title: string; Icon: DeviconComponent }
  | { kind: 'fallback'; label: string };

const simpleIconVisuals: Record<string, SimpleIcon> = {
  Linux: siLinux,
  RHEL: siRedhat,
  Ubuntu: siUbuntu,
  Manjaro: siManjaro,
  'Pop!_OS': siPopos,
  Ceph: siCeph,
  Veeam: siVeeam,
  PM2: siPm2,
  VMware: siVmware,
  Proxmox: siProxmox,
  VirtualBox: siVirtualbox,
  OpenStack: siOpenstack,
  Docker: siDocker,
  Kubernetes: siKubernetes,
  Helm: siHelm,
  Harbor: siHarbor,
  Git: siGit,
  GitHub: siGithub,
  'GitLab CI/CD': siGitlab,
  Jenkins: siJenkins,
  'Argo CD': siArgo,
  SonarCloud: siSonarqubecloud,
  SonarQube: siSonarqubeserver,
  Trivy: siTrivy,
  Vault: siVault,
  Maven: siApachemaven,
  Terraform: siTerraform,
  OpenTofu: siOpentofu,
  Ansible: siAnsible,
  Nginx: siNginx,
  Tomcat: siApachetomcat,
  'Spring Boot': siSpringboot,
  '.NET': siDotnet,
  Laravel: siLaravel,
  'Node.js': siNodedotjs,
  NestJS: siNestjs,
  Prometheus: siPrometheus,
  Grafana: siGrafana,
  OpenVPN: siOpenvpn,
  pfSense: siPfsense,
  'Snort IDS': siSnort,
  Bash: siGnubash,
  Python: siPython,
  Golang: siGo,
  C: siC,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  Dart: siDart,
  PHP: siPhp,
  PostgreSQL: siPostgresql,
  MySQL: siMysql,
  MongoDB: siMongodb,
  Redis: siRedis,
  MinIO: siMinio,
};

const deviconVisuals: Record<string, { title: string; Icon: DeviconComponent }> = {
  'Windows Server': { title: 'Microsoft Windows', Icon: WindowsIcon },
  Azure: { title: 'Microsoft Azure', Icon: AzureIcon },
  AWS: { title: 'Amazon Web Services', Icon: AmazonWebServicesIcon },
  'Google Cloud': { title: 'Google Cloud', Icon: GoogleCloudIcon },
  PowerShell: { title: 'PowerShell', Icon: PowerShellIcon },
  Java: { title: 'Java', Icon: JavaIcon },
  'C#': { title: 'C Sharp', Icon: CSharpIcon },
  'Oracle Database': { title: 'Oracle', Icon: OracleIcon },
};

const fallbackLabels: Record<string, string> = {
  AIX: 'AIX',
  SSH: 'SSH',
  LVM: 'LVM',
  RAID: 'RAID',
  'NAS/SAN': 'NAS',
  NFS: 'NFS',
  FTP: 'FTP',
  SMB: 'SMB',
  Rsync: 'RS',
  vSphere: 'vS',
  ESXi: 'ESXi',
  vCenter: 'vC',
  KVM: 'KVM',
  AKS: 'AKS',
  Nova: 'NOVA',
  Neutron: 'NET',
  Keystone: 'KEY',
  Glance: 'IMG',
  Cinder: 'BLK',
  Swift: 'OBJ',
  Heat: 'HOT',
  Horizon: 'UI',
  Magnum: 'K8S',
  'Docker Compose': 'DC',
  Strimzi: 'STR',
  Nexus: 'NX',
  GlassFish: 'GF',
  WebLogic: 'WL',
  WebSphere: 'WS',
  ELK: 'ELK',
  EFK: 'EFK',
  Loki: 'LOKI',
  Promtail: 'PT',
  Zabbix: 'ZBX',
  'TCP/IP': 'TCP',
  DNS: 'DNS',
  DHCP: 'DHCP',
  'HTTP/HTTPS': 'HTTP',
  'LAN/WAN': 'LAN',
  VLAN: 'VLAN',
  VPN: 'VPN',
  Firewall: 'FW',
  NAT: 'NAT',
  ACL: 'ACL',
  Routers: 'RTR',
  Switches: 'SW',
  DMZ: 'DMZ',
  'SSL/TLS': 'TLS',
  UFW: 'UFW',
  Fail2ban: 'F2B',
  Isar: 'ISAR',
};

export function getTechnologyVisual(technology: string): TechnologyVisual {
  const simpleIcon = simpleIconVisuals[technology];
  if (simpleIcon) return { kind: 'brand', source: 'simple-icons', icon: simpleIcon };

  const devicon = deviconVisuals[technology];
  if (devicon) return { kind: 'brand', source: 'devicon', ...devicon };

  const label = fallbackLabels[technology];
  if (label) return { kind: 'fallback', label };

  throw new Error(`Missing technology visual for ${technology}`);
}
