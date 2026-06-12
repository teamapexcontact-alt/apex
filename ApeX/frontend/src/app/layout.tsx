import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne, Instrument_Serif, Manrope, Bebas_Neue, Montserrat, Space_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { JsonLd } from "@/components/SEO/JsonLd";
import {
  baseMetadata,
  viewport as seoViewport,
  organizationJsonLd,
  websiteJsonLd,
  localBusinessJsonLd,
  servicesItemListJsonLd,
  faqJsonLd,
  portfolioJsonLd,
} from "@/lib/seo";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const viewport: Viewport = seoViewport;

export const metadata: Metadata = baseMetadata();

const DEFERRED_FONT_HREFS = [
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap",
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Raleway:wght@300;400;600&display=swap",
];

const DEFERRED_TABLER_HREF =
  "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || "";

  const orgLd = organizationJsonLd();
  const siteLd = websiteJsonLd();
  const localLd = localBusinessJsonLd();
  const servicesLd = servicesItemListJsonLd();
  const faqLd = faqJsonLd();
  const portfolioLd = portfolioJsonLd();

  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${instrumentSerif.variable} ${manrope.variable} ${bebasNeue.variable} ${montserrat.variable} ${spaceMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />

        {DEFERRED_FONT_HREFS.map((href) => (
          <link
            key={href}
            rel="preload"
            as="style"
            href={href}
            nonce={nonce}
            fetchPriority="low"
          />
        ))}

        {DEFERRED_FONT_HREFS.map((href) => (
          <link
            key={`${href}-async`}
            rel="stylesheet"
            href={href}
            media="print"
            onLoad={(e) => { (e.currentTarget as HTMLLinkElement).media = "all"; }}
            nonce={nonce}
          />
        ))}

        {DEFERRED_FONT_HREFS.map((href) => (
          <noscript key={`${href}-ns`}>
            <link rel="stylesheet" href={href} />
          </noscript>
        ))}

        <link
          rel="preload"
          as="style"
          href={DEFERRED_TABLER_HREF}
          nonce={nonce}
          fetchPriority="low"
        />
        <link
          rel="stylesheet"
          href={DEFERRED_TABLER_HREF}
          media="print"
          onLoad={(e) => { (e.currentTarget as HTMLLinkElement).media = "all"; }}
          nonce={nonce}
        />
        <noscript>
          <link rel="stylesheet" href={DEFERRED_TABLER_HREF} />
        </noscript>

        <JsonLd data={orgLd} id="org" />
        <JsonLd data={siteLd} id="site" />
        <JsonLd data={localLd} id="local" />
        <JsonLd data={servicesLd} id="services" />
        <JsonLd data={faqLd} id="faq" />
        <JsonLd data={portfolioLd} id="portfolio" />
      </head>
      <body className="antialiased">
        <SkipToContent />
        {children}
        <Analytics nonce={nonce} />
      </body>
    </html>
  );
}
