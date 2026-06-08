import type {
  SiteConfig,
  Navigation,
  Hero,
  Services,
  Marquee,
  Portfolio,
  Contact,
} from './types';

// Static data imports for static site generation
import siteConfigData from '../../data/site-config.json';
import navigationData from '../../data/navigation.json';
import heroData from '../../data/hero.json';
import servicesData from '../../data/services.json';
import marqueeData from '../../data/marquee.json';
import portfolioData from '../../data/portfolio.json';
import contactData from '../../data/contact.json';

// Static data fetching function - returns imported JSON data directly
export async function fetchContent<T>(type: string): Promise<T> {
  switch (type) {
    case 'site-config':
      return siteConfigData as unknown as T;
    case 'navigation':
      return navigationData as unknown as T;
    case 'hero':
      return heroData as unknown as T;
    case 'services':
      return servicesData as unknown as T;
    case 'marquee':
      return marqueeData as unknown as T;
    case 'portfolio':
      return portfolioData as unknown as T;
    case 'contact':
      return contactData as unknown as T;
    default:
      throw new Error(`Unknown data type: ${type}`);
  }
}

export type {
  SiteConfig,
  Navigation,
  Hero,
  Services,
  Marquee,
  Portfolio,
  Contact,
};