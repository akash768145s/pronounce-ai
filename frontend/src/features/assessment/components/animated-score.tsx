"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export function AnimatedScore({ score, label }: { score: number; label: string }) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [score, count]);

  const offset = circumference - (displayValue / 100) * circumference;

  return (
    <div className="relative grid size-56 place-items-center select-none">
      {/* Glow Effect behind the score */}
      <div className="absolute size-40 bg-gradient-to-br from-teal-500/10 via-indigo-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse-slow" />
      
      <svg viewBox="0 0 220 220" className="size-full -rotate-90 z-10">
        <circle 
          cx="110" 
          cy="110" 
          r={radius} 
          fill="none" 
          stroke="currentColor" 
          className="text-zinc-200/60 dark:text-zinc-800/50" 
          strokeWidth="12" 
        />
        <motion.circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />   {/* Teal */}
            <stop offset="60%" stopColor="#6366f1" />  {/* Indigo */}
            <stop offset="100%" stopColor="#ec4899" /> {/* Pink */}
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center z-10 flex flex-col items-center">
        <span className="text-6xl font-extrabold tracking-tighter bg-gradient-to-b from-zinc-950 via-zinc-800 to-zinc-700 dark:from-white dark:via-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
          {displayValue}
        </span>
        <span className="mt-1 text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          {label}
        </span>
      </div>
    </div>
  );
}
