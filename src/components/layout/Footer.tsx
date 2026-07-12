"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="mt-24 border-t border-[color:var(--border-hairline)] py-8">
      <div className="mx-auto max-w-7xl px-6 text-sm text-[color:var(--text-muted)]">
        <p>{t("footer_demo_notice")}</p>
        <p className="mt-1">{t("footer_credits")}</p>
      </div>
    </footer>
  );
}
