import type { MetadataRoute } from "next";
import { siteConfig, getAbsoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const now = new Date();

type Section = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const SECTIONS: Section[] = [
  { path: "/#hero", changeFrequency: "weekly", priority: 1.0 },
  { path: "/#about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/#services", changeFrequency: "weekly", priority: 0.95 },
  { path: "/#portfolio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/#why-choose-us", changeFrequency: "monthly", priority: 0.8 },
  { path: "/#our-process", changeFrequency: "monthly", priority: 0.7 },
  { path: "/#contact", changeFrequency: "monthly", priority: 0.85 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: siteConfig.url,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1.0,
    alternates: {
      languages: {
        "en-IN": siteConfig.url,
        "en-US": siteConfig.url,
        en: siteConfig.url,
      },
    },
  };

  const sectionEntries: MetadataRoute.Sitemap = SECTIONS.map((section) => ({
    url: getAbsoluteUrl(section.path),
    lastModified: now,
    changeFrequency: section.changeFrequency,
    priority: section.priority,
  }));

  return [homeEntry, ...sectionEntries];
}
