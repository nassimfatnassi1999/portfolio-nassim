export const translations = {
  en: {
    /* ─── NAV ─── */
    nav: {
      items: ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Certifications', 'Education', 'Contact'],
      resume: 'Resume',
    },

    /* ─── HERO ─── */
    hero: {
      badge: 'Available for opportunities',
      typingTexts: [
        'Cloud & DevOps Engineer',
        'Platform Engineer',
        'System Administrator',
        'Infrastructure Architect',
      ],
      description: 'Passionate about automation and system performance. I design reliable, modern, and scalable infrastructures combining technical expertise, rigor, and an innovative mindset.',
      viewProjects: 'View Projects',
      getInTouch: 'Get in Touch',
      stats: [
        { value: '4+', label: 'Cloud Platforms' },
        { value: '4', label: 'Professional Roles' },
        { value: '3', label: 'Languages Spoken' },
      ],
    },

    /* ─── ABOUT ─── */
    about: {
      heading: ['About ', 'Me'],
      jobTitle: 'Cloud & DevOps Engineer',
      languages: 'English · French · Arabic',
      profileTitle: 'Profile',
      profileP1: 'Cloud & DevOps Engineer passionate about',
      profileP1Bold1: 'automation',
      profileP1Mid: 'and',
      profileP1Bold2: 'system performance',
      profileP1End: '. I combine technical expertise, rigor, and an innovative mindset to design reliable, modern, and scalable infrastructures.',
      profileP2Start: 'From provisioning cloud resources on ',
      profileP2H1: 'AWS, Azure, GCP, and OpenStack',
      profileP2Mid1: ' to orchestrating containers with ',
      profileP2H2: 'Kubernetes',
      profileP2Mid2: ', building CI/CD pipelines with ',
      profileP2H3: 'Jenkins and GitLab CI',
      profileP2Mid3: ', and implementing observability with ',
      profileP2H4: 'Prometheus & Grafana',
      profileP2End: ' — I deliver end-to-end infrastructure solutions.',
      highlights: [
        { title: 'Cloud Architecture', desc: 'Multi-cloud design on AWS, Azure, GCP & OpenStack' },
        { title: 'Container Orchestration', desc: 'Docker, Kubernetes, Helm, Strimzi' },
        { title: 'Security & Compliance', desc: 'Vault, Trivy, VPN, Firewall, SSH hardening' },
        { title: 'Automation & IaC', desc: 'Terraform, Ansible, Bash, ArgoCD GitOps' },
      ],
    },

    /* ─── SKILLS ─── */
    skills: {
      heading: ['Technical ', 'Skills'],
      subtitle: 'A comprehensive toolkit for building, deploying, and managing modern cloud-native infrastructure.',
      categories: [
        { title: 'Cloud Platforms' },
        { title: 'Containers & Orchestration' },
        { title: 'CI/CD & DevOps Tools' },
        { title: 'Infrastructure as Code' },
        { title: 'Monitoring & Logging' },
        { title: 'Storage & Virtualization' },
        { title: 'Networking & Security' },
        { title: 'Programming & OS' },
      ],
    },

    /* ─── EXPERIENCE ─── */
    experience: {
      heading: ['Professional ', 'Experience'],
      items: [
        {
          role: 'Full Stack & Systems Engineer',
          company: 'APPRENSUR',
          period: 'Jan 2025 – Present',
          description: [
            'Designed and developed CRM web applications using React and NestJS.',
            'Designed and managed databases with PostgreSQL.',
            'Deployed applications on Linux VPS in production environments.',
            'System and network administration (SSH, firewall, configuration, maintenance) with hardening security measures.',
            'Hosting management (Gandi, VPS) and implementation of backup & recovery solutions.',
            'Implemented a CI/CD pipeline with Jenkins (build, tests, deployment) with application deployment via PM2 and Nginx SSL configuration.',
          ],
        },

        {
          role: 'Cloud Engineer',
          company: 'Devoteam',
          period: 'Feb 2025 – Aug 2025',
          description: [
            'Designed, deployed, and automated cloud infrastructures on Azure.',
            'Implemented a Kafka cluster in AKS using the Strimzi operator.',
            'Managed production monitoring and observability with Prometheus, Grafana, and the EFK stack.',
          ],
        },
        {
          role: 'DevOps Engineer Intern',
          company: 'Capgemini Engineering',
          period: 'Jun 2024 – Aug 2024',
          description: [
            'Designed and implemented a full-stack web application with fully automated CI/CD pipelines.',
            'Containerized and orchestrated services using Docker and Kubernetes, improving availability and scalability.',
          ],
        },
        {
          role: 'Full Stack Engineer Intern',
          company: 'BH Bank',
          period: 'Jul 2023 – Sep 2023',
          description: [
            'Developed an internal trainee management application using Laravel, MySQL, and Bootstrap.',
            'Digitized and optimized HR workflows for the organization.',
          ],
        },
        {
          role: 'IT Technician Intern',
          company: 'Tunisair Technics',
          period: 'Feb 2021 – Jun 2021',
          description: [
            'Built an RFID-based stock management system with JavaFX interface and MySQL database.',
            'Enabled real-time tracking of aircraft parts across the warehouse.',
          ],
        },
      ],
    },

    /* ─── PROJECTS ─── */
    projects: {
      heading: ['Featured ', 'Projects'],
      subtitle: 'Academic and professional projects showcasing cloud architecture, CI/CD pipelines, and infrastructure automation.',
      items: [
        {
          title: 'Stockini ERP',
          subtitle: 'Freelance | ERP & Business Management SaaS',
          description:
            'Designed and developed a production-ready ERP platform that centralizes inventory, sales, purchasing, finance, treasury, customer and supplier management. Built with a modern full-stack architecture using Next.js, NestJS, PostgreSQL, Prisma, Redis, and MinIO object storage.',
        },
        {
          title: 'Meat Halal',
          subtitle: 'Freelance | Production Website',
          description:
            'Designed and deployed a professional halal meat showcase and ordering website with a modern mobile-first responsive interface, product presentation, contact and quotation workflows, SEO optimization, performance improvements, domain configuration, hosting, SSL/TLS security, and ongoing maintenance.',
        },
        {
          title: 'GeoDetection Networks CRM',
          subtitle: 'Freelance | Production SaaS CRM',
          description:
            'Designed and built a production-ready business CRM from scratch for utility network detection projects. Delivered the complete full-stack architecture using Next.js, NestJS and PostgreSQL, with secure JWT authentication and RBAC, request and worksite management, DT-DICT workflows, field interventions, deliverables and quality control, KPI dashboards, statistics, reporting, and MinIO-based document storage. Deployed on a hardened Linux VPS with Docker, Nginx, automated CI/CD, backups, monitoring, and security best practices.',
        },
        {
          title: 'Apprensur CRM',
          subtitle: 'B2B SaaS | Railway Industry',
          description:
            'Architected and deployed a secure CRM application infrastructure on bare-metal Linux VPS. Automated CI/CD pipelines with Bash scripting and PM2 process management, while implementing a hardened security layer with UFW/Fail2ban, SSL/TLS automation, and real-time Nginx reverse proxy configuration.',
        },
        {
          title: 'GeoDetectionReseaux',
          subtitle: 'Freelance | Production Web App',
          description:
            'A complete freelance project involving end-to-end development and deployment. Built a responsive web application with React and TailwindCSS, and managed the entire production release including domain configuration and hosting on Gandi.',
        },
        {
          title: 'ViolencesHopital',
          subtitle: 'Freelance | Production Web App',
          description:
            'A showcase website for a health awareness initiative. Built a responsive web application with React and TailwindCSS, and managed the entire production release including domain configuration and hosting on Gandi.',
        },
        {
          title: 'Modern CI/CD Architecture for DevOps',
          subtitle: 'End-to-End DevOps Pipeline',
          description:
            'Built a complete CI/CD pipeline automating deployment, testing, and monitoring of applications in real time. Integrated Jenkins, SonarCloud, Nexus, Docker, Trivy, Kubernetes, Terraform, AKS, Prometheus, and Grafana to ensure quality, security, and reliability.',
        },
        {
          title: 'Cloud Infrastructure with OpenStack',
          subtitle: 'IaaS/PaaS Private Cloud',
          description:
            'Designed and deployed a Cloud infrastructure using OpenStack, integrating an automated Kubernetes cluster for microservices deployment. Used Nova, Neutron, Keystone, Glance, Cinder, Swift, Heat, Horizon, and Magnum with Ansible, Prometheus, and Grafana.',
        },
        {
          title: 'Azure Kafka Cluster (Strimzi on AKS)',
          subtitle: 'Event Streaming Platform',
          description:
            'Deployed a production-grade Kafka cluster on Azure Kubernetes Service using the Strimzi operator. Implemented full observability with Prometheus and Grafana dashboards and log aggregation with EFK stack.',
        },
        {
          title: 'Automated Infrastructure Provisioning',
          subtitle: 'Terraform + Ansible',
          description:
            'Created reusable Terraform modules and Ansible playbooks for automated cloud infrastructure provisioning, configuration management, and application deployment across multi-cloud environments.',
        },
        {
          title: 'Network Supervision and Alerting with Zabbix',
          subtitle: 'Monitoring & Alerting System',
          description:
            'Deployed a Zabbix server to collect metrics from Linux and Windows servers. Configured alerts and thresholds for memory, CPU, disk usage, and bandwidth monitoring to ensure proactive infrastructure management.',
        },
        {
          title: 'Network Security with pfSense, OpenVPN & Snort',
          subtitle: 'Firewall & Intrusion Detection',
          description:
            'Deployed a pfSense firewall to strengthen network security, implementing traffic filtering rules and securing LAN, DMZ, and WAN segments. Integrated OpenVPN for secure remote connections and used Snort for intrusion detection and monitoring of suspicious network activity.',
        },
        {
          title: 'ESPREAT Microservices Application',
          subtitle: 'Full-Stack Microservices | ESPRIT',
          description:
            'Developed a web application for students integrating secure microservices for menu and order management. Implemented authentication, inter-service communication, and cloud deployment with containerization.',
        },
        {
          title: 'HR Trainee Management System',
          subtitle: 'Laravel Web Application',
          description:
            'Developed an internal trainee management application using Laravel, MySQL, and Bootstrap, digitizing and optimizing HR workflows for efficient candidate tracking and onboarding processes.',
        },
      ],
    },

    /* ─── CERTIFICATIONS ─── */
    certifications: {
      heading: 'Certifications',
      items: [
        {
          title: 'MultiCloud Network Associate',
          issuer: 'Aviatrix',
          date: 'Expires: Sep 20, 2028',
          link: 'https://www.credly.com/badges/b518bd52-eba0-4859-aaf7-d8d671686ea2/linked_in_profile',
        },
      ],
    },

    /* ─── EDUCATION ─── */
    education: {
      heading: 'Education',
      items: [
        {
          degree: 'National Engineering Degree in Computer Science',
          school: 'ESPRIT — Private Higher School of Engineering and Technology',
          period: 'Sep 2022 – Sep 2025',
          location: 'Tunisia',
          tags: ['Cloud Computing', 'DevOps', 'Software Engineering', 'Networking', 'Distributed Systems'],
        },
        {
          degree: "Bachelor's Degree in Mechatronics Engineering",
          school: 'Higher Institute of Technological Studies of Béja (ISET Béja)',
          period: 'Sep 2018 – Jun 2021',
          location: 'Tunisia',
          tags: ['Industrial Automation', 'PLC Programming', 'Computer Networks', 'Embedded Systems', 'IT Infrastructure'],
        },
      ],
    },

    /* ─── CONTACT ─── */
    contact: {
      heading: ['Get in ', 'Touch'],
      subtitle: "Looking for a Cloud & DevOps Engineer or Platform Engineer? Let's talk about how I can help build and automate your infrastructure.",
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      terminalEcho: 'echo "Let\'s build something amazing together"',
      terminalOutput: "Let's build something amazing together",
      terminalMail: 'mail -s "Collaboration" Fatnassihnifi.nassim@proton.me',
      terminalSuccess: 'Message sent successfully ✓',
    },

    /* ─── FOOTER ─── */
    footer: {
      copyright: 'Nassim Fatnassi Hnifi — Cloud & DevOps Engineer',
    },
  },

  fr: {
    /* ─── NAV ─── */
    nav: {
      items: ['Accueil', 'À propos', 'Compétences', 'Expérience', 'Projets', 'Certifications', 'Formation', 'Contact'],
      resume: 'CV',
    },

    /* ─── HERO ─── */
    hero: {
      badge: 'Disponible pour de nouvelles opportunités',
      typingTexts: [
        'Ingénieur Cloud & DevOps',
        'Ingénieur Plateforme',
        'Administrateur Système',
        'Architecte Infrastructure',
      ],
      description: "Passionné par l'automatisation et la performance système. Je conçois des infrastructures fiables, modernes et évolutives alliant expertise technique, rigueur et esprit d'innovation.",
      viewProjects: 'Voir les projets',
      getInTouch: 'Me contacter',
      stats: [
        { value: '4+', label: 'Plateformes Cloud' },
        { value: '4', label: 'Postes professionnels' },
        { value: '3', label: 'Langues parlées' },
      ],
    },

    /* ─── ABOUT ─── */
    about: {
      heading: ['À propos de ', 'Moi'],
      jobTitle: 'Ingénieur Cloud & DevOps',
      languages: 'Anglais · Français · Arabe',
      profileTitle: 'Profil',
      profileP1: 'Ingénieur Cloud & DevOps passionné par',
      profileP1Bold1: "l'automatisation",
      profileP1Mid: 'et',
      profileP1Bold2: 'la performance système',
      profileP1End: ". Je combine expertise technique, rigueur et esprit d'innovation pour concevoir des infrastructures fiables, modernes et évolutives.",
      profileP2Start: 'Du provisionnement des ressources cloud sur ',
      profileP2H1: 'AWS, Azure, GCP et OpenStack',
      profileP2Mid1: " à l'orchestration de conteneurs avec ",
      profileP2H2: 'Kubernetes',
      profileP2Mid2: ', en passant par la construction de pipelines CI/CD avec ',
      profileP2H3: 'Jenkins et GitLab CI',
      profileP2Mid3: ", et la mise en place de l'observabilité avec ",
      profileP2H4: 'Prometheus & Grafana',
      profileP2End: " — je fournis des solutions d'infrastructure de bout en bout.",
      highlights: [
        { title: 'Architecture Cloud', desc: 'Conception multi-cloud sur AWS, Azure, GCP & OpenStack' },
        { title: 'Orchestration de Conteneurs', desc: 'Docker, Kubernetes, Helm, Strimzi' },
        { title: 'Sécurité & Conformité', desc: 'Vault, Trivy, VPN, Firewall, durcissement SSH' },
        { title: 'Automatisation & IaC', desc: 'Terraform, Ansible, Bash, ArgoCD GitOps' },
      ],
    },

    /* ─── SKILLS ─── */
    skills: {
      heading: ['Compétences ', 'Techniques'],
      subtitle: "Une boîte à outils complète pour construire, déployer et gérer des infrastructures cloud-native modernes.",
      categories: [
        { title: 'Plateformes Cloud' },
        { title: 'Conteneurs & Orchestration' },
        { title: 'CI/CD & Outils DevOps' },
        { title: "Infrastructure as Code" },
        { title: 'Monitoring & Logging' },
        { title: 'Stockage & Virtualisation' },
        { title: 'Réseau & Sécurité' },
        { title: 'Programmation & OS' },
      ],
    },

    /* ─── EXPERIENCE ─── */
    experience: {
      heading: ['Expérience ', 'Professionnelle'],
      items: [
        {
          role: 'Ingénieur Full Stack & Systèmes',
          company: 'APPRENSUR',
          period: 'Janv 2025 – Présent',
          description: [
            'Conception et développement des applications web CRM avec React et NestJS.',
            'Conception et gestion de la base de données avec PostgreSQL.',
            'Déploiement des applications sur VPS Linux en environnement de prod.',
            'Administration système et réseau (SSH, firewall, configuration, maintenance) avec mise en place de mesures de sécurisation hardening.',
            'Gestion des hébergements (Gandi, VPS) et implémentation de solutions de backup & recovery.',
            'Mise en place d\'un pipeline CI/CD avec Jenkins (build, tests, déploiement) avec déploiement applicatif via PM2 et configuration de Nginx avec SSL.',
          ],
        },
        {
          role: 'Ingénieur Cloud',
          company: 'Devoteam',
          period: 'Fév 2025 – Août 2025',
          description: [
            "Conception, déploiement et automatisation d'infrastructures cloud sur Azure.",
            "Mise en place d'un cluster Kafka dans AKS avec l'opérateur Strimzi.",
            "Gestion du monitoring et de l'observabilité en production avec Prometheus, Grafana et la stack EFK.",
          ],
        },
        {
          role: 'Stagiaire Ingénieur DevOps',
          company: 'Capgemini Engineering',
          period: 'Juin 2024 – Août 2024',
          description: [
            "Conception et mise en œuvre d'une application web full-stack avec des pipelines CI/CD entièrement automatisés.",
            "Conteneurisation et orchestration des services avec Docker et Kubernetes, améliorant la disponibilité et la scalabilité.",
          ],
        },
        {
          role: 'Stagiaire Ingénieur Full Stack',
          company: 'BH Bank',
          period: 'Juil 2023 – Sep 2023',
          description: [
            "Développement d'une application interne de gestion des stagiaires avec Laravel, MySQL et Bootstrap.",
            "Numérisation et optimisation des flux de travail RH pour l'organisation.",
          ],
        },
        {
          role: 'Stagiaire Technicien IT',
          company: 'Tunisair Technics',
          period: 'Fév 2021 – Juin 2021',
          description: [
            "Construction d'un système de gestion de stock basé sur RFID avec interface JavaFX et base de données MySQL.",
            "Suivi en temps réel des pièces d'avion dans l'entrepôt.",
          ],
        },
      ],
    },

    /* ─── PROJECTS ─── */
    projects: {
      heading: ['Projets ', 'Phares'],
      subtitle: "Projets académiques et professionnels mettant en valeur l'architecture cloud, les pipelines CI/CD et l'automatisation d'infrastructure.",
      items: [
        {
          title: 'Stockini ERP',
          subtitle: "Freelance | SaaS ERP & Gestion d'Entreprise",
          description:
            "Conception et développement d'une plateforme ERP production-ready centralisant la gestion des stocks, des ventes, des achats, de la finance, de la trésorerie, des clients et des fournisseurs. Architecture full-stack moderne basée sur Next.js, NestJS, PostgreSQL, Prisma, Redis et le stockage objet MinIO.",
        },
        {
          title: 'Meat Halal',
          subtitle: 'Freelance | Site Web en Production',
          description:
            "Conception et déploiement d'un site professionnel de présentation et de commande de viande halal avec une interface responsive moderne pensée mobile-first, une présentation des produits, des parcours de contact et de demande de devis, des optimisations SEO et de performance, la configuration du domaine, l'hébergement, la sécurisation SSL/TLS et la maintenance continue.",
        },
        {
          title: 'GeoDetection Réseaux CRM',
          subtitle: 'Freelance | Production SaaS CRM',
          description:
            "Conception et développement de A à Z d'un CRM métier production-ready dédié aux projets de détection de réseaux. Réalisation de l'architecture full-stack avec Next.js, NestJS et PostgreSQL, authentification JWT sécurisée et RBAC, gestion des demandes et chantiers, workflows DT-DICT, interventions terrain, livrables et contrôle qualité, tableaux de bord KPI, statistiques, reporting et stockage documentaire avec MinIO. Déploiement sur un VPS Linux renforcé avec Docker, Nginx, CI/CD automatisée, sauvegardes, monitoring et bonnes pratiques de sécurité.",
        },
        {
          title: 'Apprensur CRM',
          subtitle: 'SaaS B2B | Secteur Ferroviaire',
          description:
            "Conception et déploiement d'une infrastructure CRM sécurisée sur VPS Linux bare-metal. Automatisation des pipelines CI/CD via scripts Bash et PM2, avec mise en place d'une couche de sécurité renforcée (UFW/Fail2ban), automatisation SSL/TLS et configuration de proxy inverse Nginx pour le temps réel.",
        },
        {
          title: 'GeoDetectionReseaux',
          subtitle: 'Freelance | App Web en Production',
          description:
            'Un projet freelance complet impliquant le développement et le déploiement de bout en bout. Création d\'une application web responsive avec React et TailwindCSS, et gestion de la mise en production incluant la configuration de domaine et l\'hébergement sur Gandi.',
        },
        {
          title: 'ViolencesHopital',
          subtitle: 'Freelance | Site Vitrine en Production',
          description:
            'Un site vitrine pour une initiative de sensibilisation à la santé. Création d\'une application web responsive avec React et TailwindCSS, et gestion de la mise en production incluant la configuration de domaine et l\'hébergement sur Gandi.',
        },
        {
          title: 'Architecture CI/CD Moderne pour DevOps',
          subtitle: 'Pipeline DevOps de bout en bout',
          description:
            "Construction d'un pipeline CI/CD complet automatisant le déploiement, les tests et le monitoring des applications en temps réel. Intégration de Jenkins, SonarCloud, Nexus, Docker, Trivy, Kubernetes, Terraform, AKS, Prometheus et Grafana pour assurer qualité, sécurité et fiabilité.",
        },
        {
          title: 'Infrastructure Cloud avec OpenStack',
          subtitle: 'Cloud Privé IaaS/PaaS',
          description:
            "Conception et déploiement d'une infrastructure Cloud avec OpenStack, intégrant un cluster Kubernetes automatisé pour le déploiement de microservices. Utilisation de Nova, Neutron, Keystone, Glance, Cinder, Swift, Heat, Horizon et Magnum avec Ansible, Prometheus et Grafana.",
        },
        {
          title: 'Cluster Kafka Azure (Strimzi sur AKS)',
          subtitle: "Plateforme de Streaming d'Événements",
          description:
            "Déploiement d'un cluster Kafka de production sur Azure Kubernetes Service avec l'opérateur Strimzi. Mise en place de l'observabilité complète avec des tableaux de bord Prometheus et Grafana et l'agrégation de logs avec la stack EFK.",
        },
        {
          title: "Provisionnement Automatisé d'Infrastructure",
          subtitle: 'Terraform + Ansible',
          description:
            "Création de modules Terraform réutilisables et de playbooks Ansible pour le provisionnement automatisé d'infrastructure cloud, la gestion de configuration et le déploiement d'applications dans des environnements multi-cloud.",
        },
        {
          title: 'Supervision et Alerting Réseau avec Zabbix',
          subtitle: "Système de Monitoring & Alertes",
          description:
            "Déploiement d'un serveur Zabbix pour collecter les métriques des serveurs Linux et Windows. Configuration d'alertes et de seuils pour le monitoring de la mémoire, CPU, utilisation disque et bande passante afin d'assurer une gestion proactive de l'infrastructure.",
        },
        {
          title: 'Sécurité Réseau avec pfSense, OpenVPN & Snort',
          subtitle: 'Firewall & Détection d\'Intrusions',
          description:
            "Déploiement d'un firewall pfSense pour renforcer la sécurité réseau, implémentation de règles de filtrage de trafic et sécurisation des segments LAN, DMZ et WAN. Intégration d'OpenVPN pour des connexions distantes sécurisées et utilisation de Snort pour la détection d'intrusions et le monitoring d'activités réseau suspectes.",
        },
        {
          title: 'Application Microservices ESPREAT',
          subtitle: 'Microservices Full-Stack | ESPRIT',
          description:
            "Développement d'une application web pour étudiants intégrant des microservices sécurisés pour la gestion des menus et des commandes. Implémentation de l'authentification, communication inter-services et déploiement cloud avec conteneurisation.",
        },
        {
          title: 'Système de Gestion des Stagiaires RH',
          subtitle: 'Application Web Laravel',
          description:
            "Développement d'une application interne de gestion des stagiaires utilisant Laravel, MySQL et Bootstrap, digitalisant et optimisant les workflows RH pour un suivi efficace des candidats et processus d'intégration.",
        },
      ],
    },

    /* ─── CERTIFICATIONS ─── */
    certifications: {
      heading: 'Certifications',
      items: [
        {
          title: 'MultiCloud Network Associate',
          issuer: 'Aviatrix',
          date: 'Expire : 20 Sep 2028',
          link: 'https://www.credly.com/badges/b518bd52-eba0-4859-aaf7-d8d671686ea2/linked_in_profile',
        },
      ],
    },

    /* ─── EDUCATION ─── */
    education: {
      heading: 'Formation',
      items: [
        {
          degree: "Diplôme National d'Ingénieur en Informatique",
          school: "ESPRIT — École Supérieure Privée d'Ingénierie et de Technologies",
          period: 'Sep 2022 – Sep 2025',
          location: 'Tunisie',
          tags: ['Cloud Computing', 'DevOps', 'Génie Logiciel', 'Réseaux', 'Systèmes Distribués'],
        },
        {
          degree: 'Licence en Génie Mécatronique',
          school: 'Institut Supérieur des Études Technologiques de Béja (ISET Béja)',
          period: 'Sep 2018 – Juin 2021',
          location: 'Tunisie',
          tags: ['Automatisation Industrielle', 'Programmation PLC', 'Réseaux Informatiques', 'Systèmes Embarqués', 'Infrastructure IT'],
        },
      ],
    },

    /* ─── CONTACT ─── */
    contact: {
      heading: ['Me ', 'Contacter'],
      subtitle: "À la recherche d'un Ingénieur Cloud & DevOps ou Ingénieur Plateforme ? Discutons de comment je peux vous aider à construire et automatiser votre infrastructure.",
      email: 'Email',
      phone: 'Téléphone',
      location: 'Localisation',
      terminalEcho: 'echo "Construisons quelque chose d\'incroyable ensemble"',
      terminalOutput: "Construisons quelque chose d'incroyable ensemble",
      terminalMail: 'mail -s "Collaboration" Fatnassihnifi.nassim@proton.me',
      terminalSuccess: 'Message envoyé avec succès ✓',
    },

    /* ─── FOOTER ─── */
    footer: {
      copyright: 'Nassim Fatnassi Hnifi — Ingénieur Cloud & DevOps',
    },
  },
} as const;

export type Language = 'en' | 'fr';
export type Translations = typeof translations['en'];
