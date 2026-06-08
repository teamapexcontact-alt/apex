export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  twitter: string;
  email: string;
  keywords: string[];
}

export interface Navigation {
  links: Array<{ label: string; href: string }>;
}

export interface Hero {
  tagline: string;
  headline: string;
  description: string;
  ctaButtons: Array<{ text: string; href: string; variant: string }>;
}

export interface Services {
  section: {
    label: string;
    title: string;
    subtitle: string;
  };
  services: Array<{
    number: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface Marquee {
  items: string[];
}

export interface CaseStudyDetails {
  description: string;
  challenges: string[];
  solutions: string[];
  results: string[];
  technologies: string[];
  liveUrl?: string;
  caseStudyUrl?: string;
  images?: string[];
}

export interface PortfolioProject {
  title: string;
  category: string;
  gradient: string;
  accent: string;
  href: string;
  slug: string;
  caseStudy?: CaseStudyDetails;
}

export interface Portfolio {
  section: {
    label: string;
    title: string;
    subtitle: string;
  };
  projects: PortfolioProject[];
}

export interface Contact {
  section: {
    label: string;
    title: string;
    subtitle: string;
  };
  email: string;
  services: string[];
  socialLinks: Array<{ label: string; href: string }>;
}
