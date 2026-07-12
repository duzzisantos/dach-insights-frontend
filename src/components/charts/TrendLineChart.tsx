"use client";

import { ResponsiveLine } from "@nivo/line";
import { formatCompactNumber, formatValue } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export interface TrendPoint {
  year: number;
  value: number;
}

interface TrendLineChartProps {
  points: TrendPoint[];
  valueFormat?: string | null;
  color?: string;
  /** Fallback height used only when the parent doesn't stretch this component (e.g. rendered standalone, not inside ChartCard). */
  minHeight?: number;
}

function formatAxisTick(value: number, valueFormat: string | null | undefined, locale: "en" | "de"): string {
  if (valueFormat === "currency-eur") return `€${formatCompactNumber(value, locale)}`;
  if (valueFormat === "number") return formatCompactNumber(value, locale);
  return formatValue(value, valueFormat, locale);
}

export function TrendLineChart({ points, valueFormat, color = "var(--series-blue)", minHeight = 260 }: TrendLineChartProps) {
  const { locale } = useLocale();
  const series = [
    {
      id: "trend",
      data: points.map((p) => ({ x: p.year, y: p.value })),
    },
  ];

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.15 || Math.abs(max) * 0.1 || 1;

  return (
    <div className="h-full w-full" style={{ minHeight }}>
      <ResponsiveLine
        data={series}
        margin={{ top: 16, right: 20, bottom: 32, left: 56 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: min - pad, max: max + pad }}
        curve="monotoneX"
        colors={[color]}
        lineWidth={2}
        enablePoints
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        enableArea
        areaOpacity={0.12}
        enableGridX={false}
        gridYValues={4}
        axisBottom={{ tickSize: 0, tickPadding: 8 }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          tickValues: 4,
          format: (v) => formatAxisTick(Number(v), valueFormat, locale),
        }}
        useMesh
        enableSlices="x"
        crosshairType="x"
        animate
        motionConfig="gentle"
        theme={{
          background: "transparent",
          text: { fill: "var(--text-secondary)", fontSize: 12 },
          axis: { ticks: { text: { fill: "var(--text-muted)", fontSize: 12 } } },
          grid: { line: { stroke: "var(--gridline)", strokeWidth: 1 } },
          crosshair: { line: { stroke: "var(--text-muted)", strokeWidth: 1, strokeDasharray: "4 4" } },
        }}
        sliceTooltip={({ slice }) => {
          const point = slice.points[0];
          return (
            <div className="rounded-lg glass-panel-strong px-3 py-2 text-sm shadow-lg">
              <div className="text-[color:var(--text-muted)]">{String(point.data.x)}</div>
              <div className="tabular-nums font-medium text-[color:var(--text-primary)]">
                {formatValue(Number(point.data.y), valueFormat, locale)}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
