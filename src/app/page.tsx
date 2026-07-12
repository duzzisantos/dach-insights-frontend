import Link from "next/link";
import { Briefcase, LandPlot, TrendingUp, Users } from "lucide-react";
import { api } from "@/lib/api";
import { countryConfigs } from "@/lib/countries";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { StatTile } from "@/components/ui/StatTile";
import { CountryTabs } from "@/components/ui/CountryTabs";
import { RegionChoroplethMap } from "@/components/charts/RegionChoroplethMap";
import { Hero } from "@/components/home/Hero";
import { T } from "@/components/i18n/T";
import { CategoryText, RegionName } from "@/components/i18n/LocalizedText";
import type { RegionSummary } from "@/lib/types";

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  demographics: Users,
  economy: TrendingUp,
  employment: Briefcase,
};

// Fetches live data per-country on every request rather than being prerendered at build
// time — a Docker image build has no backend to fetch from yet, and this app's data
// changes independently of deploys anyway, so there's little upside to static generation
// here.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, regions, populationSeries] = await Promise.all([
    api.getCategories(),
    api.getRegions(),
    api.getIndicatorSeries("population", 2024),
  ]);

  const countryTabs = await Promise.all(
    countryConfigs.map(async (country) => {
      const national = await api.getRegion(country.slug);
      const states = regions.filter((r) => r.type === "State" && r.countrySlug === country.slug);
      const mapData = populationSeries.points
        .filter((p) => p.regionSlug !== country.slug)
        .map((p) => {
          const region = states.find((s) => s.slug === p.regionSlug);
          return region
            ? { slug: region.slug, code: region.code, name: region.name, nameEnglish: region.nameEnglish, value: p.value }
            : null;
        })
        .filter((d): d is NonNullable<typeof d> => d !== null);

      return { country, national, states, mapData };
    }),
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <Hero />

      <CountryTabs
        tabs={countryTabs.map(({ country, national, states, mapData }) => ({
          key: country.slug,
          label: <RegionName name={national.region.name} nameEnglish={national.region.nameEnglish} />,
          content: (
            <div>
              <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {national.highlights.slice(0, 4).map((stat, i) => (
                  <StatTile key={stat.indicatorSlug} stat={stat} delay={i * 0.08} />
                ))}
              </section>

              {mapData.length > 0 && (
                <section className="mt-16">
                  <div className="mb-6 flex items-end justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight">
                        <T k="section_gdp_by_state" />
                      </h2>
                      <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                        <T k="section_gdp_by_state_sub" />
                      </p>
                    </div>
                  </div>
                  <ChartCard>
                    <RegionChoroplethMap
                      geojson={country.geojson}
                      data={mapData}
                      valueFormat="number"
                      ariaLabel={`Choropleth map of ${national.region.nameEnglish} by region`}
                    />
                  </ChartCard>
                </section>
              )}

              <section className="mt-16">
                <h2 className="mb-6 text-2xl font-semibold tracking-tight">
                  <T k="section_bundeslaender" />
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {states.map((state: RegionSummary, i: number) => (
                    <Link key={state.slug} href={`/${state.slug}`}>
                      <GlassCard delay={Math.min(i * 0.03, 0.5)} className="flex items-center justify-between py-3">
                        <span className="font-medium">
                          <RegionName name={state.name} nameEnglish={state.nameEnglish} />
                        </span>
                        <span className="text-xs text-[color:var(--text-muted)]">{state.capital}</span>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          ),
        }))}
      />

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          <T k="section_explore_by_topic" />
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((category, i) => {
            const Icon = categoryIcons[category.slug] ?? LandPlot;
            return (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <GlassCard delay={i * 0.08} className="h-full transition-transform hover:-translate-y-1">
                  <Icon size={22} className="text-[color:var(--series-blue)]" />
                  <h3 className="mt-3 text-lg font-medium">
                    <CategoryText slug={category.slug} fallbackName={category.name} field="name" />
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                    <CategoryText slug={category.slug} fallbackName={category.name} fallbackDescription={category.description} field="description" />
                  </p>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
