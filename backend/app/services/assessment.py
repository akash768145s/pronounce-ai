from fastapi import UploadFile

from app.schemas.assessment import AnalysisResponse, HighlightedToken
from app.services.audio import AudioService
from app.services.feedback import FeedbackService
from app.services.scoring import ScoringService
from app.services.transcription import TranscriptionService


class AssessmentService:
    def __init__(
        self,
        audio: AudioService,
        transcription: TranscriptionService,
        scoring: ScoringService,
        feedback: FeedbackService,
    ) -> None:
        self.audio = audio
        self.transcription = transcription
        self.scoring = scoring
        self.feedback = feedback

    async def analyze(self, upload: UploadFile, consent: bool) -> AnalysisResponse:
        if not consent:
            from app.core.errors import AppError

            raise AppError("Please accept the privacy notice before uploading audio.")

        original = await self.audio.persist_upload(upload)
        normalized = original
        try:
            duration = self.audio.duration_seconds(original)
            self.audio.validate_duration(duration)
            normalized = self.audio.normalize(original)
            transcription = self.transcription.transcribe(normalized, duration)
            scores = self.scoring.score(transcription, duration)
            feedback = await self.feedback.explain(transcription.transcript, scores, scores["issues"])
            issue_lookup = {issue.word.lower(): issue for issue in scores["issues"]}
            highlighted = [
                HighlightedToken(
                    word=word.word,
                    start=word.start,
                    end=word.end,
                    state=word.state,
                    score=word.score,
                    issue=issue_lookup.get(word.word.lower()).issue if word.word.lower() in issue_lookup else None,
                    recommendation=issue_lookup.get(word.word.lower()).suggestion if word.word.lower() in issue_lookup else None,
                )
                for word in scores["assessments"]
            ]
            return AnalysisResponse(
                overallScore=scores["overall"],
                fluency=scores["fluency"],
                clarity=scores["clarity"],
                confidence=scores["confidence"],
                speechRate=scores["speech_rate"],
                duration=round(duration, 1),
                transcript=transcription.transcript,
                highlightedTranscript=highlighted,
                pronunciationIssues=scores["issues"],
                retentionNotice="Audio is processed in temporary storage and deleted immediately after analysis.",
                **feedback,
            )
        finally:
            self.audio.cleanup(original, normalized)
