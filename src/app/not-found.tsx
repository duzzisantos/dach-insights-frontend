"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <GlassCard strong className="flex flex-col items-center gap-4 px-10 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">{t("not_found_title")}</h1>
        <p className="text-sm text-[color:var(--text-secondary)]">{t("not_found_message")}</p>
        <Link
          href="/"
          className="mt-2 rounded-sm glass-panel px-4 py-2 text-sm font-medium text-[color:var(--text-primary)]"
        >
          {t("not_found_home_link")}
        </Link>
      </GlassCard>
    </div>
  );
}
