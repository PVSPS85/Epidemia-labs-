import google.generativeai as genai
from config import get_settings

settings = get_settings()

# Configure the Gemini API securely
genai.configure(api_key=settings.GEMINI_API_KEY)

# Initialize the model (using 1.5-pro for complex research reasoning)
model = genai.GenerativeModel('gemini-1.5-pro')

async def get_disease_answer(question: str, context: str = "") -> str:
    """
    Uses Gemini to answer epidemiology questions based on provided research context.
    """
    prompt = f"""
    You are an expert AI epidemiologist assisting a user on a Disease Spread Research Platform.
    Use the following context from research papers to inform your answer. 
    If the context doesn't contain the answer, use your expert knowledge but clarify that.
    
    Context:
    {context}
    
    User Question: 
    {question}
    """
    
    # Asynchronous generation prevents blocking the main FastAPI thread
    response = await model.generate_content_async(prompt)
    return response.text
