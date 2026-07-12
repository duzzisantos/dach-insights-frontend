import germanyGeo from "@/data/germany-states.geo.json";
import austriaGeo from "@/data/austria-states.geo.json";
import switzerlandGeo from "@/data/switzerland-regions.geo.json";
import type { RegionGeoJson } from "@/components/charts/RegionChoroplethMap";

export interface CountryConfig {
  /** Matches the country's own Region.slug (its national-level profile page). */
  slug: string;
  geojson: RegionGeoJson;
}

export const countryConfigs: CountryConfig[] = [
  { slug: "germany", geojson: germanyGeo as unknown as RegionGeoJson },
  { slug: "austria", geojson: austriaGeo as unknown as RegionGeoJson },
  { slug: "switzerland", geojson: switzerlandGeo as unknown as RegionGeoJson },
];
