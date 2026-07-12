"use client";

import { geoMercator, geoPath } from "d3-geo";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatValue } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// Sequential blue ramp (light -> dark), see dataviz skill references/palette.md.
const SEQUENTIAL_BLUE = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"];

const VIEWBOX_WIDTH = 760;
const VIEWBOX_HEIGHT = 560;

function interpolateRamp(ramp: string[], t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (ramp.length - 1);
  const index = Math.min(ramp.length - 2, Math.floor(scaled));
  return ramp[index + (scaled - index > 0.5 ? 1 : 0)];
}

export interface MapDatum {
  slug: string;
  code: string;
  name: string;
  nameEnglish?: string;
  value: number;
}

interface MapFeature {
  type: "Feature";
  properties: { id: string; name: string; type: string };
  geometry: GeoJSON.Geometry;
}

export interface RegionGeoJson {
  type: "FeatureCollection";
  features: MapFeature[];
}

interface RegionChoroplethMapProps {
  geojson: RegionGeoJson;
  data: MapDatum[];
  valueFormat?: string | null;
  /** Accessible label for the map's role="img"; should name the country being shown. */
  ariaLabel: string;
}

export function RegionChoroplethMap({ geojson, data, valueFormat, ariaLabel }: RegionChoroplethMapProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const [hovered, setHovered] = useState<{ name: string; value: number; x: number; y: number } | null>(null);

  const features = geojson.features;

  const { pathFor, byCode } = useMemo(() => {
    const projection = geoMercator().fitSize(
      [VIEWBOX_WIDTH, VIEWBOX_HEIGHT],
      geojson as unknown as GeoJSON.FeatureCollection,
    );
    const generator = geoPath(projection);
    const lookup = new Map(data.map((d) => [d.code, d]));
    return { pathFor: (f: MapFeature) => generator(f) ?? "", byCode: lookup };
  }, [geojson, data]);

  const values = data.map((d) => d.value);
  const [min, max] = [Math.min(...values), Math.max(...values)];
  const displayName = (d: MapDatum) => (locale === "en" && d.nameEnglish ? d.nameEnglish : d.name);

  return (
    <div className="relative h-[420px] w-full sm:h-[480px]">
      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="h-full w-full" role="img" aria-label={ariaLabel}>
        {features.map((feature, i) => {
          const datum = byCode.get(feature.properties.id);
          const fill = datum ? interpolateRamp(SEQUENTIAL_BLUE, (datum.value - min) / (max - min || 1)) : "var(--gridline)";
          return (
            <motion.path
              key={feature.properties.id}
              d={pathFor(feature)}
              fill={fill}
              stroke="var(--surface-1)"
              strokeWidth={1.5}
              strokeLinejoin="round"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.02, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "center", cursor: datum ? "pointer" : "default" }}
              onMouseEnter={(e) => datum && setHovered({ name: displayName(datum), value: datum.value, x: e.clientX, y: e.clientY })}
              onMouseMove={(e) => datum && setHovered({ name: displayName(datum), value: datum.value, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHovered(null)}
              onClick={() => datum && router.push(`/${datum.slug}`)}
              className="transition-[filter] duration-150 hover:brightness-110"
            />
          );
        })}
      </svg>
      {hovered && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg glass-panel-strong px-3 py-2 text-sm shadow-lg"
          style={{ left: hovered.x + 14, top: hovered.y + 14 }}
        >
          <div className="font-medium text-[color:var(--text-primary)]">{hovered.name}</div>
          <div className="tabular-nums text-[color:var(--text-secondary)]">{formatValue(hovered.value, valueFormat, locale)}</div>
        </div>
      )}
    </div>
  );
}
