"""
Go4Talent ML Service — Port 5002
FastAPI tabanlı CV analiz ve skill eşleştirme servisi.
"""
from __future__ import annotations
from typing import List, Optional
import httpx
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.cv_parser import analyze_cv
from app.matcher import skill_match_score

app = FastAPI(title="Go4Talent ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5001"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ──
@app.get("/health")
def health():
    return {"status": "ok", "service": "Go4Talent ML Service", "port": 5002}


# ── CV Parse — dosya upload ──
@app.post("/api/cv/parse")
async def parse_cv(file: UploadFile = File(...)):
    allowed = {".pdf", ".doc", ".docx", ".txt"}
    import os
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed:
        raise HTTPException(400, f"Desteklenmeyen dosya tipi: {ext}. PDF, DOC veya DOCX gönderin.")

    data = await file.read()
    if len(data) > 10 * 1024 * 1024:  # 10 MB
        raise HTTPException(400, "Dosya boyutu 10 MB'ı aşıyor.")

    result = analyze_cv(data, file.filename)
    return result


# ── CV Parse — Supabase Storage URL'den ──
class ParseUrlRequest(BaseModel):
    url: str
    filename: str = "cv.pdf"

@app.post("/api/cv/parse-url")
async def parse_cv_from_url(req: ParseUrlRequest):
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(req.url)
            resp.raise_for_status()
    except Exception as e:
        raise HTTPException(400, f"Dosya indirilemedi: {str(e)}")

    result = analyze_cv(resp.content, req.filename)
    return result


# ── Match Score ──
class MatchRequest(BaseModel):
    candidate_skills: List[str]
    required_skills:  List[str]
    preferred_skills: List[str] = []

@app.post("/api/match-score")
def match_score(req: MatchRequest):
    result = skill_match_score(
        req.candidate_skills,
        req.required_skills,
        req.preferred_skills,
    )
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5002, reload=True)
