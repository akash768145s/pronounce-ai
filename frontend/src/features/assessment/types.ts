export type HighlightState = "correct" | "moderate" | "issue";

export type PronunciationIssue = {
  word: string;
  start: number;
  end: number;
  score: number;
  issue: string;
  severity: "low" | "medium" | "high";
  suggestion: string;
  expected_pronunciation: string;
};

export type HighlightedToken = {
  word: string;
  start: number;
  end: number;
  state: HighlightState;
  score: number;
  issue?: string | null;
  recommendation?: string | null;
};

export type AnalysisResponse = {
  overallScore: number;
  fluency: number;
  clarity: number;
  confidence: number;
  speechRate: number;
  duration: number;
  transcript: string;
  highlightedTranscript: HighlightedToken[];
  pronunciationIssues: PronunciationIssue[];
  strengths: string[];
  improvements: string[];
  feedback: string;
  wordsToRepeat: string[];
  retentionNotice: string;
};
