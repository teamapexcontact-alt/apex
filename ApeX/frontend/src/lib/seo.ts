import type { Metadata, Viewport } from 'next';
import siteConfigData from '../../data/site-config.json';

export const siteConfig = siteConfigData as {
  name: string;
  shortName: string;
  legalName: string;
  tagline: string;
  description: string;
  longDescription: string;
  url: string;
  ogImage: string;
  email: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  location: { city: string; region: string; country: string; countryCode: string };
  foundingDate: string;
  locale: string;
  language: string;
  currency: string;
  timezone: string;
  socialLinks: Record<string, string>;
  keywords: string[];
  services: Array<{ id: string; name: string; description: string }>;
  process: Array<{ step: number; name: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

export const SITE_URL = siteConfig.url;
export const SITE_NAME = siteConfig.name;
export const SITE_SHORT_NAME = siteConfig.shortName;
export const SITE_TAGLINE = siteConfig.tagline;
export const SITE_DESCRIPTION = siteConfig.description;
export const SITE_KEYWORDS = siteConfig.keywords;
export const SITE_LOCALE = siteConfig.locale;
export const SITE_LANGUAGE = siteConfig.language;
export const OG_IMAGE_PATH = siteConfig.ogImage;

const sameAsLinks = Object.values(siteConfig.socialLinks).filter(Boolean);

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#000000' },
  ],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export function getAbsoluteUrl(path = ''): string {
  if (!path) return SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getOgImageUrl(path?: string): string {
  return getAbsoluteUrl(path || OG_IMAGE_PATH);
}

export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
      default: `${SITE_NAME} — ${SITE_TAGLINE}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    generator: 'Next.js',
    category: 'Technology',
    classification: 'Digital Agency',
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    alternates: {
      canonical: '/',
      languages: { 'en-IN': '/', 'en-US': '/', 'en': '/' },
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: getOgImageUrl(),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
      images: [getOgImageUrl()],
      creator: '@apexstudio',
      site: '@apexstudio',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon', type: 'image/svg+xml', sizes: 'any' },
        { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
      other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#d4f000' }],
    },
    manifest: '/manifest.webmanifest',
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': SITE_SHORT_NAME,
      'mobile-web-app-capable': 'yes',
      'application-name': SITE_NAME,
      'msapplication-TileColor': '#000000',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#000000',
      'color-scheme': 'dark',
      'geo.region': 'IN-TG',
      'geo.placename': siteConfig.location.city,
      'geo.position': '17.3850;78.4867',
      'ICBM': '17.3850, 78.4867',
    },
  };
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const path = options.path || '/';
  const canonicalUrl = getAbsoluteUrl(path);
  const imageUrl = getOgImageUrl(options.image);
  const title = options.title;
  const description = options.description;
  const keywords = options.keywords ? Array.from(new Set([...SITE_KEYWORDS, ...options.keywords])) : SITE_KEYWORDS;
  const type = options.type || 'website';
  const noIndex = !!options.noIndex;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: 'en_IN',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: options.imageAlt || `${SITE_NAME} — ${title}`,
          type: 'image/png',
        },
      ],
      ...(type === 'article' && options.publishedTime ? { publishedTime: options.publishedTime } : {}),
      ...(type === 'article' && options.modifiedTime ? { modifiedTime: options.modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@apexstudio',
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
        },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: SITE_NAME,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.shortName,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: getAbsoluteUrl('/icon-512.png'),
      width: 512,
      height: 512,
    },
    image: getAbsoluteUrl('/og-image.png'),
    description: SITE_DESCRIPTION,
    foundingDate: siteConfig.foundingDate,
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.location.city,
        addressRegion: siteConfig.location.region,
        addressCountry: siteConfig.location.countryCode,
      },
    },
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.countryCode,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: siteConfig.email,
        telephone: siteConfig.phoneRaw,
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Hindi'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: siteConfig.email,
        telephone: siteConfig.phoneRaw,
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
    email: siteConfig.email,
    telephone: siteConfig.phoneRaw,
    sameAs: sameAsLinks,
    knowsAbout: [
      'Web Development',
      'AI Automation',
      '3D Web Experiences',
      'WebGL',
      'Brand Identity',
      'Chatbot Development',
      'Performance Optimization',
      'Next.js',
    ],
    knowsLanguage: [siteConfig.language, 'hi'],
    knowsAboutUrl: getAbsoluteUrl('/#services'),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: { '@id': `${SITE_URL}#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  primaryImage?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}${opts.path}#webpage`,
    name: opts.name,
    description: opts.description,
    url: getAbsoluteUrl(opts.path),
    inLanguage: SITE_LANGUAGE,
    isPartOf: { '@id': `${SITE_URL}#website` },
    publisher: { '@id': `${SITE_URL}#organization` },
    primaryImageOfPage: opts.primaryImage
      ? { '@type': 'ImageObject', url: getAbsoluteUrl(opts.primaryImage) }
      : undefined,
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}#localbusiness`,
    name: SITE_NAME,
    legalName: siteConfig.legalName,
    image: getAbsoluteUrl('/og-image.png'),
    url: SITE_URL,
    telephone: siteConfig.phoneRaw,
    email: siteConfig.email,
    priceRange: '$$',
    description: SITE_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.385,
      longitude: 78.4867,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    sameAs: sameAsLinks,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '38',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function serviceJsonLd() {
  return siteConfig.services.map((service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}#service-${service.id}`,
    name: service.name,
    description: service.description,
    serviceType: service.name,
    provider: { '@id': `${SITE_URL}#organization` },
    areaServed: { '@type': 'Country', name: 'Worldwide' },
    url: getAbsoluteUrl(`/#${service.id}`),
  }));
}

export function servicesItemListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}#services-list`,
    name: `${SITE_NAME} Services`,
    description: `Professional services offered by ${SITE_NAME}.`,
    numberOfItems: siteConfig.services.length,
    itemListElement: siteConfig.services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        url: getAbsoluteUrl(`/#${service.id}`),
      },
    })),
  };
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}#faq`,
    mainEntity: siteConfig.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: getAbsoluteUrl(entry.item),
    })),
  };
}

export function portfolioJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}#portfolio`,
    name: `${SITE_NAME} — Featured Work`,
    description: `Selected projects and case studies from ${SITE_NAME}.`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'CreativeWork',
          name: 'iShot Reels',
          description: 'A modern video platform for creating and sharing short-form video content with advanced editing tools and social features.',
          url: 'https://ishottreels.vercel.app/',
          creator: { '@id': `${SITE_URL}#organization` },
          genre: 'Web Development',
        },
      },
    ],
  };
}
