"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mic, ShieldCheck, UploadCloud, Wand2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  consent: z.boolean().refine(Boolean, "Privacy consent is required."),
});

type UploadCardProps = {
  onAnalyze: (file: File, consent: boolean) => void;
  isPending: boolean;
};

export function UploadCard({ onAnalyze, isPending }: UploadCardProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { consent: false },
  });
  const selected = useWatch({ control: form.control, name: "consent" });

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (file) onAnalyze(file, selected);
    },
    [onAnalyze, selected],
  );

  const { getRootProps, getInputProps, isDragActive, open, fileRejections } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    accept: {
      "audio/wav": [".wav"],
      "audio/mpeg": [".mp3"],
      "audio/aac": [".aac"],
      "audio/mp4": [".m4a"],
    },
    maxSize: 25 * 1024 * 1024,
  });

  const rejection = useMemo(() => fileRejections[0]?.errors[0]?.message, [fileRejections]);

  return (
    <section className="w-full max-w-xl rounded-lg border border-white/60 bg-white/85 p-5 shadow-2xl shadow-zinc-950/10 backdrop-blur dark:border-white/10 dark:bg-zinc-950/70">
      <div {...getRootProps()} className={cn("rounded-md border border-dashed border-zinc-300 p-6 transition dark:border-white/15", isDragActive && "border-teal-400 bg-teal-50 dark:bg-teal-500/10")}>
        <input {...getInputProps()} />
        <div className="flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <UploadCloud className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-normal">Upload your English recording</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">30-45 seconds, WAV, MP3, AAC, or M4A. Audio is deleted immediately after processing.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="button" onClick={open} disabled={isPending || !selected}>
            <Wand2 className="size-4" />
            Analyze audio
          </Button>
          <Button type="button" variant="secondary" disabled>
            <Mic className="size-4" />
            Record soon
          </Button>
        </div>
        {rejection ? <p className="mt-3 text-sm text-rose-600">{rejection}</p> : null}
        {form.formState.errors.consent ? <p className="mt-3 text-sm text-rose-600">{form.formState.errors.consent.message}</p> : null}
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-white/5 dark:text-zinc-300">
        <input type="checkbox" className="mt-1 size-4 accent-zinc-950 dark:accent-white" {...form.register("consent")} />
        <span>
          <span className="flex items-center gap-2 font-medium text-zinc-950 dark:text-white">
            <ShieldCheck className="size-4" />
            Privacy consent
          </span>
          I agree to temporary processing for pronunciation assessment only. No training, no permanent storage, minimal logs.
        </span>
      </label>
    </section>
  );
}
