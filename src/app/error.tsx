"use client";

import { useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <GlassCard strong className="flex flex-col items-center gap-4 px-10 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">{t("error_title")}</h1>
        <p className="text-sm text-[color:var(--text-secondary)]">{t("error_message")}</p>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-sm glass-panel px-4 py-2 text-sm font-medium text-[color:var(--text-primary)]"
          >
            {t("error_retry")}
          </button>
          <Link
            href="/"
            className="rounded-sm px-4 py-2 text-sm font-medium text-[color:var(--series-blue)] hover:underline"
          >
            {t("not_found_home_link")}
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
