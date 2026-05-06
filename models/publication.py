from pydantic import BaseModel

class PublicationBase(BaseModel):
    user_id: str
    disease_name: str
    title: str
    summary: str
    pdf_url: str

class PublicationResponse(PublicationBase):
    id: str