"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

export function LocaleToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="flex h-9 items-center rounded-full glass-panel p-0.5 text-xs font-medium" aria-label={t("locale_toggle_label")}>
      {(["en", "de"] as const).map((option) => (
        <button
          key={option}
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          className={
            locale === option
              ? "rounded-full bg-[color:var(--series-blue)] px-2.5 py-1.5 text-white transition-colors"
              : "rounded-full px-2.5 py-1.5 text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
          }
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
