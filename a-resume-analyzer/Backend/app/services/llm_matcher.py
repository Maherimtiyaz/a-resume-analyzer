import os
import json
import logging
from openai import AsyncOpenAI
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

# Initialize OpenAI Client
openai_api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=openai_api_key) if openai_api_key else None

async def llm_match_resume(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Use OpenAI LLM to evaluate a resume against a job description.
    Returns a dictionary containing a score, matched/missing keywords, and suggestions.
    """
    if not os.getenv("OPENAI_API_KEY"):
        logger.warning("OPENAI_API_KEY not set. Using fallback logic.")
        return None
        
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
    Evaluate the following Resume against the Job Description.

    Return the evaluation STRICTLY as a JSON object with the following schema:
    {{
        "match_score": <float between 0.0 and 1.0 representing the overall match>,
        "matched_keywords": [<list of key skills/terms found in both>],
        "missing_keywords": [<list of key skills/terms required by JD but missing in Resume>],
        "suggestions": [<list of 2-3 short, actionable tips to improve the resume for this job>]
    }}

    Job Description:
    {job_description}

    Resume:
    {resume_text}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You output strict JSON without markdown blocks."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" },
            temperature=0.2
        )
        
        result_json = response.choices[0].message.content
        result = json.loads(result_json)
        
        # Ensure correct types
        return {
            "match_score": float(result.get("match_score", 0.0)),
            "matched_keywords": result.get("matched_keywords", []),
            "missing_keywords": result.get("missing_keywords", []),
            "suggestions": result.get("suggestions", [])
        }
    except Exception as e:
        logger.error(f"Error in LLM matching: {e}")
        return None
