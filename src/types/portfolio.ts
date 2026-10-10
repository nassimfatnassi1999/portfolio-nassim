export type Locale = 'en' | 'fr';
export type LocalizedText = Record<Locale, string>;
export type ProjectPriority = 'infrastructure' | 'mixed' | 'application';
export type CaseStudyOutcome =
  | { kind: 'result'; text: LocalizedText }
  | { kind: 'scope'; text: LocalizedText };

export interface LinkSource {
  label: LocalizedText;
  url: string;
}

export interface LocalizedLink {
  label: string;
  url: string;
}

export interface ResumeSource {
  id: string;
  label: LocalizedText;
  urls: Record<Locale, string>;
}

export interface LocalizedResume {
  id: string;
  label: string;
  url: string;
}

export interface ResumeSet {
  primary: LocalizedResume;
  alternates: LocalizedResume[];
}

export interface ExpertiseSource {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  capabilities: LocalizedText[];
}

export interface LocalizedExpertise {
  id: string;
  title: string;
  description: string;
  capabilities: string[];
}

export interface TechnologyDomainSource {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  technologies: string[];
}

export interface TechnologyDomain {
  id: string;
  label: string;
  description: string;
  technologies: string[];
}

export interface ExperienceSource {
  id: string;
  company: string;
  role: LocalizedText;
  period: LocalizedText;
  mission: LocalizedText;
  environment: string[];
  contributions: LocalizedText[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  mission: string;
  environment: string[];
  contributions: string[];
}

export interface ProjectSource {
  id: string;
  priority: ProjectPriority;
  status: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  problem: LocalizedText;
  architecture: LocalizedText;
  role: LocalizedText;
  outcome: CaseStudyOutcome;
  technologies: string[];
  details?: LocalizedText[];
  links: LinkSource[];
}

export interface Project {
  id: string;
  priority: ProjectPriority;
  status: string;
  title: string;
  subtitle: string;
  problem: string;
  architecture: string;
  role: string;
  outcome: { kind: CaseStudyOutcome['kind']; text: string };
  technologies: string[];
  details: string[];
  links: LocalizedLink[];
}

export interface CertificationSource {
  id: string;
  title: string;
  provider: string;
  date: LocalizedText;
  verifyLabel: LocalizedText;
  url: string;
}

export interface Certification {
  id: string;
  title: string;
  provider: string;
  date: string;
  verifyLabel: string;
  url: string;
}

export interface EducationSource {
  id: string;
  degree: LocalizedText;
  school: LocalizedText;
  period: LocalizedText;
  location: LocalizedText;
  domains: LocalizedText[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  location: string;
  domains: string[];
}

export interface PortfolioSource {
  identity: {
    name: string;
    title: LocalizedText;
    shortTitle: LocalizedText;
    description: LocalizedText;
    availability: LocalizedText;
    location: LocalizedText;
    languages: LocalizedText;
    email: string;
    phoneDisplay: string;
    phoneHref: string;
    portrait: string;
    github: string;
    linkedin: string;
  };
  navigation: Array<{ id: string; label: LocalizedText }>;
  hero: {
    disciplines: LocalizedText[];
    actions: {
      projects: LocalizedText;
      infrastructure: LocalizedText;
      contact: LocalizedText;
    };
    facts: Array<{ value: string; label: LocalizedText }>;
  };
  about: {
    heading: LocalizedText;
    profileLabel: LocalizedText;
    paragraphs: LocalizedText[];
  };
  expertise: ExpertiseSource[];
  technologyDomains: TechnologyDomainSource[];
  experiences: ExperienceSource[];
  projects: ProjectSource[];
  certifications: CertificationSource[];
  education: EducationSource[];
  resumes: ResumeSource[];
  labels: Record<string, LocalizedText>;
  contact: {
    heading: LocalizedText;
    subheading: LocalizedText;
    terminalCommand: string;
    terminalStatus: LocalizedText;
  };
};

export interface LocalizedPortfolio {
  identity: {
    name: string;
    title: string;
    shortTitle: string;
    description: string;
    availability: string;
    location: string;
    languages: string;
    email: string;
    phoneDisplay: string;
    phoneHref: string;
    portrait: string;
    github: string;
    linkedin: string;
  };
  navigation: Array<{ id: string; label: string }>;
  hero: {
    disciplines: string[];
    actions: { projects: string; infrastructure: string; contact: string };
    facts: Array<{ value: string; label: string }>;
  };
  about: { heading: string; profileLabel: string; paragraphs: string[] };
  expertise: LocalizedExpertise[];
  technologyDomains: TechnologyDomain[];
  experiences: Experience[];
  projects: Project[];
  certifications: Certification[];
  education: Education[];
  resumes: ResumeSet;
  labels: Record<string, string>;
  contact: {
    heading: string;
    subheading: string;
    terminalCommand: string;
    terminalStatus: string;
  };
}
