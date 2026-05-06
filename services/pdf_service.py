import io
import PyPDF2
from fastapi import UploadFile

async def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Reads an uploaded PDF file and extracts its text content.
    """
    content = await file.read()
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text