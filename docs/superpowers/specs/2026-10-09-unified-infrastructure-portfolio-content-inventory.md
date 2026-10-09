# Unified Infrastructure Portfolio — Legacy Content Inventory

**Inventory date:** 2026-10-09
**Purpose:** Establish the preservation baseline before removing the Cloud / Software / System Administrator profile mechanism.
**Sources:** `src/translations.ts`, `src/data/cv-profiles.json`, `src/App.tsx`, current section modules, and the user-approved redesign brief.

## Preservation Rules

- Preserve every factual experience, project, certification, education record, contact channel, résumé URL, and working project/demo URL.
- Merge duplicate content by identity, not by profile visibility. A record exposed by more than one profile remains one record.
- Treat technologies explicitly supplied in the approved redesign brief as user-verified portfolio facts.
- Do not carry forward profile-specific marketing copy when it conflicts with the approved unified identity.
- Do not convert descriptive claims into metrics. Counts may only be derived from records in the unified data source.
- Keep English and French versions of every visitor-facing content record.

## Identity and Contact

| Item | Current value | Migration disposition |
| --- | --- | --- |
| Name | Nassim Fatnassi Hnifi | Preserve |
| Unified title | Cloud & DevOps Engineer \| Systems & Infrastructure Administrator | Use as the primary English title |
| French title | Ingénieur Cloud & DevOps \| Administrateur Systèmes & Infrastructure | Use as the primary French title |
| Location | Manouba, Tunis, Tunisia | Preserve; translate country presentation where needed |
| Languages | English, French, Arabic | Preserve |
| Email | `Fatnassihnifi.nassim@proton.me` | Preserve |
| Phone | `+216 28 021 325` | Preserve |
| GitHub | `https://github.com/nassimfatnassi1999` | Preserve |
| LinkedIn | `https://www.linkedin.com/in/nassim-fatnassi-hnifi-a1698a186/` | Use this canonical URL; replace the malformed duplicated-path variant in About/Footer |
| Portrait | `/photo-cv.png` | Preserve |

## Résumé Links

All six existing URLs must survive the migration in the unified data source.

| Existing profile | EN | FR | UI disposition |
| --- | --- | --- | --- |
| Cloud & DevOps | `https://drive.google.com/file/d/1-ql96PCwiaMvd_C-gh1tQtg7pnUA3oP3/view?usp=sharing` | `https://drive.google.com/file/d/1ZFXNKsu356uliNQzl8TwX38s2NMGWoIz/view?usp=sharing` | Primary navbar résumé for the active language |
| Software Engineering | `https://drive.google.com/file/d/1EIeWTHW6uGZp7pi7e_jrUL7u_rhMprKl/view?usp=sharing` | `https://drive.google.com/file/d/1QpTlLhwKvXXG9Mdg0ZrUW4R1zBagLINC/view?usp=sharing` | Preserve as an alternate résumé in the Contact download area |
| Systems Administration | `https://drive.google.com/file/d/1PaKulB_WzUGrK1xBZYDj_qbF2CIT-HWs/view?usp=sharing` | `https://drive.google.com/file/d/1Bjby9RKXzV-Fff3ofmAxSEMOZrtjYmwE/view?usp=sharing` | Preserve as an alternate résumé in the Contact download area |

The résumé choice changes only the downloaded document. It never changes or filters portfolio content.

## Professional Experience

The English and French source files contain the same five records. All five become one chronological timeline.

1. **APPRENSUR — Full Stack & Systems Engineer**
   Period: Jan 2025 – Present.
   Preserve: CRM and business applications; React, Next.js, NestJS, PostgreSQL; business workflows, KPI dashboards, reporting and RBAC; PostgreSQL and MinIO; Linux VPS production deployment; Nginx, PM2, SSL/TLS, backups, CI/CD and monitoring dashboards; maintenance, troubleshooting, performance optimization and production support.
