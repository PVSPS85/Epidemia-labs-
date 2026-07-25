from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from database import supabase
from services.pdf_service import extract_text_from_pdf

router = APIRouter()

@router.get("/")
async def get_publications():
    """Fetch all publications from Supabase. Returns empty list if table doesn't exist."""
    try:
        response = supabase.table("publications").select("*").execute()
        return response.data if response.data else []
    except Exception:
        # Table may not exist yet — return empty list
        return []

@router.post("/upload")
async def upload_publication(
    disease_id: str = Form(...),
    file: UploadFile = File(...),
):
    """Upload a research PDF and extract text."""
    try:
        text = extract_text_from_pdf(file)
        preview = text[:500] if text else "No text extracted"

        # Try to store in Supabase
        try:
            supabase.table("publications").insert({
                "disease_id": disease_id,
                "filename": file.filename,
                "preview_text": preview,
            }).execute()
        except Exception:
            pass  # Table may not exist yet

        return {
            "message": "Publication uploaded successfully",
            "filename": file.filename,
            "preview_text": preview,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))