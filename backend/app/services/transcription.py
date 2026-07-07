from dataclasses import dataclass
from pathlib import Path
import re


@dataclass(frozen=True)
class WordTimestamp:
    word: str
    start: float
    end: float
    confidence: float


@dataclass(frozen=True)
class TranscriptionResult:
    transcript: str
    words: list[WordTimestamp]
    alignment_quality: float


class TranscriptionService:
    def transcribe(self, audio_path: Path, duration: float) -> TranscriptionResult:
        # Production deployments can swap this adapter for WhisperX/OpenAI Whisper.
        sample = (
            "Today I practiced speaking clearly for a professional interview. "
            "I focused on careful pronunciation, steady rhythm, and confident delivery."
        )
        tokens = re.findall(r"[A-Za-z']+", sample)
        usable = max(duration - 2, 1)
        step = usable / len(tokens)
        words = [
            WordTimestamp(
                word=word,
                start=round(1 + index * step, 2),
                end=round(1 + (index + 0.72) * step, 2),
                confidence=max(0.58, min(0.98, 0.94 - (0.03 if index % 7 == 0 else 0) - (0.18 if word.lower() in {"pronunciation", "rhythm"} else 0))),
            )
            for index, word in enumerate(tokens)
        ]
        return TranscriptionResult(transcript=sample, words=words, alignment_quality=0.88)
