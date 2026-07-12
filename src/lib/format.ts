import type { Locale } from "./i18n/dictionary";
import { localizedUnit } from "./i18n/content";

function intlLocale(locale: Locale): string {
  return locale === "de" ? "de-DE" : "en-US";
}

export function formatValue(value: number, valueFormat: string | null | undefined, locale: Locale = "en"): string {
  const tag = intlLocale(locale);
  switch (valueFormat) {
    case "percent":
      return `${value.toLocaleString(tag, { maximumFractionDigits: 1 })}%`;
    case "currency-eur":
      return new Intl.NumberFormat(tag, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(value);
    case "years":
      return `${value.toLocaleString(tag, { maximumFractionDigits: 1 })} ${localizedUnit(locale, "years")}`;
    case "number":
      return new Intl.NumberFormat(tag, { maximumFractionDigits: 0 }).format(value);
    default:
      return value.toLocaleString(tag);
  }
}

export function formatCompactNumber(value: number, locale: Locale = "en"): string {
  return new Intl.NumberFormat(intlLocale(locale), { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatDelta(current: number, previous: number | null | undefined): { text: string; direction: "up" | "down" | "flat" } | null {
  if (previous === null || previous === undefined || previous === 0) return null;
  const delta = ((current - previous) / Math.abs(previous)) * 100;
  const direction = delta > 0.05 ? "up" : delta < -0.05 ? "down" : "flat";
  const sign = delta > 0 ? "+" : "";
  return { text: `${sign}${delta.toFixed(1)}%`, direction };
}
