"use client";

import { useQuery } from "@tanstack/react-query";
import { Compass } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { CategoryText } from "@/components/i18n/LocalizedText";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleToggle } from "./LocaleToggle";

export function NavBar() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
    staleTime: 10 * 60_000,
  });

  return (
    <header className="sticky top-0 z-40 glass-nav">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Compass size={20} className="text-[color:var(--series-blue)]" aria-hidden />
          <span>
            DACH<span className="text-gradient-accent">Insights</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {categories?.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="rounded-full px-3 py-1.5 text-sm text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--series-blue)]/10 hover:text-[color:var(--text-primary)]"
            >
              <CategoryText slug={category.slug} fallbackName={category.name} field="name" />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <SearchBar className="w-56 sm:w-80 lg:w-96" />
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
