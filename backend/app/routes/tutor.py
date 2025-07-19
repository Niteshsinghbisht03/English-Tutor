from fastapi import APIRouter
from app.schemas.request import SentenceRequest
from app.schemas.response import SentenceResponse
from app.services.langgraph_service import run_tutor_workflow

router = APIRouter()

@router.post("/correct-sentence", response_model=SentenceResponse)
def correct(request: SentenceRequest):
    return run_tutor_workflow(request.sentence)