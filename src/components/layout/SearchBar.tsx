"use client";

import * as Popover from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { Landmark, LayoutGrid, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { api } from "@/lib/api";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const typeIcon = { region: Landmark, category: LayoutGrid, indicator: TrendingUp };

interface SearchBarProps {
  className?: string;
}

function optionId(index: number): string {
  return `search-option-${index}`;
}

export function SearchBar({ className }: SearchBarProps) {
  const { t } = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(query), 220);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data: results } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => api.search(debounced),
    enabled: debounced.trim().length >= 2,
  });

  // Results change out from under whatever index was active (new query, new response) —
  // reset during render (not an effect) so it takes effect in the same commit, before
  // anything reads a stale/out-of-range activeIndex.
  const [seenResults, setSeenResults] = useState(results);
  if (results !== seenResults) {
    setSeenResults(results);
    setActiveIndex(-1);
  }

  const isOpen = open && (results?.length ?? 0) > 0;

  function select(index: number) {
    const result = results?.[index];
    if (!result) return;
    setOpen(false);
    setQuery("");
    router.push(result.href);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const count = results?.length ?? 0;
    if (count === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i + 1) % count);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i - 1 + count) % count);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      select(activeIndex);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

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
            onKeyDown={handleKeyDown}
            placeholder={t("nav_search_placeholder")}
            className="w-full rounded-sm glass-panel py-2.5 pl-10 pr-5 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] outline-none focus:ring-2 focus:ring-[color:var(--series-blue)]"
            aria-label={t("nav_search_placeholder")}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="search-results-listbox"
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            autoComplete="off"
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
          <ul id="search-results-listbox" role="listbox">
            {results?.map((result, index) => {
              const Icon = typeIcon[result.type];
              const active = index === activeIndex;
              return (
                <li key={`${result.type}-${result.slug}`} id={optionId(index)} role="option" aria-selected={active}>
                  <Link
                    href={result.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={clsx(
                      "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm",
                      active ? "bg-[color:var(--series-blue)]/10" : "hover:bg-[color:var(--series-blue)]/10",
                    )}
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
