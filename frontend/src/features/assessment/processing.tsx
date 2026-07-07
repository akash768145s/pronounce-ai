"use client";

import { motion } from "framer-motion";

const steps = ["Uploading", "Transcribing", "Scoring", "Generating feedback"];

export function Processing() {
  return (
    <section className="w-full max-w-xl rounded-lg border border-white/60 bg-white/85 p-6 shadow-xl shadow-zinc-950/10 backdrop-blur dark:border-white/10 dark:bg-zinc-950/70">
      <div className="flex h-20 items-end gap-1">
        {Array.from({ length: 42 }).map((_, index) => (
          <motion.span
            key={index}
            className="w-full rounded-t bg-gradient-to-t from-teal-500 to-indigo-500"
            animate={{ height: [18, 58 - (index % 9) * 3, 24] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: index * 0.025 }}
          />
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
            className="rounded-md border border-zinc-200 bg-white p-3 text-sm font-medium dark:border-white/10 dark:bg-white/5"
          >
            {step}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
