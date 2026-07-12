import type { Locale } from "./dictionary";

interface LocalizedText {
  en: { name: string; description: string };
  de: { name: string; description: string };
}

export const categoryTranslations: Record<string, LocalizedText> = {
  demographics: {
    en: { name: "Demographics", description: "Population and life expectancy across Germany." },
    de: { name: "Demografie", description: "Bevölkerung und Lebenserwartung in Deutschland." },
  },
  economy: {
    en: { name: "Economy", description: "Economic output per capita across regions." },
    de: { name: "Wirtschaft", description: "Wirtschaftsleistung pro Kopf nach Region." },
  },
  employment: {
    en: { name: "Employment", description: "Labor market indicators across regions." },
    de: { name: "Beschäftigung", description: "Arbeitsmarktindikatoren nach Region." },
  },
};

export const indicatorTranslations: Record<string, LocalizedText> = {
  population: {
    en: { name: "Population", description: "Total resident population." },
    de: { name: "Bevölkerung", description: "Gesamte Wohnbevölkerung." },
  },
  "life-expectancy": {
    en: { name: "Life Expectancy at Birth", description: "Average life expectancy at birth." },
    de: { name: "Lebenserwartung bei Geburt", description: "Durchschnittliche Lebenserwartung bei Geburt." },
  },
  "gdp-per-capita": {
    en: { name: "GDP per Capita", description: "Gross domestic product per capita, nominal." },
    de: { name: "BIP pro Kopf", description: "Bruttoinlandsprodukt pro Kopf, nominal." },
  },
  "unemployment-rate": {
    en: { name: "Unemployment Rate", description: "Share of the labor force that is unemployed." },
    de: { name: "Arbeitslosenquote", description: "Anteil der Erwerbslosen an der Erwerbsbevölkerung." },
  },
};

const unitTranslations: Record<Locale, Record<string, string>> = {
  en: { years: "yrs" },
  de: { years: "Jahre" },
};

export function localizedCategory(slug: string, locale: Locale, fallbackName: string, fallbackDescription: string | null) {
  const entry = categoryTranslations[slug]?.[locale];
  return entry ?? { name: fallbackName, description: fallbackDescription ?? "" };
}

export function localizedIndicator(slug: string, locale: Locale, fallbackName: string, fallbackDescription: string | null) {
  const entry = indicatorTranslations[slug]?.[locale];
  return entry ?? { name: fallbackName, description: fallbackDescription ?? "" };
}

export function localizedUnit(locale: Locale, unitKey: "years"): string {
  return unitTranslations[locale][unitKey];
}
