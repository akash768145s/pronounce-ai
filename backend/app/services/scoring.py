from statistics import mean

from app.schemas.assessment import HighlightState, PronunciationIssue, IssueSeverity, WordAssessment
from app.services.transcription import TranscriptionResult


class ScoringService:
    weights = {
        "word_confidence": 0.40,
        "fluency": 0.25,
        "alignment": 0.20,
        "rhythm": 0.15,
    }

    def score(self, result: TranscriptionResult, duration: float) -> dict:
        words = result.words
        confidences = [word.confidence for word in words] or [0]
        speech_rate = round(len(words) / max(duration, 1) * 60, 1)
        gaps = [max(0, words[i].start - words[i - 1].end) for i in range(1, len(words))]
        long_pauses = [gap for gap in gaps if gap > 0.8]
        rhythm_score = max(55, 100 - int(sum(abs(gap - 0.25) for gap in gaps) * 8) - len(long_pauses) * 6)
        rate_score = max(55, 100 - int(abs(speech_rate - 130) * 0.4))
        word_confidence = int(mean(confidences) * 100)
        fluency = int((rate_score * 0.55) + (rhythm_score * 0.45))
        clarity = int((word_confidence * 0.72) + (result.alignment_quality * 100 * 0.28))
        confidence = int(word_confidence)
        overall = int(
            word_confidence * self.weights["word_confidence"]
            + fluency * self.weights["fluency"]
            + result.alignment_quality * 100 * self.weights["alignment"]
            + rhythm_score * self.weights["rhythm"]
        )

        assessments = [
            WordAssessment(
                word=item.word,
                start=item.start,
                end=item.end,
                confidence=item.confidence,
                score=int(item.confidence * 100),
                state=self._state(item.confidence),
            )
            for item in words
        ]
        issues = [self._issue(word) for word in assessments if word.score < 82]
        return {
            "overall": overall,
            "fluency": fluency,
            "clarity": clarity,
            "confidence": confidence,
            "speech_rate": speech_rate,
            "assessments": assessments,
            "issues": issues[:8],
        }

    def _state(self, confidence: float) -> HighlightState:
        if confidence < 0.72:
            return HighlightState.issue
        if confidence < 0.84:
            return HighlightState.moderate
        return HighlightState.correct

    def _issue(self, word: WordAssessment) -> PronunciationIssue:
        severity = IssueSeverity.high if word.score < 70 else IssueSeverity.medium
        return PronunciationIssue(
            word=word.word,
            start=word.start,
            end=word.end,
            score=word.score,
            issue="Low acoustic confidence and unstable articulation",
            severity=severity,
            suggestion=f"Repeat '{word.word}' slowly, then blend it back into the full sentence.",
            expected_pronunciation=f"Focus on each sound in '{word.word.lower()}'.",
        )