2. **Devoteam — Cloud Engineer**
   Period: Feb 2025 – Aug 2025.
   Preserve: Azure infrastructure design, deployment and automation; Kafka on AKS with Strimzi; Prometheus, Grafana and EFK observability.
3. **Capgemini Engineering — DevOps Engineer Intern**
   Period: Jun 2024 – Aug 2024.
   Preserve: full-stack application; automated CI/CD; Docker and Kubernetes orchestration; availability and scalability statement already present in source.
4. **BH Bank — Full Stack Engineer Intern**
   Period: Jul 2023 – Sep 2023.
   Preserve: Laravel, MySQL and Bootstrap trainee-management application; HR workflow digitization.
5. **Tunisair Technics — IT Technician Intern**
   Period: Feb 2021 – Jun 2021.
   Preserve: RFID stock-management system; JavaFX and MySQL; real-time aircraft-parts tracking.

No experience appears twice. Case-study labels such as Mission, Environment, Contributions and Technologies reorganize existing facts without adding claims.

## Projects

All 16 bilingual project records remain accessible. The migration changes order and presentation, not membership.

### Infrastructure-first group

1. Modern CI/CD Architecture for DevOps
2. Cloud Infrastructure with OpenStack
3. Azure Kafka Cluster (Strimzi on AKS)
4. Automated Infrastructure Provisioning
5. Network Supervision and Alerting with Zabbix
6. Network Security with pfSense, OpenVPN & Snort
7. Apprensur CRM — includes bare-metal Linux VPS, CI/CD, Nginx, security and production operations
8. GeoDetection Networks CRM — includes Linux VPS, Docker, Nginx, CI/CD, backups, monitoring and security

### Mixed infrastructure and application group

9. Stockini ERP
10. Z – AI Voice Email Assistant
11. ESPREAT Microservices Application
12. Meat Halal
13. GeoDetectionReseaux
14. ViolencesHopital

### Application engineering group

15. Job Tracker
16. HR Trainee Management System

### Project/demo links

| Project | URL | Disposition |
| --- | --- | --- |
| Z – AI Voice Email Assistant | `https://drive.google.com/file/d/1Rg8uM8sDo7jywzyfcDDggqW36_TpAo6Z/view?usp=sharing` | Preserve demo action |
| Meat Halal | `https://meat-halal.com` | Preserve live-site action |
| GeoDetectionReseaux | `https://geodetectionreseaux.fr` | Preserve live-site action |
| ViolencesHopital | `https://violences-hopital.com` | Preserve live-site action |

Project case-study fields may only restate source material. When a source does not document a result, the Result field uses a factual delivered capability or is labelled Scope rather than inventing an outcome.

## Certification

One certification is present in both languages:

- **MultiCloud Network Associate** — Aviatrix — expires 20 September 2028.
- Credential URL: `https://www.credly.com/badges/b518bd52-eba0-4859-aaf7-d8d671686ea2/linked_in_profile`

## Education

1. **National Engineering Degree in Computer Science** — ESPRIT — Sep 2022 to Sep 2025 — Tunisia.
   Preserve domains: Cloud Computing, DevOps, Software Engineering, Networking and Distributed Systems.
2. **Bachelor's Degree in Mechatronics Engineering** — ISET Béja — Sep 2018 to Jun 2021 — Tunisia.
   Preserve domains: Industrial Automation, PLC Programming, Computer Networks, Embedded Systems and IT Infrastructure.

## Consolidated Technology Inventory

The toolbox deduplicates naming variants such as GCP / Google Cloud, ArgoCD / Argo CD, K8s / Kubernetes, EFK / EFK Stack, and Bash / Bash Scripting.

### Systems

Linux, RHEL, Ubuntu, Manjaro, Pop!_OS, Windows, Windows Server, AIX, SSH, LVM, RAID, NAS/SAN, NFS, FTP, SMB, Rsync, Veeam, Ceph, PM2, UFW and Fail2ban.

