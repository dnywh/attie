import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { COMPETITIONS } from "@/constants/competitions";

export default function sitemap(): MetadataRoute.Sitemap {
  // Start with the homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "always" as const,
      priority: 1,
    },
  ];

  // Add all competition pages
  Object.keys(COMPETITIONS).forEach((competitionKey) => {
    routes.push({
      url: `${siteConfig.url}/${competitionKey}` as MetadataRoute.Sitemap[number]["url"],
      lastModified: new Date(),
      changeFrequency: "always" as const,
      priority: 0.9,
    });
  });

  // Add any static pages here
  const staticPages: MetadataRoute.Sitemap = [
    // {
    //   url: `${siteConfig.url}/faq`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly" as const,
    //   priority: 0.8,
    // },
    // {
    //   url: `${siteConfig.url}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly" as const,
    //   priority: 0.8,
    // },
  ];

  return [...routes, ...staticPages];
}
