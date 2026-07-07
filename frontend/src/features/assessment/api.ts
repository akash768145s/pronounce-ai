import { AnalysisResponse } from "./types";

const getApiBase = (): string => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname.includes("vercel.app") || hostname.includes("pronounce-ai-green")) {
      return "https://pronounce-ai-odac.vercel.app";
    }
  }
  
  return "http://localhost:8000";
};

const API_BASE = getApiBase();

export async function analyzeAudio(file: File, consent: boolean): Promise<AnalysisResponse> {
  const body = new FormData();
  body.append("file", file);
  body.append("consent", String(consent));

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error?.message ?? "Unable to analyze this recording.");
  }

  return response.json();
}
