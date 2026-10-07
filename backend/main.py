import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from supabase import create_client, Client
from google import genai
from google.genai import types

# 1. Load Environment Variables from backend/.env
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# Initialize Supabase Client (sanitizing URL if /rest/v1 is present)
raw_supabase_url = os.getenv("SUPABASE_URL", "")
supabase_url = raw_supabase_url.split("/rest/v1")[0].rstrip("/") if raw_supabase_url else ""
supabase_key = os.getenv("SUPABASE_KEY", "")

supabase: Optional[Client] = None
if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"Warning: Failed to initialize Supabase client: {e}")

# Initialize Gemini Client (using GEMINI_API_KEY from .env, never exposing the key)
gemini_api_key = os.getenv("GEMINI_API_KEY", "")
gemini_client: Optional[genai.Client] = None
if gemini_api_key:
    try:
        gemini_client = genai.Client(api_key=gemini_api_key)
    except Exception as e:
        print(f"Warning: Failed to initialize Gemini client: {e}")

# 2. Initialize FastAPI Application
app = FastAPI(
    title="IntelliMail Backend",
    description="AI email assistant backend service with Gemini and Supabase integration",
    version="1.0.0"
)

# 3. Enable CORS (allows frontend requests from http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Define Pydantic Models for Request and Response
class EmailAnalyzeRequest(BaseModel):
    subject: str = Field(..., description="Subject line of the email")
    body: str = Field(..., description="Full text body of the email")
    sender: Optional[str] = Field(None, description="Sender email address or name")

class SuggestedReply(BaseModel):
    tone: str = Field(..., description="Tone of the response, e.g., Professional, Concise, Friendly")
    text: str = Field(..., description="Draft reply text")

class AiAnalysis(BaseModel):
    category: str = Field(..., description="Classification category")
    priority: str = Field(..., description="Priority level: High, Medium, or Low")
    sentiment: str = Field(..., description="Sentiment of the sender")
    intent: str = Field(..., description="Identified sender intent")
    summary: str = Field(..., description="Executive summary of the email")
    action_required: str = Field(..., description="Required next step or action")
    confidence: str = Field(..., description="Model confidence score, e.g. 98%")

class EmailAnalyzeResponse(BaseModel):
    ai_analysis: AiAnalysis
    suggested_replies: List[SuggestedReply]

class EmailUpdateRequest(BaseModel):
    read: Optional[bool] = None
    starred: Optional[bool] = None
    folder: Optional[str] = None

# Helper function for fallback analysis if Gemini API is unavailable
def generate_fallback_analysis(payload: EmailAnalyzeRequest) -> EmailAnalyzeResponse:
    subject_lower = payload.subject.lower()
    body_lower = payload.body.lower()

    if any(word in subject_lower or word in body_lower for word in ["urgent", "critical", "down", "bug", "error", "sev-1"]):
        category = "Support & Escalation"
        priority = "High"
        sentiment = "Frustrated / Urgent"
        intent = "Report an urgent system or service disruption requiring prompt resolution."
        summary = f"Sender is reporting a high-priority incident regarding '{payload.subject}'. Immediate investigation needed."
        action_required = "Escalate to engineering on-call and send acknowledgement status."
        confidence = "99%"
        replies = [
            SuggestedReply(
                tone="Professional & Urgent",
                text="Hi,\n\nThank you for reaching out. We have acknowledged this issue and our team is actively investigating. We will provide an update within 30 minutes.\n\nBest regards,\nSupport Team"
            ),
            SuggestedReply(
                tone="Concise",
                text="Hi,\n\nReceived. Engineering is on it now. Will update you shortly.\n\nThanks,\nSupport Team"
            )
        ]
    elif any(word in subject_lower or word in body_lower for word in ["invoice", "payment", "bill", "pricing"]):
        category = "Billing & Finance"
        priority = "Low"
        sentiment = "Neutral / Informational"
        intent = "Inquiry or confirmation regarding billing, receipts, or account invoices."
        summary = f"Billing-related communication regarding '{payload.subject}'."
        action_required = "Review invoice records and forward to accounting."
        confidence = "97%"
        replies = [
            SuggestedReply(
                tone="Standard Acknowledgment",
                text="Hi,\n\nThank you for the billing update. We have noted this in our records.\n\nBest regards,\nFinance Team"
            ),
            SuggestedReply(
                tone="Concise",
                text="Hi,\n\nInvoice received and noted for our accounting records.\n\nBest,\nFinance Team"
            )
        ]
    else:
        category = "General Communication"
        priority = "Medium"
        sentiment = "Positive / Collaborative"
        intent = "General inquiry, meeting request, or collaboration update."
        summary = f"General update regarding '{payload.subject}'. Sender is reaching out for coordination."
        action_required = "Review details and respond with availability."
        confidence = "95%"
        replies = [
            SuggestedReply(
                tone="Warm & Professional",
                text="Hi,\n\nThanks for reaching out! I reviewed your message and would be happy to discuss further. Let me know what times work best for you.\n\nBest,\nAlex"
            ),
            SuggestedReply(
                tone="Concise",
                text="Hi,\n\nSounds good! Let's connect soon to discuss this.\n\nBest,\nAlex"
            )
        ]

    return EmailAnalyzeResponse(
        ai_analysis=AiAnalysis(
            category=category,
            priority=priority,
            sentiment=sentiment,
            intent=intent,
            summary=summary,
            action_required=action_required,
            confidence=confidence
        ),
        suggested_replies=replies
    )

