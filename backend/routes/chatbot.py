from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import get_disease_answer

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    context: str = "" # Optional: we can pass PDF text here later

@router.post("/")
async def chat_with_ai(request: ChatRequest):
    try:
        # Sends the question to Gemini and waits for the answer
        answer = await get_disease_answer(request.question, request.context)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")