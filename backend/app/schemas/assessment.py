from enum import Enum

from pydantic import BaseModel, Field


class IssueSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class HighlightState(str, Enum):
    correct = "correct"
    moderate = "moderate"
    issue = "issue"


class WordAssessment(BaseModel):
    word: str
    start: float
    end: float
    confidence: float = Field(ge=0, le=1)
    score: int = Field(ge=0, le=100)
    state: HighlightState


class PronunciationIssue(BaseModel):
    word: str
    start: float
    end: float
    score: int = Field(ge=0, le=100)
    issue: str
    severity: IssueSeverity
    suggestion: str
    expected_pronunciation: str


class HighlightedToken(BaseModel):
    word: str
    start: float
    end: float
    state: HighlightState
    score: int
    issue: str | None = None
    recommendation: str | None = None


class AnalysisResponse(BaseModel):
    overallScore: int = Field(ge=0, le=100)
    fluency: int = Field(ge=0, le=100)
    clarity: int = Field(ge=0, le=100)
    confidence: int = Field(ge=0, le=100)
    speechRate: float
    duration: float
    transcript: str
    highlightedTranscript: list[HighlightedToken]
    pronunciationIssues: list[PronunciationIssue]
    strengths: list[str]
    improvements: list[str]
    feedback: str
    wordsToRepeat: list[str]
    retentionNotice: str


class DeleteResponse(BaseModel):
    deleted: bool
    message: str
