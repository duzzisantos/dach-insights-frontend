"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export interface CountryTab {
  key: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface CountryTabsProps {
  tabs: CountryTab[];
}

export function CountryTabs({ tabs }: CountryTabsProps) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div role="tablist" className="mb-8 flex w-fit gap-1 rounded-sm glass-panel p-1">
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={clsx(
              "rounded-sm px-4 py-1.5 text-sm font-medium transition-colors",
              active === i
                ? "bg-[color:var(--series-blue)] text-white"
                : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tabs[active].key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {tabs[active].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
