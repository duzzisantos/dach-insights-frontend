import type { MetadataRoute } from "next";
import { api } from "@/lib/api";

// Same-origin reverse-proxy deployments never set NEXT_PUBLIC_API_URL to a real absolute
// URL (see src/lib/api.ts), so the sitemap needs its own base URL — set at build time,
// same mechanism as NEXT_PUBLIC_API_URL.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Fetches live data on every request rather than being prerendered at build time — a
// Docker image build has no backend to fetch from yet (same reasoning as HomePage).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [regions, categories] = await Promise.all([api.getRegions(), api.getCategories()]);

  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    ...regions.map((region) => ({
      url: `${BASE_URL}/${region.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: `${BASE_URL}/category/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
