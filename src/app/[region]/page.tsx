import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api, orNotFound } from "@/lib/api";
import { formatCompactNumber } from "@/lib/format";
import { ChartCard } from "@/components/ui/ChartCard";
import { StatTile } from "@/components/ui/StatTile";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { RankingBarChart } from "@/components/charts/RankingBarChart";
import { T } from "@/components/i18n/T";
import { AllStatesTitle, CategoryText, IndicatorText, RegionName, RegionTrendTitle } from "@/components/i18n/LocalizedText";

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region } = await params;
  const profile = await orNotFound(api.getRegion(region));
  if (!profile) return {};
  return {
    title: `${profile.region.name} — DACHInsights`,
    description: `Population, economy, and employment statistics for ${profile.region.name}.`,
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region: slug } = await params;
  const profile = await orNotFound(api.getRegion(slug));
  if (!profile) notFound();

  const { region, highlights, categories } = profile;

  // Rank a state against its own country's peers only (Bayern vs. other German states,
  // not against Wien or Zürich) — a national page ranks against its own states instead.
  const peerCountrySlug = region.type === "Country" ? region.slug : region.countrySlug;

  const [categoryDetails, regions] = await Promise.all([
    Promise.all(categories.map((c) => api.getCategory(c.slug))),
    api.getRegions(),
  ]);
  const regionBySlug = new Map(regions.map((r) => [r.slug, r]));
  const indicators = categoryDetails.flatMap((cd) => cd.indicators.map((i) => ({ ...i, categorySlug: cd.category.slug, categoryName: cd.category.name })));
  const seriesList = await Promise.all(indicators.map((i) => api.getIndicatorSeries(i.slug)));

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-12">
      <header className="mb-10">
        <p className="text-sm text-[color:var(--text-muted)]">
          {region.type === "Country" ? <T k="label_country" /> : <T k="label_state" />}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          <RegionName name={region.name} nameEnglish={region.nameEnglish} />
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[color:var(--text-secondary)]">
          {region.capital && (
            <span>
              <T k="label_capital" />: {region.capital}
            </span>
          )}
          {region.population && (
            <span>
              <T k="label_population" />: {formatCompactNumber(region.population)}
            </span>
          )}
          {region.areaKm2 && (
            <span>
              <T k="label_area" />: {formatCompactNumber(region.areaKm2)} km²
            </span>
          )}
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {highlights.map((stat, i) => (
          <StatTile key={stat.indicatorSlug} stat={stat} delay={i * 0.06} />
        ))}
      </section>

      <div className="mt-16 flex flex-col gap-16">
        {indicators.map((indicator, idx) => {
          const series = seriesList[idx];
          const trend = series.points
            .filter((p) => p.regionSlug === slug)
            .sort((a, b) => a.year - b.year)
            .map((p) => ({ year: p.year, value: p.value }));

          // Not every indicator has data for every region (e.g. Eurostat has no
          // sub-regional GDP figures for Switzerland) — skip rather than render an
          // empty chart.
          if (trend.length === 0) return null;

          const peers = series.points.filter((p) => {
            const peerRegion = regionBySlug.get(p.regionSlug);
            return peerRegion?.type === "State" && peerRegion.countrySlug === peerCountrySlug;
          });
          const years = peers.map((p) => p.year);
          const latestYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear();
          const ranking = peers
            .filter((p) => p.year === latestYear)
            .map((p) => ({ slug: p.regionSlug, name: p.regionName, nameEnglish: p.regionNameEnglish, value: p.value }));

          return (
            <section key={indicator.slug}>
              <div className="mb-6">
                <span className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                  <CategoryText slug={indicator.categorySlug} fallbackName={indicator.categoryName} field="name" />
                </span>
                <h2 className="text-2xl font-semibold tracking-tight">
                  <IndicatorText slug={indicator.slug} fallbackName={indicator.name} field="name" />
                </h2>
                <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                  <IndicatorText slug={indicator.slug} fallbackName={indicator.name} fallbackDescription={indicator.description} field="description" />
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard title={<RegionTrendTitle name={region.name} nameEnglish={region.nameEnglish} />}>
                  <TrendLineChart points={trend} valueFormat={indicator.valueFormat} />
                </ChartCard>
                <ChartCard title={<AllStatesTitle year={latestYear} />}>
                  <RankingBarChart data={ranking} valueFormat={indicator.valueFormat} highlightSlug={slug} minHeight={420} />
                </ChartCard>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
