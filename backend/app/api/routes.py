from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.api.deps import get_assessment_service
from app.schemas.assessment import AnalysisResponse, DeleteResponse
from app.services.assessment import AssessmentService

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_audio(
    service: Annotated[AssessmentService, Depends(get_assessment_service)],
    file: UploadFile = File(...),
    consent: bool = Form(...),
) -> AnalysisResponse:
    return await service.analyze(file, consent)


@router.delete("/data", response_model=DeleteResponse)
async def delete_data() -> DeleteResponse:
    return DeleteResponse(deleted=True, message="No persistent audio or transcript data is stored.")
