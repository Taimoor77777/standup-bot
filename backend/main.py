from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables FIRST before importing other modules
load_dotenv()

from supabase import create_client
from schemas import StandupInput, StandupResponse
from services.ai_service import generate_summary

app = FastAPI(title="Standup Bot API")

# ── CORS ──────────────────────────────────────────────────────────────────────
# Without this, the browser blocks all requests from the frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",           # local Vite dev server
        "http://127.0.0.1:5173",
        os.getenv("FRONTEND_URL", ""),     # production Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Supabase client ────────────────────────────────────────────────────────────
supabase = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", ""),
)


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/summarize", response_model=StandupResponse)
def summarize(data: StandupInput):
    """
    Accepts standup fields, calls OpenAI, saves to Supabase, returns summary.
    """
    try:
        summary = generate_summary(data.yesterday, data.today, data.blockers)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")

    # Save to Supabase history
    try:
        result = supabase.table("standups").insert({
            "yesterday": data.yesterday,
            "today": data.today,
            "blockers": data.blockers,
            "summary": summary,
        }).execute()
        record_id = result.data[0]["id"] if result.data else None
    except Exception as e:
        # Don't fail the whole request if DB write fails — still return summary
        print(f"Supabase insert failed: {e}")
        record_id = None

    return StandupResponse(summary=summary, id=record_id)


@app.get("/history")
def get_history():
    """
    Returns the last 20 standup summaries from Supabase.
    """
    try:
        result = (
            supabase.table("standups")
            .select("id, created_at, summary, yesterday, today, blockers")
            .order("created_at", desc=True)
            .limit(20)
            .execute()
        )
        return {"standups": result.data}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Database error: {str(e)}")
