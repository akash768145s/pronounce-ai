"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedbackCardProps = {
  title: string;
  items: string[];
  variant?: "success" | "warning" | "error" | "info";
  icon: LucideIcon;
};

export function FeedbackCard({ title, items, variant = "info", icon: Icon }: FeedbackCardProps) {
  const styles = {
    success: {
      border: "border-emerald-500/20 dark:border-emerald-500/10",
      bg: "bg-emerald-500/[0.02]",
      text: "text-emerald-800 dark:text-emerald-300",
      bullet: "bg-emerald-500",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    warning: {
      border: "border-amber-500/20 dark:border-amber-500/10",
      bg: "bg-amber-500/[0.02]",
      text: "text-amber-800 dark:text-amber-300",
      bullet: "bg-amber-500",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    error: {
      border: "border-rose-500/20 dark:border-rose-500/10",
      bg: "bg-rose-500/[0.02]",
      text: "text-rose-800 dark:text-rose-300",
      bullet: "bg-rose-500",
      iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    info: {
      border: "border-indigo-500/20 dark:border-indigo-500/10",
      bg: "bg-indigo-500/[0.02]",
      text: "text-indigo-800 dark:text-indigo-300",
      bullet: "bg-indigo-500",
      iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("rounded-2xl p-5 border shadow-sm glass-panel flex flex-col gap-4 select-none", styles.border, styles.bg)}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-xl border border-zinc-200/10", styles.iconBg)}>
          <Icon className="size-4" />
        </div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300">{title}</h4>
      </div>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            <span className={cn("size-1.5 rounded-full shrink-0 mt-2", styles.bullet)} />
            <span>{item}</span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm italic text-zinc-400 dark:text-zinc-500 pl-4">None identified</li>
        )}
      </ul>
    </motion.div>
  );
}
