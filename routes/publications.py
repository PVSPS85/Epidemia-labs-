from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from database import supabase
from services.pdf_service import extract_text_from_pdf

router = APIRouter()

@router.post("/upload")
async def upload_research(
    disease_id: str = Form(...),
    file: UploadFile = File(...)
):
    # 1. Extract text from the PDF for AI indexing
    text_content = await extract_text_from_pdf(file)
    
    # 2. Upload file to Supabase Storage (Will fully work tomorrow!)
    file_path = f"research/{disease_id}/{file.filename}"
    file_content = await file.read()
    
    # Note: Supabase calls are mocked out until we put in the real keys tomorrow
    # supabase.storage.from_("publications").upload(file_path, file_content)
    # public_url = supabase.storage.from_("publications").get_public_url(file_path)
    
    return {
        "message": "Research paper processed successfully",
        "url": "https://dummy-url.com/fake.pdf",
        "preview_text": text_content[:500] # Return first 500 chars as a summary
    }