"use client";

import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Activity, Brain, LockKeyhole, Sparkles } from "lucide-react";

import { analyzeAudio } from "@/features/assessment/api";
import { Processing } from "@/features/assessment/processing";
import { Results } from "@/features/assessment/results";
import { UploadCard } from "@/features/assessment/upload-card";

const pillars = [
  { label: "Word-level alignment", icon: Activity },
  { label: "Weighted scoring", icon: Brain },
  { label: "Private by design", icon: LockKeyhole },
];

export default function Home() {
  const mutation = useMutation({
    mutationFn: ({ file, consent }: { file: File; consent: boolean }) => analyzeAudio(file, consent),
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ccfbf1,transparent_32%),radial-gradient(circle_at_top_right,#e0e7ff,transparent_30%),linear-gradient(180deg,#fafafa,#f4f4f5)] px-4 py-5 text-zinc-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(99,102,241,.26),transparent_30%),linear-gradient(180deg,#050505,#111113)] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md bg-zinc-950 text-white shadow-lg shadow-zinc-950/20 dark:bg-white dark:text-zinc-950">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Livo AI</div>
              <div className="font-semibold">Pronunciation Assessment</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-600 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-zinc-300 sm:flex">
            <LockKeyhole className="size-4" />
            No permanent audio storage
          </div>
        </nav>

        <section className="grid min-h-[680px] items-center gap-10 py-14 lg:grid-cols-[1fr_520px]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-5 inline-flex rounded-md border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-zinc-200">
              AI speech analytics for high-stakes English practice
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl lg:text-7xl">
              Know exactly which words need work.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Upload a short English recording and get a scored, timestamped pronunciation report with fluency, clarity, confidence, rhythm, and personalized practice guidance.
            </p>
            <div className="mt-8 hidden max-w-2xl gap-3 sm:grid sm:grid-cols-3">
              {pillars.map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-lg shadow-zinc-950/5 backdrop-blur dark:border-white/10 dark:bg-white/10">
                  <Icon className="mb-3 size-5 text-teal-600 dark:text-teal-300" />
                  <div className="text-sm font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
            {mutation.isPending ? (
              <Processing />
            ) : (
              <UploadCard onAnalyze={(file, consent) => mutation.mutate({ file, consent })} isPending={mutation.isPending} />
            )}
            {mutation.error ? (
              <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">
                {mutation.error.message}
              </div>
            ) : null}
          </motion.div>
        </section>

        {mutation.data ? <Results result={mutation.data} /> : null}
      </div>
    </main>
  );
}
