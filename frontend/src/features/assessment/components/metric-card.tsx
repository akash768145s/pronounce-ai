"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  max?: number;
};

export function MetricCard({ label, value, icon: Icon, suffix = "", max = 100 }: MetricCardProps) {
  let level = "Good";
  let colorClass = "text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400";
  let barColor = "bg-indigo-500";

  const percentage = (value / max) * 100;

  if (label.toLowerCase() === "speed" || label.toLowerCase() === "speech rate" || label.toLowerCase() === "speechrate") {
    if (value >= 120 && value <= 160) {
      level = "Optimal";
      colorClass = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400";
      barColor = "bg-emerald-500";
    } else if (value < 120) {
      level = "Slow";
      colorClass = "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400";
      barColor = "bg-amber-500";
    } else {
      level = "Fast";
      colorClass = "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400";
      barColor = "bg-amber-500";
    }
  } else {
    if (value >= 85) {
      level = "Excellent";
      colorClass = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400";
      barColor = "bg-emerald-500";
    } else if (value >= 60) {
      level = "Good";
      colorClass = "text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400";
      barColor = "bg-indigo-500";
    } else {
      level = "Improve";
      colorClass = "text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400";
      barColor = "bg-rose-500";
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="relative overflow-hidden glass-panel rounded-2xl p-4 border border-zinc-200/50 dark:border-white/10 shadow-sm flex flex-col justify-between h-36 select-none"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {label}
        </span>
        <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border border-zinc-200/20 dark:border-white/5">
          <Icon className="size-4" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-800 dark:from-white dark:via-zinc-100 dark:to-zinc-200 bg-clip-text text-transparent">
          {value}
          <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 ml-0.5">{suffix}</span>
        </span>
        <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${colorClass}`}>
          {level}
        </span>
      </div>

      <div className="mt-4 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </motion.div>
  );
}
