import { MetadataRoute } from "next";

const products = [
  { slug: "classic-leather-tote", updatedAt: "2025-01-15" },
  { slug: "designer-handbag", updatedAt: "2025-01-14" },
  { slug: "travel-backpack", updatedAt: "2025-01-13" },
  { slug: "slim-wallet", updatedAt: "2025-01-12" },
  { slug: "weekend-duffel", updatedAt: "2025-01-11" },
  { slug: "crossbody-bag", updatedAt: "2025-01-10" },
  { slug: "kids-backpack", updatedAt: "2025-01-09" },
  { slug: "canvas-tote", updatedAt: "2025-01-08" },
];

const categories = [
  "handbags",
  "backpacks",
  "totes",
  "wallets",
  "luggage",
  "kids",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://baghub.com";

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/shop?category=${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}