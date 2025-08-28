from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from PyPDF2 import PdfReader
from dotenv import load_dotenv
import os, re, tempfile

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def read_pdf(file_path):
    pdf_reader = PdfReader(file_path)
    pdf_text = ""
    for page in pdf_reader.pages:
        text = page.extract_text()
        if text:
            pdf_text += text
    return pdf_text

def extract_score(response_text):
    match = re.search(r'(\d{1,3})\s*/\s*100', response_text)
    return int(match.group(1)) if match else None

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
):
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        pdf_text = read_pdf(tmp_path)

        prompt = f"""You are ResumeChecker, an expert in resume analysis. Provide a quick scan of the following resume"""
        response = model.generate_content([pdf_text, prompt])
        response_text = response.text
        score = extract_score(response_text)

        return JSONResponse(content={
            "status": "success",
            "score": score,
            "analysis": response_text
        })
    finally:
        os.remove(tmp_path)

@app.post("/chat")
async def chat_about_resume(
    question: str = Form(...),
    resume_text: str = Form(...),
    previous_analysis: str = Form("")
):
    chat_prompt = f"""
    Based on the resume and analysis, answer in brief:
    {question}
    Resume text: {resume_text}
    Previous analysis: {previous_analysis}
    """
    response = model.generate_content(chat_prompt)
    return JSONResponse(content={"response": response.text})
