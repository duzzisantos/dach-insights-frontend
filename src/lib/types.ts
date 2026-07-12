export interface RegionSummary {
  id: number;
  code: string;
  slug: string;
  name: string;
  nameEnglish: string;
  type: "Country" | "State";
  population: number | null;
  areaKm2: number | null;
  capital: string | null;
  geoJsonKey: string | null;
  countrySlug: string | null;
}

export interface HighlightStat {
  indicatorSlug: string;
  indicatorName: string;
  unit: string;
  valueFormat: string | null;
  year: number;
  value: number;
  previousYearValue: number | null;
  categorySlug: string;
}

export interface CategorySummary {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  colorSlot: string | null;
}

export interface RegionProfile {
  region: RegionSummary;
  highlights: HighlightStat[];
  categories: CategorySummary[];
}

export interface IndicatorSummary {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  unit: string;
  valueFormat: string | null;
  categorySlug: string;
}

export interface CategoryDetail {
  category: CategorySummary;
  indicators: IndicatorSummary[];
}

export interface IndicatorSeriesPoint {
  regionSlug: string;
  regionName: string;
  regionNameEnglish: string;
  year: number;
  value: number;
}

export interface IndicatorSeries {
  indicator: IndicatorSummary;
  points: IndicatorSeriesPoint[];
}

export interface SearchResult {
  type: "region" | "category" | "indicator";
  slug: string;
  title: string;
  subtitle: string | null;
  href: string;
}