### Virtualization

VMware, VMware vSphere, ESXi, vCenter, KVM, Proxmox and VirtualBox.

### Cloud

Azure, AWS, Google Cloud / GCP, OpenStack, AKS, Nova, Neutron, Keystone, Glance, Cinder, Swift, Heat, Horizon and Magnum.

### Containers and platform engineering

Docker, Docker Compose, Kubernetes, Helm, Harbor and Strimzi.

### DevOps, delivery and infrastructure as code

Git, GitHub, GitLab CI/CD, Jenkins, Argo CD, Terraform, OpenTofu, Ansible, Bash, PowerShell, SonarCloud, SonarQube, Nexus, Trivy, Vault and Maven.

### Middleware and application runtime

Nginx, Tomcat, GlassFish, WebLogic, WebSphere, Spring Boot, .NET, Laravel and Node.js / NestJS.

### Observability

Prometheus, Grafana, ELK, EFK, Loki, Promtail, Zabbix, custom monitoring dashboards, alerting and infrastructure/application health monitoring.

### Networking and security

TCP/IP, DNS, DHCP, HTTP/HTTPS, LAN/WAN, VLAN, VPN, OpenVPN, firewall, NAT, ACL, routers, switches, pfSense, Snort IDS, SSH hardening, DMZ and SSL/TLS.

### Scripting and programming

Bash, PowerShell, Python, Java, Golang, C, C#, JavaScript, TypeScript, Dart and PHP.

### Databases, storage and application data

PostgreSQL, MySQL, Oracle Database, MongoDB, Redis, Isar and MinIO.

### Application engineering retained as supporting breadth

React, Next.js, Angular, Flutter, React/Vite, Tailwind CSS, Bootstrap, JavaFX, Prisma, Riverpod, Material 3, REST APIs, microservices, MVC, API Gateway, JWT, RBAC, responsive UI, local storage, charts, PDF, notifications, RFID, ERP, CRM and SaaS.

## Derived Facts Allowed in the UI

Only values derived directly from the unified data may appear as numeric summaries:

- 4 cloud platforms: AWS, Azure, Google Cloud and OpenStack.
- 5 professional experience records.
- 3 spoken languages.
- 16 documented projects.

No years-of-experience claim, uptime claim, percentage, performance improvement, user count, cost saving, deployment count or incident metric is supported by the current source.

## Legacy Presentation Content to Merge or Retire

### Merge into unified content

- Cloud profile: cloud architecture, containers, CI/CD, infrastructure as code and observability facts.
- Software profile: frontend, backend, database, application architecture and testing/tooling breadth.
- System Administrator profile: server administration, networking, security, storage, backup, virtualization and monitoring facts.
- Role-specific contact subtitles: replace with one Cloud / DevOps / Systems / Infrastructure opportunity statement in both languages.

### Retire after inventory-backed migration

- `cloud-devops`, `software` and `system-admin` profile IDs.
- `experienceFilter` and `projectFilter` arrays.
- Profile-specific themes, taglines, terminals and full-screen transition animations.
- The `?role=` URL parameter and `portfolio-profile` local-storage key.
- Profile-dependent footer titles and duplicated profile marketing copy.
- The malformed LinkedIn URL ending in `/-a1698a186/`.

## Migration Acceptance Baseline

- Exactly 5 experience records remain available in EN and FR.
- Exactly 16 projects remain available in EN and FR.
- The Aviatrix certification and both education records remain available in EN and FR.
- All 6 résumé URLs and 4 project/demo URLs remain represented in the unified data source.
- Email, phone, location, GitHub, canonical LinkedIn and portrait remain present.
- Every consolidated technology above is represented once in an appropriate toolbox domain or retained project/experience record.
- Software engineering evidence remains visible without displacing the primary infrastructure positioning.
- No profile selection is required to reveal any record.
