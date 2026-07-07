from typing import Annotated

from fastapi import Depends

from app.core.config import Settings, get_settings
from app.services.assessment import AssessmentService
from app.services.audio import AudioService
from app.services.feedback import FeedbackService
from app.services.scoring import ScoringService
from app.services.transcription import TranscriptionService


def get_assessment_service(settings: Annotated[Settings, Depends(get_settings)]) -> AssessmentService:
    return AssessmentService(
        audio=AudioService(settings),
        transcription=TranscriptionService(),
        scoring=ScoringService(),
        feedback=FeedbackService(),
    )
