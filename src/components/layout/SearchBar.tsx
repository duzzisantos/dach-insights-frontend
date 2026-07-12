"use client";

import * as Popover from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { Landmark, LayoutGrid, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { api } from "@/lib/api";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const typeIcon = { region: Landmark, category: LayoutGrid, indicator: TrendingUp };

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(query), 220);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data: results } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => api.search(debounced),
    enabled: debounced.trim().length >= 2,
  });

  const isOpen = open && (results?.length ?? 0) > 0;

  return (
    <Popover.Root open={isOpen} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <div className={clsx("relative", className ?? "w-full")}>
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={t("nav_search_placeholder")}
            className="w-full rounded-sm glass-panel py-2.5 pl-10 pr-5 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] outline-none focus:ring-2 focus:ring-[color:var(--series-blue)]"
            aria-label={t("nav_search_placeholder")}
          />
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          align="start"
          sideOffset={8}
          className="z-50 w-[--radix-popover-trigger-width] min-w-[280px] max-w-sm overflow-hidden rounded-sm glass-panel-strong p-1.5"
        >
          <ul role="listbox">
            {results?.map((result) => {
              const Icon = typeIcon[result.type];
              return (
                <li key={`${result.type}-${result.slug}`}>
                  <Link
                    href={result.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm hover:bg-[color:var(--series-blue)]/10"
                  >
                    <Icon size={15} className="text-[color:var(--series-blue)]" aria-hidden />
                    <span className="text-[color:var(--text-primary)]">{result.title}</span>
                    {result.subtitle && <span className="ml-auto text-xs text-[color:var(--text-muted)]">{result.subtitle}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
