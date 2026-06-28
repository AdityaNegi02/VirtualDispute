import uvicorn
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from typing import Optional
import requests
import rag
import fitz  # PyMuPDF
from PIL import Image
import io

app = FastAPI()

# Initialize RAG on startup
vectorstore = rag.initialize_rag()

LLAMA_SERVER_URL = "http://localhost:8080/completion"

def extract_text_from_file(file: UploadFile):
    content = ""
    try:
        file_bytes = file.file.read()
        if file.filename.endswith(".pdf"):
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                content += page.get_text()
        elif file.filename.endswith((".png", ".jpg", ".jpeg")):
            # Basic OCR could be added here with Tesseract if needed
            # For now, we'll just acknowledge the image
            content = f"[Image evidence: {file.filename}]"
        return content
    except Exception as e:
        return f"Error extracting text: {str(e)}"

def call_llama(prompt):
    try:
        payload = {
            "prompt": prompt,
            "n_predict": 1024,
            "temperature": 0.2
        }
        response = requests.post(LLAMA_SERVER_URL, json=payload)
        return response.json()["content"]
    except Exception as e:
        return f"Error calling llama.cpp: {str(e)}. (Make sure llama.cpp server is running on port 8080)"

@app.post("/analyze-dispute")
async def analyze_dispute(
    user1_statement: str = Form(...),
    user2_statement: str = Form(""),
    evidence_text: str = Form(""),
    file: Optional[UploadFile] = File(None)
):
    extracted_evidence = ""
    if file:
        extracted_evidence = extract_text_from_file(file)

    # 1. Combine inputs for context
    combined_query = f"{user1_statement} {user2_statement} {evidence_text} {extracted_evidence}"
    
    # 2. Retrieve relevant law clauses
    relevant_laws = rag.get_relevant_laws(combined_query, vectorstore)
    
    # 3. Construct prompt for LLM
    prompt = f"""
    You are an expert Virtual Legal Dispute Resolver. Analyze the dispute based on the provided statements, evidence, and relevant laws.
    
    Relevant Law Clauses:
    {relevant_laws}
    
    User 1 (Initiator) Statement:
    {user1_statement}
    
    User 2 (Respondent) Statement:
    {user2_statement}
    
    Provided Evidence Text:
    {evidence_text}
    
    Extracted Evidence from File:
    {extracted_evidence}
    
    Task:
    1. Summarize the core conflict.
    2. Identify which law clauses apply.
    3. Propose a fair resolution or conclusion based strictly on the laws provided.
    
    Legal Analysis:
    """
    
    # 4. Call LLM
    conclusion = call_llama(prompt)
    
    return {
        "conclusion": conclusion,
        "relevant_laws": relevant_laws,
        "extracted_evidence": extracted_evidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
