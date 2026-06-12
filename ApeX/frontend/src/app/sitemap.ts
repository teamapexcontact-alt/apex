import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const pages: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/#services", changeFrequency: "weekly", priority: 0.9 },
    { path: "/#portfolio", changeFrequency: "weekly", priority: 0.9 },
    { path: "/#contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
