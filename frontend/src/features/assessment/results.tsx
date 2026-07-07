"use client";

import { Download, FileJson, Gauge, Timer } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn, formatSeconds } from "@/lib/utils";

import { AnalysisResponse, HighlightedToken } from "./types";

export function Results({ result }: { result: AnalysisResponse }) {
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "pronunciation-report.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/5 dark:border-white/10 dark:bg-zinc-950/80">
        <ProgressRing score={result.overallScore} label="Overall score" />
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Metric label="Fluency" value={result.fluency} />
          <Metric label="Clarity" value={result.clarity} />
          <Metric label="Confidence" value={result.confidence} />
          <Metric label="Speed" value={result.speechRate} suffix=" wpm" />
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={exportJson} className="flex-1">
            <FileJson className="size-4" />
            JSON
          </Button>
          <Button variant="secondary" className="flex-1" disabled>
            <Download className="size-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Panel title="Highlighted Transcript">
          <div className="flex flex-wrap gap-2 leading-8">
            {result.highlightedTranscript.map((token, index) => (
              <TranscriptToken key={`${token.word}-${index}`} token={token} />
            ))}
          </div>
        </Panel>

        <Panel title="Timeline Issues">
          <div className="space-y-3">
            {result.pronunciationIssues.map((issue) => (
              <div key={`${issue.word}-${issue.start}`} className="rounded-md border border-zinc-200 p-4 dark:border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-lg font-semibold">{issue.word}</span>
                  <span className="text-sm text-zinc-500">{formatSeconds(issue.start)} - {formatSeconds(issue.end)} · {issue.score}/100</span>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{issue.suggestion}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Personalized Feedback">
          <p className="text-zinc-700 dark:text-zinc-300">{result.feedback}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Advice title="Strengths" items={result.strengths} />
            <Advice title="Improvements" items={result.improvements} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 dark:bg-white/10">
              <Timer className="size-4" />
              Duration {formatSeconds(result.duration)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 dark:bg-white/10">
              <Gauge className="size-4" />
              {result.retentionNotice}
            </span>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function Metric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-md bg-zinc-50 p-3 dark:bg-white/5">
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-normal">{value}{suffix}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/5 dark:border-white/10 dark:bg-zinc-950/80">
      <h3 className="mb-4 text-xl font-semibold tracking-normal">{title}</h3>
      {children}
    </div>
  );
}

function TranscriptToken({ token }: { token: HighlightedToken }) {
  return (
    <span
      title={token.recommendation ?? `${token.score}/100`}
      className={cn(
        "cursor-pointer rounded-md px-2 py-1 text-sm font-medium transition hover:-translate-y-0.5",
        token.state === "correct" && "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200",
        token.state === "moderate" && "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
        token.state === "issue" && "bg-rose-100 text-rose-900 dark:bg-rose-400/15 dark:text-rose-200",
      )}
    >
      {token.word}
    </span>
  );
}

function Advice({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
