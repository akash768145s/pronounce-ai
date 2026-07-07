"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, UploadCloud, Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WaveformPlayer } from "./components/waveform-player";

const schema = z.object({
  consent: z.boolean().refine(Boolean, "Privacy consent is required to analyze audio."),
});

type UploadCardProps = {
  onAnalyze: (file: File, consent: boolean) => void;
  isPending: boolean;
};

export function UploadCard({ onAnalyze, isPending }: UploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { consent: false },
  });
  const consent = useWatch({ control: form.control, name: "consent" });

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (file) {
        setSelectedFile(file);
      }
    },
    [],
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

  const handleAnalyze = () => {
    form.trigger("consent").then((isValid) => {
      if (isValid && selectedFile) {
        onAnalyze(selectedFile, consent);
      }
    });
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <section className="w-full max-w-xl rounded-3xl border border-zinc-200/50 bg-white/40 p-6 shadow-xl dark:border-white/5 dark:bg-zinc-950/40 backdrop-blur-xl flex flex-col gap-5 select-none">
      
      {!selectedFile ? (
        // Empty State: Drag & Drop zone
        <div 
          {...getRootProps()} 
          onClick={open}
          className={cn(
            "group relative rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4 hover:bg-zinc-50/50 dark:hover:bg-white/2 hover:border-indigo-500/50 dark:hover:border-indigo-500/30",
            isDragActive && "border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/3"
          )}
        >
          <input {...getInputProps()} />
          
          {/* Pulsing Upload Icon */}
          <div className="relative grid size-14 place-items-center rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md group-hover:scale-105 transition-all duration-300">
            <UploadCloud className="size-6 animate-pulse" />
          </div>

          <div>
            <h3 className="font-bold text-base dark:text-white text-zinc-900">Upload your English recording</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto">
              Drag and drop or click to browse. WAV, MP3, AAC, or M4A (30-45 seconds, max 25MB).
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-white/5 text-zinc-500 px-2 py-1 rounded-md">
              wav
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-white/5 text-zinc-500 px-2 py-1 rounded-md">
              mp3
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-white/5 text-zinc-500 px-2 py-1 rounded-md">
              aac
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-white/5 text-zinc-500 px-2 py-1 rounded-md">
              m4a
            </span>
          </div>

          {rejection && (
            <p className="text-xs font-semibold text-rose-500 mt-2">{rejection}</p>
          )}
        </div>
      ) : (
        // Selected State: Waveform Player preview and analyze options
        <div className="flex flex-col gap-4">
          <WaveformPlayer file={selectedFile} onRemove={handleRemoveFile} />
          
          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              onClick={handleAnalyze} 
              disabled={isPending || !consent}
              className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
            >
              <Sparkles className="size-4" />
              Analyze Speech Accuracy
            </Button>
            
            <Button 
              type="button" 
              variant="secondary" 
              onClick={open}
              disabled={isPending}
              className="rounded-xl border border-zinc-200/50 dark:border-white/5 bg-white/10 text-xs font-bold"
            >
              Replace
            </Button>
          </div>
        </div>
      )}

      {/* Privacy Consent Checkbox */}
      <label 
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 p-4 text-xs text-zinc-500 transition duration-300 dark:border-white/5 dark:bg-white/2 hover:border-indigo-500/20 dark:hover:border-indigo-500/10",
          consent && "border-indigo-500/20 dark:border-indigo-500/20 bg-indigo-500/[0.01]"
        )}
      >
        <input 
          type="checkbox" 
          className="mt-0.5 size-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 accent-indigo-600 cursor-pointer" 
          {...form.register("consent")} 
        />
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-200">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            Consent Ephemeral Processing
          </span>
          <span className="leading-relaxed mt-0.5 text-zinc-400 dark:text-zinc-500 font-medium">
            I agree to temporarily upload and analyze my recording. No audio files or transcripts are stored permanently.
          </span>
        </div>
      </label>

      {form.formState.errors.consent && (
        <p className="text-xs font-semibold text-rose-500 pl-1">
          {form.formState.errors.consent.message}
        </p>
      )}
    </section>
  );
}
