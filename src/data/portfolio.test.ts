import { describe, expect, it } from 'vitest';
import { getPortfolio } from './portfolio';

const experienceIds = [
  'apprensur',
  'devoteam',
  'capgemini-engineering',
  'bh-bank',
  'tunisair-technics',
];

const projectIds = [
  'modern-cicd-architecture',
  'openstack-cloud-infrastructure',
  'azure-kafka-strimzi',
  'automated-infrastructure-provisioning',
  'zabbix-supervision',
  'pfsense-network-security',
  'apprensur-crm',
  'geodetection-crm',
  'stockini-erp',
  'z-ai-voice-email',
  'espreat-microservices',
  'meat-halal',
  'geodetectionreseaux',
  'violences-hopital',
  'job-tracker',
  'hr-trainee-management',
];

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

function ids(items: ReadonlyArray<{ id: string }>) {
  return items.map((item) => item.id);
}

describe('unified portfolio content', () => {
  it('preserves every inventoried record and link', () => {
    const portfolio = getPortfolio('en');
    const resumeUrls = [
      portfolio.resumes.primary.url,
      ...portfolio.resumes.alternates.map((resume) => resume.url),
    ];
    const projectUrls = portfolio.projects.flatMap((project) =>
      project.links.map((link) => link.url),
    );

    expect(portfolio.experiences).toHaveLength(5);
    expect(portfolio.projects).toHaveLength(16);
    expect(portfolio.certifications).toHaveLength(1);
    expect(portfolio.education).toHaveLength(2);
    expect(resumeUrls).toEqual([
      'https://drive.google.com/file/d/1-ql96PCwiaMvd_C-gh1tQtg7pnUA3oP3/view?usp=sharing',
      'https://drive.google.com/file/d/1EIeWTHW6uGZp7pi7e_jrUL7u_rhMprKl/view?usp=sharing',
      'https://drive.google.com/file/d/1PaKulB_WzUGrK1xBZYDj_qbF2CIT-HWs/view?usp=sharing',
    ]);
    expect(projectUrls).toEqual([
      'https://drive.google.com/file/d/1Rg8uM8sDo7jywzyfcDDggqW36_TpAo6Z/view?usp=sharing',
      'https://meat-halal.com',
      'https://geodetectionreseaux.fr',
      'https://violences-hopital.com',
    ]);

    const french = getPortfolio('fr');
    expect([
      french.resumes.primary.url,
      ...french.resumes.alternates.map((resume) => resume.url),
    ]).toEqual([
      'https://drive.google.com/file/d/1ZFXNKsu356uliNQzl8TwX38s2NMGWoIz/view?usp=sharing',
      'https://drive.google.com/file/d/1QpTlLhwKvXXG9Mdg0ZrUW4R1zBagLINC/view?usp=sharing',
      'https://drive.google.com/file/d/1Bjby9RKXzV-Fff3ofmAxSEMOZrtjYmwE/view?usp=sharing',
    ]);
  });

  it('keeps English and French record IDs in parity', () => {
    const english = getPortfolio('en');
    const french = getPortfolio('fr');

    expect(ids(english.experiences)).toEqual(experienceIds);
    expect(ids(french.experiences)).toEqual(experienceIds);
    expect(ids(english.projects)).toEqual(projectIds);
    expect(ids(french.projects)).toEqual(projectIds);
    expect(ids(english.expertise)).toEqual(ids(french.expertise));
    expect(ids(english.technologyDomains)).toEqual(ids(french.technologyDomains));
    expect(ids(english.certifications)).toEqual(ids(french.certifications));
    expect(ids(english.education)).toEqual(ids(french.education));
  });

  it('contains no blank localized visitor copy', () => {
    for (const locale of ['en', 'fr'] as const) {
      const strings = collectStrings(getPortfolio(locale));
      expect(strings.length).toBeGreaterThan(250);
      expect(strings.filter((value) => value.trim() === '')).toEqual([]);
    }
  });

  it('keeps stable IDs unique within each collection', () => {
    const portfolio = getPortfolio('en');
    const collections = [
      portfolio.expertise,
      portfolio.technologyDomains,
      portfolio.experiences,
      portfolio.projects,
      portfolio.certifications,
      portfolio.education,
    ];

    for (const collection of collections) {
      const collectionIds = ids(collection);
      expect(new Set(collectionIds).size).toBe(collectionIds.length);
    }
  });

  it('orders infrastructure evidence before application-only projects', () => {
    const projects = getPortfolio('en').projects;
    const priorities = projects.map((project) => project.priority);

    expect(priorities).toEqual([
      ...Array(8).fill('infrastructure'),
      ...Array(6).fill('mixed'),
      ...Array(2).fill('application'),
    ]);
  });

  it('keeps expertise narratives separate from toolbox technologies', () => {
    const portfolio = getPortfolio('en');

    expect(portfolio.expertise).toHaveLength(4);
    expect(
      portfolio.expertise.every((item) => !('technologies' in item)),
    ).toBe(true);
    expect(portfolio.technologyDomains.length).toBeGreaterThanOrEqual(11);
    expect(portfolio.technologyDomains.every((domain) => domain.technologies.length > 0)).toBe(true);
  });
});
