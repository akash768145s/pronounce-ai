import { AnalysisResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

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
