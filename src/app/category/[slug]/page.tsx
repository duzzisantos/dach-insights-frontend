import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api, orNotFound } from "@/lib/api";
import { countryConfigs } from "@/lib/countries";
import { ChartCard } from "@/components/ui/ChartCard";
import { CountryTabs } from "@/components/ui/CountryTabs";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { RankingBarChart } from "@/components/charts/RankingBarChart";
import { RegionChoroplethMap } from "@/components/charts/RegionChoroplethMap";
import { T } from "@/components/i18n/T";
import { AllStatesTitle, CategoryText, IndicatorText, RegionName } from "@/components/i18n/LocalizedText";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await orNotFound(api.getCategory(slug));
  if (!detail) return {};
  return { title: `${detail.category.name} — DACHInsights`, description: detail.category.description ?? undefined };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const detail = await orNotFound(api.getCategory(slug));
  if (!detail) notFound();

  const { category, indicators } = detail;
  const [seriesList, regions] = await Promise.all([
    Promise.all(indicators.map((i) => api.getIndicatorSeries(i.slug))),
    api.getRegions(),
  ]);
  const regionBySlug = new Map(regions.map((r) => [r.slug, r]));

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-12">
      <header className="mb-12">
        <p className="text-sm text-[color:var(--text-muted)]">
          <T k="label_topic" />
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          <CategoryText slug={category.slug} fallbackName={category.name} field="name" />
        </h1>
        <p className="mt-3 max-w-2xl text-[color:var(--text-secondary)]">
          <CategoryText slug={category.slug} fallbackName={category.name} fallbackDescription={category.description} field="description" />
        </p>
      </header>

      <div className="flex flex-col gap-16">
        {indicators.map((indicator, idx) => {
          const series = seriesList[idx];

          return (
            <section key={indicator.slug}>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  <IndicatorText slug={indicator.slug} fallbackName={indicator.name} field="name" />
                </h2>
                <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                  <IndicatorText slug={indicator.slug} fallbackName={indicator.name} fallbackDescription={indicator.description} field="description" />
                </p>
              </div>

              <CountryTabs
                tabs={countryConfigs.map((country) => {
                  const countryPoints = series.points.filter((p) => {
                    const region = regionBySlug.get(p.regionSlug);
                    return p.regionSlug === country.slug || region?.countrySlug === country.slug;
                  });
                  const years = countryPoints.map((p) => p.year);
                  const latestYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear();

                  const stateValues = countryPoints.filter((p) => p.regionSlug !== country.slug);
                  const ranking = stateValues
                    .filter((p) => p.year === latestYear)
                    .map((p) => ({ slug: p.regionSlug, name: p.regionName, nameEnglish: p.regionNameEnglish, value: p.value }));
                  const mapData = ranking
                    .map((r) => {
                      const region = regionBySlug.get(r.slug);
                      return region ? { slug: r.slug, code: region.code, name: r.name, nameEnglish: r.nameEnglish, value: r.value } : null;
                    })
                    .filter((d): d is NonNullable<typeof d> => d !== null);

                  const nationalTrend = countryPoints
                    .filter((p) => p.regionSlug === country.slug)
                    .sort((a, b) => a.year - b.year)
                    .map((p) => ({ year: p.year, value: p.value }));

                  const countryRegion = regionBySlug.get(country.slug);

                  return {
                    key: country.slug,
                    label: countryRegion ? <RegionName name={countryRegion.name} nameEnglish={countryRegion.nameEnglish} /> : country.slug,
                    content: (
                      <div>
                        <div className="grid gap-6 lg:grid-cols-2">
                          <ChartCard title={<T k="label_national_trend" />}>
                            <TrendLineChart points={nationalTrend} valueFormat={indicator.valueFormat} color="var(--series-aqua)" />
                          </ChartCard>
                          <ChartCard title={<AllStatesTitle year={latestYear} />}>
                            <RankingBarChart data={ranking} valueFormat={indicator.valueFormat} minHeight={420} />
                          </ChartCard>
                        </div>
                        {mapData.length > 0 && (
                          <ChartCard className="mt-6" title={<T k="label_by_state_year" params={{ year: latestYear }} />}>
                            <RegionChoroplethMap
                              geojson={country.geojson}
                              data={mapData}
                              valueFormat={indicator.valueFormat}
                              ariaLabel={`Choropleth map of ${countryRegion?.nameEnglish ?? country.slug} by region`}
                            />
                          </ChartCard>
                        )}
                      </div>
                    ),
                  };
                })}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
