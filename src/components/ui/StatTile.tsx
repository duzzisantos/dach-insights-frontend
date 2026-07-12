"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { GlassCard } from "./GlassCard";
import { formatDelta, formatValue } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { localizedIndicator } from "@/lib/i18n/content";
import type { HighlightStat } from "@/lib/types";

interface StatTileProps {
  stat: HighlightStat;
  delay?: number;
}

const DirectionIcon = { up: ArrowUpRight, down: ArrowDownRight, flat: ArrowRight };

export function StatTile({ stat, delay }: StatTileProps) {
  const { locale, t } = useLocale();
  const delta = formatDelta(stat.value, stat.previousYearValue);
  const Icon = delta ? DirectionIcon[delta.direction] : null;
  const label = localizedIndicator(stat.indicatorSlug, locale, stat.indicatorName, null).name;

  return (
    <GlassCard delay={delay} className="flex flex-col gap-2">
      <span className="text-sm text-[color:var(--text-muted)]">{label}</span>
      <span className="text-3xl font-semibold tracking-tight tabular-nums">
        <AnimatedNumber value={stat.value} formatter={(v) => formatValue(v, stat.valueFormat, locale)} />
      </span>
      <div className="flex items-center gap-1.5 text-xs text-[color:var(--text-secondary)]">
        {delta && Icon && (
          <span className="inline-flex items-center gap-0.5 tabular-nums">
            <Icon size={14} aria-hidden />
            {delta.text}
          </span>
        )}
        <span>
          {t("stat_vs")} {stat.year - 1}
        </span>
        <span className="ml-auto text-[color:var(--text-muted)]">{stat.year}</span>
      </div>
    </GlassCard>
  );
}
