"use client";

import { ResponsiveBar } from "@nivo/bar";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatValue } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { MultiSelectFilter } from "@/components/ui/MultiSelectFilter";

export interface RankingDatum {
  slug: string;
  name: string;
  nameEnglish?: string;
  value: number;
  [key: string]: string | number | undefined;
}

interface RankingBarChartProps {
  data: RankingDatum[];
  valueFormat?: string | null;
  highlightSlug?: string;
  /** Fallback height used only when the parent doesn't stretch this component (e.g. rendered standalone, not inside ChartCard). */
  minHeight?: number;
}

export function RankingBarChart({ data, valueFormat, highlightSlug, minHeight = 420 }: RankingBarChartProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const displayName = (d: RankingDatum) => (locale === "en" && d.nameEnglish ? d.nameEnglish : d.name);

  // Nivo renders horizontal bars bottom-to-top in array order, so ascending sort
  // puts the largest value at the top of the chart (leaderboard-style).
  const sorted = useMemo(
    () => [...data].sort((a, b) => a.value - b.value).map((d) => ({ ...d, displayName: displayName(d) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, locale],
  );
  const visible = useMemo(() => sorted.filter((d) => !excluded.has(d.slug)), [sorted, excluded]);
  const longestLabel = useMemo(() => Math.max(...sorted.map((d) => d.displayName.length), 8), [sorted]);

  const filterItems = useMemo(
    () => sorted.map((d) => ({ slug: d.slug, label: d.displayName, accentColor: d.slug === highlightSlug ? "var(--series-aqua)" : "var(--series-blue)" })),
    [sorted, highlightSlug],
  );
  const selected = useMemo(() => new Set(sorted.map((d) => d.slug).filter((slug) => !excluded.has(slug))), [sorted, excluded]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex justify-end">
        <MultiSelectFilter
          items={filterItems}
          selected={selected}
          onToggle={toggle}
          onSelectAll={() => setExcluded(new Set())}
          onClearAll={() => setExcluded(new Set(sorted.map((d) => d.slug)))}
        />
      </div>

      <div className="min-h-0 flex-1" style={{ minHeight }}>
        <ResponsiveBar
          data={visible}
          keys={["value"]}
          indexBy="displayName"
          layout="horizontal"
          margin={{ top: 8, right: 56, bottom: 8, left: Math.min(220, longestLabel * 7.2 + 16) }}
          padding={0.32}
          borderRadius={4}
          colors={(bar) => (bar.data.slug === highlightSlug ? "var(--series-aqua)" : "var(--series-blue)")}
          borderWidth={0}
          enableGridY={false}
          enableGridX
          gridXValues={4}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
          }}
          enableLabel
          label={(bar) => formatValue(Number(bar.value ?? 0), valueFormat, locale)}
          labelTextColor="#ffffff"
          labelSkipWidth={54}
          animate
          motionConfig="gentle"
          isInteractive
          onClick={(bar) => router.push(`/${bar.data.slug}`)}
          theme={{
            background: "transparent",
            text: { fill: "var(--text-secondary)", fontSize: 13 },
            axis: { ticks: { text: { fill: "var(--text-secondary)", fontSize: 13 } } },
            grid: { line: { stroke: "var(--gridline)", strokeWidth: 1 } },
          }}
          tooltip={({ data: datum }) => (
            <div className="rounded-lg glass-panel-strong px-3 py-2 text-sm shadow-lg">
              <div className="font-medium text-[color:var(--text-primary)]">{datum.displayName}</div>
              <div className="tabular-nums text-[color:var(--text-secondary)]">{formatValue(datum.value, valueFormat, locale)}</div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
