"""
Pozisyon–Aday eşleştirme skoru.
Mevcut Node.js backend'deki basit string karşılaştırmasının yerini alır.
Fuzzy + alias + semantic ağırlıklandırma kullanır.
"""
from __future__ import annotations
from typing import List, Dict
from rapidfuzz import fuzz
from .skill_taxonomy import ALIAS_MAP


def normalize_skill(skill: str) -> str:
    """Skill'i canonical forma çevir."""
    key = skill.lower().strip()
    return ALIAS_MAP.get(key, skill)


def skill_match_score(candidate_skills: List[str], required: List[str], preferred: List[str]) -> Dict:
    if not candidate_skills:
        return {"total": 1, "req_match": 0, "pref_match": 0, "matched_req": [], "matched_pref": [], "missing_req": required}

    # Normalize
    cand_norm  = [normalize_skill(s) for s in candidate_skills]
    req_norm   = [normalize_skill(s) for s in required]
    pref_norm  = [normalize_skill(s) for s in preferred]

    def fuzzy_match(skill: str, pool: list[str]) -> bool:
        for s in pool:
            # Direkt eşleşme
            if skill.lower() == s.lower():
                return True
            # Fuzzy eşleşme (%85 eşiği)
            if fuzz.ratio(skill.lower(), s.lower()) >= 85:
                return True
        return False

    matched_req  = [s for s in req_norm  if fuzzy_match(s, cand_norm)]
    matched_pref = [s for s in pref_norm if fuzzy_match(s, cand_norm)]
    missing_req  = [s for s in req_norm  if s not in matched_req]

    req_ratio  = len(matched_req)  / len(req_norm)  if req_norm  else 1.0
    pref_ratio = len(matched_pref) / len(pref_norm) if pref_norm else 1.0

    total = round((req_ratio * 70) + (pref_ratio * 30))
    total = max(1, min(100, total))

    return {
        "total":        total,
        "req_match":    round(req_ratio * 100),
        "pref_match":   round(pref_ratio * 100),
        "matched_req":  matched_req,
        "matched_pref": matched_pref,
        "missing_req":  missing_req,
    }
