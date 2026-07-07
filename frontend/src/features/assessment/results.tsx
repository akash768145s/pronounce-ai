"use client";

import { 
  FileJson, 
  Download, 
  Flame, 
  Volume2, 
  ShieldCheck, 
  Gauge, 
  Timer, 
  CheckCircle2, 
  TrendingUp
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn, formatSeconds } from "@/lib/utils";

import { AnalysisResponse } from "./types";
import { AnimatedScore } from "./components/animated-score";
import { MetricCard } from "./components/metric-card";
import { TranscriptViewer } from "./components/transcript-viewer";
import { FeedbackCard } from "./components/feedback-card";

export function Results({ result, onReset }: { result: AnalysisResponse; onReset?: () => void }) {
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `pronunciation-report-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr] select-none">
      
      {/* Left Column: Overall Score & Report Actions */}
      <div className="flex flex-col gap-6">
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200/50 dark:border-white/5 bg-white/40 dark:bg-zinc-950/40 p-3.5 shadow-sm text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition cursor-pointer"
          >
            ← Analyze Another File
          </button>
        )}
        
        <div className="rounded-3xl border border-zinc-200/50 bg-white/40 p-5 shadow-xl dark:border-white/5 dark:bg-zinc-950/40 backdrop-blur-xl flex flex-col items-center gap-6">
          <AnimatedScore score={result.overallScore} label="Overall Score" />
          
          <div className="w-full border-t border-zinc-200/50 dark:border-white/5 pt-4 flex flex-col gap-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-center mb-1">
              Export Options
            </h4>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                onClick={exportJson} 
                className="flex-1 rounded-xl text-xs font-bold border border-zinc-200/50 dark:border-white/5 bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 h-10 gap-1.5"
              >
                <FileJson className="size-3.5 text-indigo-500" />
                JSON
              </Button>
              <Button 
                variant="secondary" 
                disabled
                className="flex-1 rounded-xl text-xs font-bold border border-zinc-200/50 dark:border-white/5 bg-white/5 text-zinc-400 dark:text-zinc-600 h-10 gap-1.5 opacity-50"
              >
                <Download className="size-3.5" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Small metadata card */}
        <div className="rounded-2xl border border-zinc-200/50 bg-white/40 p-4 dark:border-white/5 dark:bg-zinc-950/40 backdrop-blur-xl text-xs flex flex-col gap-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span>Duration:</span>
            <span className="font-mono font-bold text-zinc-700 dark:text-zinc-200">
              {formatSeconds(result.duration)}
            </span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span>Analyzed words:</span>
            <span className="font-bold text-zinc-700 dark:text-zinc-200">
              {result.highlightedTranscript.length}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Key Metrics, Transcript, timeline and suggestions */}
      <div className="flex flex-col gap-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Fluency" value={result.fluency} icon={Flame} />
          <MetricCard label="Clarity" value={result.clarity} icon={Volume2} />
          <MetricCard label="Confidence" value={result.confidence} icon={ShieldCheck} />
          <MetricCard label="Speech Rate" value={result.speechRate} suffix=" wpm" icon={Gauge} />
        </div>

        {/* Highlighted Transcript panel */}
        <Panel title="Speech Alignment & Scoring" description="Interactive word tokens. Hover over moderate or low-scoring tokens to see specific speech guidelines.">
          <div className="p-4.5 rounded-2xl bg-zinc-50/50 dark:bg-white/2 border border-zinc-200/50 dark:border-white/5">
            <TranscriptViewer tokens={result.highlightedTranscript} issues={result.pronunciationIssues} />
          </div>
        </Panel>

        {/* Timeline Issues */}
        <Panel title="Timeline Pronunciation Issues" description="Chronological analysis of word segments with lower confidence thresholds.">
          <div className="grid gap-3 max-h-[360px] overflow-y-auto pr-1">
            {result.pronunciationIssues.map((issue) => {
              // Severity based color
              const isHigh = issue.severity === "high";
              const isMed = issue.severity === "medium";

              return (
                <div 
                  key={`${issue.word}-${issue.start}`} 
                  className={cn(
                    "rounded-2xl border p-4 transition duration-300 flex flex-col gap-2.5",
                    isHigh && "border-rose-500/20 bg-rose-500/[0.01]",
                    isMed && "border-amber-500/20 bg-amber-500/[0.01]",
                    !isHigh && !isMed && "border-zinc-200/50 dark:border-white/5 bg-zinc-50/[0.02]"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base font-bold dark:text-white text-zinc-950">{issue.word}</span>
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        isHigh && "text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400",
                        isMed && "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
                        !isHigh && !isMed && "text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400"
                      )}>
                        {issue.severity} severity
                      </span>
                    </div>
                    <span className="text-xs font-semibold font-mono text-zinc-400 dark:text-zinc-500">
                      {formatSeconds(issue.start)} - {formatSeconds(issue.end)} · Score {issue.score}/100
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1 border-t border-zinc-200/20 dark:border-white/5 pt-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      <span className="font-semibold text-zinc-400 mr-1">Expected:</span>
                      <span className="font-mono text-zinc-700 dark:text-zinc-300 font-medium">{issue.expected_pronunciation}</span>
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      <span className="font-semibold text-zinc-400 mr-1">Guidance:</span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">{issue.suggestion}</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {result.pronunciationIssues.length === 0 && (
              <div className="text-center p-8 rounded-2xl border border-zinc-200/50 dark:border-white/5 bg-zinc-50/50 dark:bg-white/2 text-zinc-400 text-sm">
                <CheckCircle2 className="size-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                No pronunciation issues detected. High clarity levels!
              </div>
            )}
          </div>
        </Panel>

        {/* Personalized Coaching & Suggestions */}
        <Panel title="Personalized Coaching Explainer" description="AI speech assessment details regarding accent, patterns, and retention guidelines.">
          <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.01] text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {result.feedback}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <FeedbackCard title="Speech Strengths" items={result.strengths} variant="success" icon={CheckCircle2} />
            <FeedbackCard title="Speech Improvements" items={result.improvements} variant="warning" icon={TrendingUp} />
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-4 border-t border-zinc-200/20 dark:border-white/5 pt-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/10">
              <Timer className="size-3.5 text-zinc-400" />
              Duration {formatSeconds(result.duration)}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/10">
              <Gauge className="size-3.5 text-zinc-400" />
              {result.retentionNotice}
            </div>
          </div>
        </Panel>

      </div>
    </section>
  );
}

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-zinc-200/50 bg-white/40 p-6 shadow-xl dark:border-white/5 dark:bg-zinc-950/40 backdrop-blur-xl flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
