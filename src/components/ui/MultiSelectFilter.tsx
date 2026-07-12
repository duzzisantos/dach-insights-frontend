"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, ListFilter } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export interface MultiSelectItem {
  slug: string;
  label: string;
  accentColor?: string;
}

interface MultiSelectFilterProps {
  items: MultiSelectItem[];
  selected: Set<string>;
  onToggle: (slug: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function MultiSelectFilter({ items, selected, onToggle, onSelectAll, onClearAll }: MultiSelectFilterProps) {
  const { t } = useLocale();
  const shownCount = items.filter((item) => selected.has(item.slug)).length;
  const summary =
    shownCount === items.length
      ? t("chart_filter_all_shown").replace("{total}", String(items.length))
      : t("chart_filter_n_shown").replace("{shown}", String(shownCount)).replace("{total}", String(items.length));

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-full glass-panel px-3 py-1.5 text-xs font-medium text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]">
          <ListFilter size={13} aria-hidden />
          {t("chart_filter_trigger")}
          <span className="text-[color:var(--text-muted)]">· {summary}</span>
          <ChevronDown size={13} aria-hidden />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-50 max-h-80 w-64 overflow-y-auto rounded-xl glass-panel-strong p-1.5"
        >
          <div className="flex items-center gap-1 px-2 py-1.5">
            <button
              onClick={onSelectAll}
              className="rounded-full px-2 py-0.5 text-xs font-medium text-[color:var(--series-blue)] hover:underline"
            >
              {t("chart_filter_select_all")}
            </button>
            <span className="text-[color:var(--text-muted)]">·</span>
            <button
              onClick={onClearAll}
              className="rounded-full px-2 py-0.5 text-xs font-medium text-[color:var(--series-blue)] hover:underline"
            >
              {t("chart_filter_clear_all")}
            </button>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-[color:var(--border-hairline)]" />
          {items.map((item) => {
            const checked = selected.has(item.slug);
            return (
              <DropdownMenu.CheckboxItem
                key={item.slug}
                checked={checked}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => onToggle(item.slug)}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-[color:var(--text-primary)] outline-none data-[highlighted]:bg-[color:var(--series-blue)]/10"
              >
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded border"
                  style={{
                    borderColor: checked ? (item.accentColor ?? "var(--series-blue)") : "var(--border-hairline)",
                    background: checked ? (item.accentColor ?? "var(--series-blue)") : "transparent",
                  }}
                >
                  {checked && <Check size={11} className="text-white" strokeWidth={3} />}
                </span>
                {item.label}
              </DropdownMenu.CheckboxItem>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
