"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  delay?: number;
  as?: "div" | "article" | "section";
}

export function GlassCard({ children, className, strong, delay = 0, as = "div" }: GlassCardProps) {
  const Component = motion[as];

  return (
    <Component
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        "rounded-2xl p-6",
        strong ? "glass-panel-strong" : "glass-panel",
        className,
      )}
    >
      {children}
    </Component>
  );
}
