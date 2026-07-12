"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

interface TProps {
  k: DictionaryKey;
  params?: Record<string, string | number>;
  as?: "span" | "p";
  className?: string;
}

export function T({ k, params, as = "span", className }: TProps) {
  const { t } = useLocale();
  let text: string = t(k);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      text = text.replace(`{${key}}`, String(value));
    }
  }
  const Component = as;
  return <Component className={className}>{text}</Component>;
}
