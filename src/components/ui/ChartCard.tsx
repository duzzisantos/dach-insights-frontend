"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface ChartCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ChartCard({ children, title, className, delay = 0 }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={clsx("glass-chart flex h-full flex-col p-4 sm:p-5", className)}
    >
      {title && <h3 className="relative z-[2] mb-4 px-1 text-sm font-medium text-[color:var(--text-secondary)]">{title}</h3>}
      <div className="relative z-[2] min-h-0 flex-1">{children}</div>
    </motion.div>
  );
}
