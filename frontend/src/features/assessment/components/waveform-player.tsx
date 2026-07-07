"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, Volume2, VolumeX, FileAudio, RefreshCw } from "lucide-react";
import { formatSeconds } from "@/lib/utils";

type WaveformPlayerProps = {
  file: File;
  onRemove?: () => void;
};

export function WaveformPlayer({ file, onRemove }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let ws: WaveSurfer | null = null;
    const objectUrl = URL.createObjectURL(file);

    try {
      ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#a1a1aa", // zinc-400
        progressColor: "#6366f1", // indigo-500
        cursorColor: "#4f46e5", // indigo-600
        barWidth: 2,
        barGap: 3,
        barRadius: 4,
        height: 60,
        cursorWidth: 1,
        normalize: true,
      });

      ws.load(objectUrl);
      waveSurferRef.current = ws;

      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));
      ws.on("ready", () => {
        if (ws) {
          setDuration(ws.getDuration());
          setIsReady(true);
        }
      });
      ws.on("audioprocess", () => {
        if (ws) {
          setCurrentTime(ws.getCurrentTime());
        }
      });
      ws.on("interaction", () => {
        if (ws) {
          setCurrentTime(ws.getCurrentTime());
        }
      });
    } catch (err) {
      console.error("Error creating wavesurfer:", err);
    }

    return () => {
      if (ws) {
        ws.destroy();
      }
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const togglePlay = () => {
    if (!isReady) return;
    waveSurferRef.current?.playPause();
  };

  const toggleMute = () => {
    if (!isReady || !waveSurferRef.current) return;
    const nextMuted = !isMuted;
    waveSurferRef.current.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const handleSpeedChange = () => {
    if (!isReady || !waveSurferRef.current) return;
    const speeds = [1, 1.25, 1.5, 0.75];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextRate = speeds[nextIndex];
    waveSurferRef.current.setPlaybackRate(nextRate);
    setPlaybackRate(nextRate);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-zinc-200/50 dark:border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
            <FileAudio className="size-5" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold truncate max-w-[200px] sm:max-w-[300px]">
              {file.name}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              {(file.size / (1024 * 1024)).toFixed(2)} MB · {formatSeconds(duration || 0)}
            </div>
          </div>
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className="text-xs font-semibold text-rose-600 hover:text-rose-500 transition px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10"
          >
            Remove file
          </button>
        )}
      </div>

      <div className="my-5 relative rounded-lg bg-zinc-50/50 dark:bg-white/2 p-3">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-[2px] rounded-lg">
            <RefreshCw className="size-5 text-indigo-500 animate-spin mr-2" />
            <span className="text-xs text-zinc-500 font-medium">Preparing waveform...</span>
          </div>
        )}
        <div ref={containerRef} className="w-full" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            disabled={!isReady}
            className="p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-indigo-600/20"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="size-4 fill-white" /> : <Play className="size-4 fill-white translate-x-0.5" />}
          </button>

          <button
            onClick={toggleMute}
            disabled={!isReady}
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>

          <button
            onClick={handleSpeedChange}
            disabled={!isReady}
            className="text-xs font-semibold font-mono text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition"
          >
            {playbackRate}x
          </button>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          {formatSeconds(currentTime)} / {formatSeconds(duration)}
        </div>
      </div>
    </div>
  );
}