# 5. Endpoints

@app.get("/health")
def health_check():
    """Health check endpoint to verify backend status."""
    return {"status": "healthy"}

@app.get("/api/emails")
def get_emails():
    """
    Fetch all emails from the Supabase 'emails' table.
    """
    if not supabase:
        return []
    try:
        response = supabase.table("emails").select("*").order("created_at", desc=True).execute()
        return response.data or []
    except Exception as e:
        print(f"Error fetching emails from Supabase: {e}")
        return []

@app.post("/api/emails/analyze", response_model=EmailAnalyzeResponse)
def analyze_email(payload: EmailAnalyzeRequest):
    """
    Analyzes incoming email content using Gemini, saves the email
    and analysis to the Supabase 'emails' table, and returns structured
    AI insights along with 2 suggested replies of distinct tones.
    """
    analysis_response: Optional[EmailAnalyzeResponse] = None

    # 1. Call Gemini API if client is configured
    if gemini_client:
        try:
            prompt = (
                f"Analyze the following incoming email:\n\n"
                f"Sender: {payload.sender or 'Unknown'}\n"
                f"Subject: {payload.subject}\n"
                f"Body:\n{payload.body}\n\n"
                f"Instructions:\n"
                f"- Category: E.g., Support & Escalation, Billing & Finance, Investor Relations, Product & Design, General Communication.\n"
                f"- Priority: 'High', 'Medium', or 'Low'.\n"
                f"- Sentiment: E.g., Frustrated / Urgent, Positive / Enthusiastic, Neutral / Informational.\n"
                f"- Intent: A clear 1-sentence statement of sender intent.\n"
                f"- Summary: A concise 1-2 sentence executive summary.\n"
                f"- Action Required: Concrete next step or 'No action required'.\n"
                f"- Confidence: Model confidence percentage, e.g., '98%'.\n"
                f"- Suggested Replies: Exactly 2 replies with distinct tones (e.g., 'Professional' and 'Concise')."
            )

            response = gemini_client.models.generate_content(
               model="gemini-3.8-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=EmailAnalyzeResponse,
                ),
            )

            if response.text:
                analysis_response = EmailAnalyzeResponse.model_validate_json(response.text)
        except Exception as err:
            print(f"Notice: Gemini analysis error: {err}. Using fallback generator.")

    # 2. Use fallback analysis if Gemini call was not available or failed
    if not analysis_response:
        analysis_response = generate_fallback_analysis(payload)

    # 3. Save email and analysis to the Supabase 'emails' table (unchanged)
    if supabase:
        try:
            action_text = analysis_response.ai_analysis.action_required
            action_required_bool = not (
                "no action" in action_text.lower() or "none" in action_text.lower()
            )

            conf_str = analysis_response.ai_analysis.confidence
            conf_clean = conf_str.replace("%", "").strip()
            try:
                conf_num = float(conf_clean) / 100.0 if "%" in conf_str else float(conf_clean)
            except ValueError:
                conf_num = 0.95

            email_record = {
                "sender": payload.sender or "unknown@example.com",
                "subject": payload.subject,
                "body": payload.body,
                "category": analysis_response.ai_analysis.category,
                "priority": analysis_response.ai_analysis.priority,
                "sentiment": analysis_response.ai_analysis.sentiment,
                "intent": analysis_response.ai_analysis.intent,
                "summary": analysis_response.ai_analysis.summary,
                "action_required": action_required_bool,
                "confidence": conf_num,
                "suggested_replies": [reply.model_dump() for reply in analysis_response.suggested_replies],
            }
            supabase.table("emails").insert(email_record).execute()
        except Exception as e:
            print(f"Error saving to Supabase emails table: {e}")

    # 4. Return structured response
    return analysis_response

class SendReplyRequest(BaseModel):
    emailId: str
    text: str
    tone: Optional[str] = None

@app.post("/api/emails/reply")
def send_reply(payload: SendReplyRequest):
    """
    Persist a sent reply into the Supabase 'emails' table with folder = 'sent'.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection is not configured")

    try:
        # Fetch original email to copy subject context
        orig = supabase.table("emails").select("subject,sender").eq("id", payload.emailId).limit(1).execute()
        orig_data = (orig.data[0] if orig.data else {})

        subject = orig_data.get("subject", "")
        re_subject = subject if subject.lower().startswith("re:") else f"Re: {subject}"

        reply_record = {
            "sender": "alex.rivera@intellimail.ai",
            "subject": re_subject,
            "body": payload.text,
            "folder": "sent",
            "read": True,
            "starred": False,
        }
        if payload.tone:
            reply_record["category"] = payload.tone

        result = supabase.table("emails").insert(reply_record).execute()
        return {"message": "Reply sent and persisted", "data": result.data}
    except Exception as e:
        print(f"Error persisting reply: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/emails/{email_id}")
def update_email(email_id: str, payload: EmailUpdateRequest):
    """
    Update specific email fields (read, starred, folder) in Supabase.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection is not configured")

    # Only include fields that were explicitly provided
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return {"message": "No fields to update", "updated": False}

    try:
        response = supabase.table("emails").update(update_data).eq("id", email_id).execute()
        return {"message": "Email updated successfully", "data": response.data}
    except Exception as e:
        print(f"Error updating email {email_id} in Supabase: {e}")
        raise HTTPException(status_code=500, detail=str(e))

