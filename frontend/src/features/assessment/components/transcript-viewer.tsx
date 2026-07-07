"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
import { HighlightedToken, PronunciationIssue } from "../types";
import { cn, formatSeconds } from "@/lib/utils";

type TranscriptViewerProps = {
  tokens: HighlightedToken[];
  issues: PronunciationIssue[];
};

export function TranscriptViewer({ tokens, issues }: TranscriptViewerProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative leading-relaxed select-none">
      <div className="flex flex-wrap gap-x-2 gap-y-3.5">
        {tokens.map((token, index) => {
          const cleanWord = (w: string) => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
          const matchingIssue = issues.find(
            (iss) =>
              cleanWord(iss.word) === cleanWord(token.word) &&
              Math.abs(iss.start - token.start) < 1.2
          );

          const score = token.score;
          const state = token.state;
          const displayIssue = matchingIssue?.issue || token.issue;
          const displaySuggestion = matchingIssue?.suggestion || token.recommendation;
          const expected = matchingIssue?.expected_pronunciation;

          return (
            <div
              key={`${token.word}-${index}`}
              className="relative inline-block"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <motion.button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                whileHover={{ scale: 1.05, y: -1 }}
                className={cn(
                  "px-2.5 py-1 rounded-xl text-base font-semibold border transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  state === "correct" &&
                    "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15",
                  state === "moderate" &&
                    "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15",
                  state === "issue" &&
                    "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300 hover:bg-rose-500/15"
                )}
              >
                {token.word}
              </motion.button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 z-40 w-64 p-4 rounded-2xl glass-panel border border-zinc-200/60 dark:border-white/10 shadow-2xl text-left text-xs font-normal"
                  >
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-zinc-200/60 dark:border-t-zinc-900 shadow-xl" />

                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm truncate pr-2 max-w-[120px] dark:text-white text-zinc-950">
                        {token.word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                          state === "correct" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
                          state === "moderate" && "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
                          state === "issue" && "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
                        )}
                      >
                        {score}/100
                      </span>
                    </div>

                    <div className="space-y-2 mt-2 border-t border-zinc-200/40 dark:border-white/5 pt-2">
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>Time: {formatSeconds(token.start)} - {formatSeconds(token.end)}</span>
                      </div>

                      {expected && (
                        <div className="flex items-center gap-1 bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-1.5 dark:text-indigo-300 text-indigo-700 font-mono text-[10px]">
                          <Volume2 className="size-3 shrink-0" />
                          <span>Expected: <span className="font-bold">{expected}</span></span>
                        </div>
                      )}

                      {displayIssue && (
                        <div className="flex gap-1 text-[11px] text-zinc-700 dark:text-zinc-300">
                          <span className="font-semibold text-zinc-400">Issue:</span>
                          <span className="font-medium text-rose-600 dark:text-rose-400">{displayIssue}</span>
                        </div>
                      )}

                      {displaySuggestion && (
                        <div className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300 border-t border-zinc-200/20 dark:border-white/5 pt-1.5 mt-1">
                          <div className="font-semibold text-[10px] uppercase text-zinc-400 mb-0.5">Tip</div>
                          {displaySuggestion}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
