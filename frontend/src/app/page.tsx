"use client";

import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Brain, LockKeyhole, Sparkles } from "lucide-react";

import { analyzeAudio } from "@/features/assessment/api";
import { Processing } from "@/features/assessment/processing";
import { Results } from "@/features/assessment/results";
import { UploadCard } from "@/features/assessment/upload-card";

const pillars = [
  { 
    label: "Word-Level Alignment", 
    desc: "Acoustic alignment tracking word-by-word pronunciation", 
    icon: Activity 
  },
  { 
    label: "Multifactor Scoring", 
    desc: "Aggregated intelligence for fluency, clarity, confidence", 
    icon: Brain 
  },
  { 
    label: "Ephemeral Privacy", 
    desc: "No permanent data retention. Processed and deleted instantly", 
    icon: LockKeyhole 
  },
];

export default function Home() {
  const mutation = useMutation({
    mutationFn: ({ file, consent }: { file: File; consent: boolean }) => analyzeAudio(file, consent),
  });

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      {/* Floating blur circles behind content */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 size-[450px] rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 50, -40, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 -right-20 size-[550px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px]"
        />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Navigation Header */}
        <nav className="flex items-center justify-between py-4 border-b border-zinc-200/50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-zinc-950 text-white shadow-md dark:bg-white dark:text-zinc-950 font-bold">
              <Sparkles className="size-4.5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Livo AI</div>
              <div className="text-sm font-semibold tracking-tight">Pronounce AI</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {mutation.data && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => mutation.reset()}
                className="flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-1.5 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-white/10 transition cursor-pointer text-zinc-850 dark:text-zinc-200"
              >
                Analyze New Audio
              </motion.button>
            )}
            <div className="hidden items-center gap-2 rounded-full border border-zinc-200/50 bg-white/50 dark:bg-white/3 px-3.5 py-1.5 text-xs font-medium text-zinc-500 backdrop-blur dark:border-white/5 dark:text-zinc-400 sm:flex shadow-sm">
              <LockKeyhole className="size-3.5 text-emerald-500" />
              Secure Ephemeral Processing
            </div>
          </div>
        </nav>

        {/* Dynamic Page Views */}
        <AnimatePresence mode="wait">
          {!mutation.data ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Hero Section */}
              <section className="grid min-h-[640px] items-center gap-12 py-16 lg:grid-cols-[1fr_520px]">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/20 dark:border-teal-500/10 bg-teal-500/5 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 backdrop-blur">
                    <Sparkles className="size-3" />
                    Speech Intelligence Platform
                  </div>
                  <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                    Perfect your english speech.
                  </h1>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Upload a short recording to receive instant, word-level audio metrics. Assess fluency, clarity, confidence, speed, and expected phonetic alignment in a professional dashboard.
                  </p>
                  
                  {/* Features Pillar Grid */}
                  <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
                    {pillars.map(({ label, desc, icon: Icon }) => (
                      <div 
                        key={label} 
                        className="rounded-2xl border border-zinc-200/50 bg-white/40 p-4.5 shadow-sm dark:border-white/5 dark:bg-white/2 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 backdrop-blur"
                      >
                        <div className="mb-3.5 inline-grid size-8 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          <Icon className="size-4" />
                        </div>
                        <div className="text-sm font-bold dark:text-white text-zinc-950">{label}</div>
                        <div className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500 leading-normal">{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment Widget / Upload Flow */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98, y: 10 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} 
                  className="relative w-full flex flex-col items-center"
                >
                  {mutation.isPending ? (
                    <Processing />
                  ) : (
                    <UploadCard onAnalyze={(file, consent) => mutation.mutate({ file, consent })} isPending={mutation.isPending} />
                  )}
                  
                  {mutation.error ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 w-full max-w-xl rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400 backdrop-blur flex items-center justify-between"
                    >
                      <span>{mutation.error.message}</span>
                      <button 
                        onClick={() => mutation.reset()}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition"
                      >
                        Reset
                      </button>
                    </motion.div>
                  ) : null}
                </motion.div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Results result={mutation.data} onReset={() => mutation.reset()} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

