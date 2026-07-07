"use client";

import { motion } from "framer-motion";

export function ProgressRing({ score, label }: { score: number; label: string }) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative grid size-56 place-items-center">
      <svg viewBox="0 0 220 220" className="size-full -rotate-90">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="currentColor" className="text-zinc-200 dark:text-white/10" strokeWidth="16" />
        <motion.circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="55%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-semibold tracking-normal">
          {score}
        </motion.div>
        <div className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</div>
      </div>
    </div>
  );
}
