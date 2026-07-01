import re
import io
from pathlib import Path
from typing import Optional

import pdfplumber
from docx import Document
from rapidfuzz import fuzz

from .skill_taxonomy import ALIAS_MAP, SKILL_TAXONOMY

# ── Deneyim yılı pattern'leri ──
EXP_PATTERNS = [
    r'(\d+)\+?\s*yıl',
    r'(\d+)\+?\s*year',
    r'(\d+)\+?\s*yr',
    r'experience[:\s]+(\d+)',
    r'(\d+)\s*years?\s+of\s+experience',
    r'(\d+)\s*yıllık\s+deneyim',
]

# ── Eğitim keyword'leri ──
DEGREE_KEYWORDS = {
    "Doktora":   ["doktora", "phd", "ph.d", "doctorate"],
    "Yüksek Lisans": ["yüksek lisans", "master", "msc", "m.sc", "mba", "yükseklisans"],
    "Lisans":    ["lisans", "bachelor", "bsc", "b.sc", "üniversite", "university", "mühendislik"],
    "Önlisans":  ["önlisans", "associate", "meslek yüksekokulu", "myo"],
    "Lise":      ["lise", "high school", "anadolu lisesi"],
}

# ── Dil keyword'leri ──
LANG_KEYWORDS = {
    "Türkçe":   ["türkçe", "turkish", "native türkçe"],
    "İngilizce": ["ingilizce", "english", "ielts", "toefl", "toeic"],
    "Almanca":  ["almanca", "german", "deutsch"],
    "Fransızca": ["fransızca", "french", "français"],
    "İspanyolca": ["ispanyolca", "spanish", "español"],
}


def extract_text_from_pdf(data: bytes) -> str:
    text_parts = []
    with pdfplumber.open(io.BytesIO(data)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
    return "\n".join(text_parts)


def extract_text_from_docx(data: bytes) -> str:
    doc = Document(io.BytesIO(data))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())


def extract_text(data: bytes, filename: str) -> str:
    ext = Path(filename).suffix.lower()
    if ext == ".pdf":
        return extract_text_from_pdf(data)
    elif ext in (".docx", ".doc"):
        return extract_text_from_docx(data)
    return data.decode("utf-8", errors="ignore")


def extract_skills(text: str) -> list[str]:
    text_lower = text.lower()
    found: set[str] = set()

    # 1. Direkt alias eşleştirme
    for alias, canonical in ALIAS_MAP.items():
        # kelime sınırı kontrolü
        pattern = r'(?<![a-z0-9])' + re.escape(alias) + r'(?![a-z0-9])'
        if re.search(pattern, text_lower):
            found.add(canonical)

    # 2. Fuzzy matching — kısa token'lar için (3+ karakter)
    tokens = re.findall(r'[a-zA-ZğüşıöçĞÜŞİÖÇ0-9#.+]+', text_lower)
    for token in tokens:
        if len(token) < 3:
            continue
        for alias, canonical in ALIAS_MAP.items():
            if len(alias) < 3:
                continue
            score = fuzz.ratio(token, alias)
            if score >= 88:  # %88 benzerlik eşiği
                found.add(canonical)

    return sorted(found)


def extract_experience_years(text: str) -> Optional[int]:
    text_lower = text.lower()
    years_found = []
    for pattern in EXP_PATTERNS:
        matches = re.findall(pattern, text_lower)
        for m in matches:
            try:
                y = int(m)
                if 0 < y < 50:  # makul aralık
                    years_found.append(y)
            except ValueError:
                pass
    return max(years_found) if years_found else None


def extract_education(text: str) -> Optional[dict]:
    text_lower = text.lower()
    detected_degree = None
    for degree, keywords in DEGREE_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                detected_degree = degree
                break
        if detected_degree:
            break

    # Üniversite / okul adı — büyük harfle başlayan satırlarda ara
    university = None
    uni_pattern = r'([A-ZÜĞİŞÖÇa-züğışöç][a-züğışöçA-ZÜĞİŞÖÇ\s]+(?:Üniversitesi|University|Üniversite|Institute|Enstitüsü))'
    uni_matches = re.findall(uni_pattern, text)
    if uni_matches:
        university = uni_matches[0].strip()

    if not detected_degree and not university:
        return None

    return {"degree": detected_degree, "university": university}


def extract_languages(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for lang, keywords in LANG_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                found.append(lang)
                break
    return found


def extract_email(text: str) -> Optional[str]:
    matches = re.findall(r'[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}', text)
    return matches[0] if matches else None


def extract_phone(text: str) -> Optional[str]:
    matches = re.findall(r'(?:\+90|0)[\s\-]?\d{3}[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}', text)
    return matches[0] if matches else None


def extract_last_role(text: str) -> Optional[str]:
    role_patterns = [
        r'(?:pozisyon|position|unvan|title|görev|role)[:\s]+([^\n,]{5,60})',
        r'(?:olarak|as a|as an)\s+([^\n,]{5,50})',
    ]
    for pattern in role_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            return m.group(1).strip()

    # Yaygın rol isimleri
    common_roles = [
        "Software Engineer", "Senior Software Engineer", "Junior Developer",
        "Full Stack Developer", "Frontend Developer", "Backend Developer",
        "Data Scientist", "ML Engineer", "DevOps Engineer", "Product Manager",
        "Proje Yöneticisi", "Yazılım Geliştirici", "Veri Bilimcisi",
        "Sistem Analisti", "İş Analisti", "UX Designer", "UI Designer",
    ]
    text_lower = text.lower()
    for role in common_roles:
        if role.lower() in text_lower:
            return role

    return None


def analyze_cv(data: bytes, filename: str) -> dict:
    text = extract_text(data, filename)

    skills        = extract_skills(text)
    exp_years     = extract_experience_years(text)
    education     = extract_education(text)
    languages     = extract_languages(text)
    email         = extract_email(text)
    phone         = extract_phone(text)
    last_role     = extract_last_role(text)

    # Basit skor faktörleri (pozisyon bağımsız)
    skill_count   = len(skills)
    skill_factor  = min(100, skill_count * 8)  # her skill 8 puan, max 100
    exp_factor    = min(100, (exp_years or 0) * 12) if exp_years else 30
    edu_weights   = {"Doktora": 100, "Yüksek Lisans": 85, "Lisans": 70, "Önlisans": 50, "Lise": 30}
    edu_factor    = edu_weights.get(education.get("degree") if education else None, 50)

    return {
        "raw_text_length": len(text),
        "skills":          skills,
        "experience_years": exp_years,
        "last_role":       last_role,
        "education":       education,
        "languages":       languages,
        "contact": {
            "email": email,
            "phone": phone,
        },
        "score_factors": {
            "skill_richness":   skill_factor,
            "experience_level": exp_factor,
            "education_weight": edu_factor,
        }
    }
