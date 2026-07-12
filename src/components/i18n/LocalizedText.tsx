"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { localizedCategory, localizedIndicator } from "@/lib/i18n/content";

export function RegionName({ name, nameEnglish, className }: { name: string; nameEnglish: string; className?: string }) {
  const { locale } = useLocale();
  return <span className={className}>{locale === "de" ? name : nameEnglish}</span>;
}

interface CategoryTextProps {
  slug: string;
  fallbackName: string;
  fallbackDescription?: string | null;
  field: "name" | "description";
  className?: string;
}

export function CategoryText({ slug, fallbackName, fallbackDescription, field, className }: CategoryTextProps) {
  const { locale } = useLocale();
  const localized = localizedCategory(slug, locale, fallbackName, fallbackDescription ?? null);
  return <span className={className}>{field === "name" ? localized.name : localized.description}</span>;
}

export function IndicatorText({ slug, fallbackName, fallbackDescription, field, className }: CategoryTextProps) {
  const { locale } = useLocale();
  const localized = localizedIndicator(slug, locale, fallbackName, fallbackDescription ?? null);
  return <span className={className}>{field === "name" ? localized.name : localized.description}</span>;
}

export function RegionTrendTitle({ name, nameEnglish }: { name: string; nameEnglish: string }) {
  const { locale, t } = useLocale();
  const region = locale === "de" ? name : nameEnglish;
  return <>{t("label_region_trend_year").replace("{region}", region)}</>;
}

export function AllStatesTitle({ year }: { year: number }) {
  const { t } = useLocale();
  return <>{t("label_all_states_year").replace("{year}", String(year))}</>;
}
