"use client";

import { motion } from "framer-motion";
import { SearchBar } from "@/components/layout/SearchBar";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="flex flex-col items-center gap-6 py-20 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl"
      >
        {t("hero_title_prefix")} <span className="text-gradient-accent">{t("hero_title_country")}</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl text-balance text-lg text-[color:var(--text-secondary)]"
      >
        {t("hero_subtitle")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        <SearchBar />
      </motion.div>
    </section>
  );
}
