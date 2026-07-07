"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Sparkles, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const pipelineSteps = [
  { label: "Uploading recording", duration: 1.5 },
  { label: "Preparing audio (normalization)", duration: 2 },
  { label: "Speech recognition (acoustic alignment)", duration: 4 },
  { label: "Pronunciation analysis", duration: 3 },
  { label: "Generating AI coaching feedback", duration: 3.5 },
];

export function Processing() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(14);

  // Time remaining countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Step advancement simulation
  useEffect(() => {
    let currentStep = 0;
    let elapsed = 0;
    const totalDuration = pipelineSteps.reduce((acc, s) => acc + s.duration, 0);

    const interval = setInterval(() => {
      elapsed += 0.1;
      const calculatedProgress = Math.min(99, (elapsed / totalDuration) * 100);
      setProgress(calculatedProgress);

      // Check if we should advance to the next step
      let accumulatedTime = 0;
      for (let i = 0; i < pipelineSteps.length; i++) {
        accumulatedTime += pipelineSteps[i].duration;
        if (elapsed < accumulatedTime) {
          currentStep = i;
          break;
        }
        if (i === pipelineSteps.length - 1) {
          currentStep = pipelineSteps.length - 1;
        }
      }

      if (currentStep !== currentStepIndex) {
        setCurrentStepIndex(currentStep);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentStepIndex]);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Active Pipeline Card */}
      <section className="w-full max-w-xl rounded-3xl border border-zinc-200/50 bg-white/40 p-6 shadow-xl dark:border-white/5 dark:bg-zinc-950/40 backdrop-blur-xl flex flex-col gap-6 select-none mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4.5 text-indigo-500 animate-spin" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Analyzing Speech</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
            <Clock className="size-3.5" />
            <span>Est. ~{secondsRemaining}s</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800/40 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>

        {/* Pipeline Checklist */}
        <div className="flex flex-col gap-3">
          {pipelineSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;

            return (
              <div
                key={step.label}
                className={cn(
                  "flex items-center gap-3.5 p-2 rounded-xl border transition-all duration-300",
                  isCompleted && "border-zinc-200/20 bg-zinc-50/10 dark:border-white/2 dark:bg-white/[0.01]",
                  isActive && "border-indigo-500/20 bg-indigo-500/5 dark:border-indigo-500/10 shadow-sm"
                )}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="grid size-5 place-items-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <Check className="size-3" />
                    </div>
                  ) : isActive ? (
                    <div className="grid size-5 place-items-center text-indigo-500">
                      <Loader2 className="size-4.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid size-5 place-items-center text-zinc-300 dark:text-zinc-700">
                      <Circle className="size-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    isCompleted && "text-zinc-400 dark:text-zinc-500 line-through",
                    isActive && "text-indigo-600 dark:text-indigo-400 font-bold",
                    !isCompleted && !isActive && "text-zinc-400 dark:text-zinc-600"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Wave Height pulse animation */}
        <div className="flex h-10 items-end justify-center gap-1 bg-zinc-100/30 dark:bg-white/2 rounded-2xl p-3">
          {Array.from({ length: 30 }).map((_, index) => (
            <motion.span
              key={index}
              className="w-1.5 rounded-full bg-indigo-500"
              animate={{ height: [8, 28 - (index % 6) * 4, 10] }}
              transition={{
                duration: 0.8 + (index % 4) * 0.1,
                repeat: Infinity,
                delay: index * 0.02,
              }}
            />
          ))}
        </div>
      </section>

      {/* Background Dashboard Skeleton Loader (Vercel Style) */}
      <div className="w-full opacity-35 dark:opacity-20 blur-sm pointer-events-none select-none">
        <div className="mt-12 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Score ring skeleton */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/5 dark:bg-zinc-950 flex flex-col items-center gap-4">
            <div className="size-44 rounded-full border-8 border-zinc-100 dark:border-zinc-800" />
            <div className="h-6 w-32 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
            <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
          </div>
          {/* Metrics & transcript skeletons */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
              <div className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
            </div>
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white dark:border-white/5 dark:bg-zinc-950 space-y-3">
              <div className="h-5 w-44 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
              <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full" />
              <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
