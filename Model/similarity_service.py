"""
Similarity Microservice
-----------------------
FastAPI server that exposes POST /match
Takes a list of "page questions" from the job form and maps each one
to the best matching entry in the known QUESTION_BANK.
Returns the matched key + similarity score for every page question.
Only pairs with score >= threshold (default 0.5) are flagged as matched.
"""

import logging
import transformers
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer, util

# Suppress noisy transformer warnings
transformers.logging.set_verbosity_error()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Load model once at startup ──────────────────────────────────────────────
logger.info("Loading sentence-transformer model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
logger.info("Model loaded.")

app = FastAPI(title="Job-Applier Similarity Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static question bank (mirrors QUESTION_BANK in FindJob.tsx) ────────────
QUESTION_BANK = [
    {"key": "highestEducation",   "question": "What is your highest level of education?"},
    {"key": "fieldOfStudy",       "question": "What is your primary field of study?"},
    {"key": "graduationYear",     "question": "In what year did you or will you graduate?"},
    {"key": "willingToRelocate",  "question": "Are you willing to relocate for this position?"},
    {"key": "willingToTravel",    "question": "Are you willing to travel for business?"},
    {"key": "workAuthorization",  "question": "What is your current work authorization status?"},
    {"key": "requiresSponsorship","question": "Do you require visa sponsorship now or in the future?"},
    {"key": "noticePeriod",       "question": "What is your required notice period?"},
    {"key": "expectedSalary",     "question": "What are your expected salary requirements?"},
    {"key": "languages",          "question": "What languages are you proficient in?"},
    {"key": "githubUrl",          "question": "Please provide a link to your GitHub."},
    {"key": "portfolioUrl",       "question": "Please provide a link to your personal portfolio."},
    {"key": "achievements",       "question": "Describe your professional achievements."},
    # Extra common questions not in the original bank
    {"key": "gender",             "question": "What is your gender?"},
    {"key": "nationality",        "question": "What is your nationality?"},
    {"key": "hobbies",            "question": "What are your hobbies and interests?"},
    {"key": "willingToRelocate",  "question": "Would you consider relocating?"},
    {"key": "workAuthorization",  "question": "Are you legally authorized to work in this country?"},
    {"key": "requiresSponsorship","question": "Will you now or in the future require sponsorship?"},
    {"key": "noticePeriod",       "question": "How much notice do you need to give your current employer?"},
    {"key": "additionalInformation","question": "Is there anything else you would like us to know?"},
]

# Pre-encode the bank questions once
bank_texts     = [q["question"] for q in QUESTION_BANK]
bank_embeddings = model.encode(bank_texts, convert_to_tensor=True)


# ── Request / Response schemas ──────────────────────────────────────────────
class MatchRequest(BaseModel):
    page_questions: List[str]
    threshold: float = 0.5


class MatchResult(BaseModel):
    page_question: str
    matched_key: str | None
    matched_question: str | None
    score: float
    is_match: bool


class MatchResponse(BaseModel):
    results: List[MatchResult]


# ── Endpoint ─────────────────────────────────────────────────────────────────
@app.post("/match", response_model=MatchResponse)
def match_questions(req: MatchRequest):
    """
    For each question from the job page, find the best matching
    question in the known bank. Return the DB key and similarity score.
    """
    if not req.page_questions:
        return MatchResponse(results=[])

    page_embeddings = model.encode(req.page_questions, convert_to_tensor=True)

    results: List[MatchResult] = []
    for i, page_q in enumerate(req.page_questions):
        scores = util.cos_sim(page_embeddings[i], bank_embeddings)[0]
        best_idx   = int(scores.argmax())
        best_score = float(scores[best_idx])

        is_match = best_score >= req.threshold
        results.append(
            MatchResult(
                page_question    = page_q,
                matched_key      = QUESTION_BANK[best_idx]["key"] if is_match else None,
                matched_question = QUESTION_BANK[best_idx]["question"] if is_match else None,
                score            = round(best_score, 4),
                is_match         = is_match,
            )
        )
        logger.info(
            f"  '{page_q[:60]}' → key={QUESTION_BANK[best_idx]['key']} "
            f"score={best_score:.4f} match={is_match}"
        )

    return MatchResponse(results=results)


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
