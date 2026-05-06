import os
from groq import Groq  # Switched from google.genai
from dotenv import load_dotenv

load_dotenv()

def generate_summary(yesterday: str, today: str, blockers: str) -> str:
    """
    Generates a strictly formatted standup summary using Groq (Llama 3).
    """

    # ✅ Change your .env variable name to GROQ_API_KEY
    api_key = os.getenv("GROQ_API_KEY")

    # ✅ Safe fallback (prevents crash if key missing)
    if not api_key:
        return f"""**Yesterday**
* {yesterday}

**Today**
* {today}

**Blockers**
* {blockers if blockers else "None"}

**Summary**
Basic summary generated without AI."""

    # Initialize the Groq Client
    client = Groq(api_key=api_key)

    # 🔥 STRICT prompt to control output format
    prompt = f"""
You are a strict formatter.

Convert the following standup into EXACTLY this format.
Do NOT add extra sections. Do NOT rename headings.

FORMAT:

**Yesterday**
* bullet point

**Today**
* bullet point

**Blockers**
* bullet point

**Summary**
A comprehensive 2-3 sentence paragraph detailing the overall progress and any implications of the blockers.

RULES:
- Use ONLY the headings above
- Use "*" for bullet points
- Do NOT add "Team Update", "Risks", "Urgency", etc.
- Keep it concise and clean

INPUT:
Yesterday: {yesterday}
Today: {today}
Blockers: {blockers}
"""

    try:
        # Using Llama 3.3 70B for high quality, or llama-3.1-8b-instant for speed
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            timeout=10.0, # Groq is fast, 10s is usually plenty
        )

        return chat_completion.choices[0].message.content.strip()

    except Exception as e:
        # ✅ Fallback if API fails (useful for 429 Rate Limit errors)
        return f"""**Yesterday**
* {yesterday}

**Today**
* {today}

**Blockers**
* {blockers if blockers else "None"}

**Summary**
Fallback summary due to API error."""
# from google import genai
# import os
# from dotenv import load_dotenv

# load_dotenv()


# def generate_summary(yesterday: str, today: str, blockers: str) -> str:
#     """
#     Generates a strictly formatted standup summary.
#     """

#     api_key = os.getenv("GOOGLE_API_KEY")

#     # ✅ Safe fallback (prevents crash if key missing)
#     if not api_key:
#         return f"""**Yesterday**
# * {yesterday}

# **Today**
# * {today}

# **Blockers**
# * {blockers if blockers else "None"}

# **Summary**
# Basic summary generated without AI."""

#     client = genai.Client(api_key=api_key)

#     # 🔥 STRICT prompt to control output format
#     prompt = f"""
# You are a strict formatter.

# Convert the following standup into EXACTLY this format.
# Do NOT add extra sections. Do NOT rename headings.

# FORMAT:

# **Yesterday**
# * bullet point

# **Today**
# * bullet point

# **Blockers**
# * bullet point

# **Summary**
# One short sentence.

# RULES:
# - Use ONLY the headings above
# - Use "*" for bullet points
# - Do NOT add "Team Update", "Risks", "Urgency", etc.
# - Keep it concise and clean

# INPUT:
# Yesterday: {yesterday}
# Today: {today}
# Blockers: {blockers}
# """

#     try:
#         response = client.models.generate_content(
#             model="gemini-1.5-flash",
#             contents=prompt,
#             config={
#                 "http_options": {"timeout": 30000}
#             }
#         )

#         return response.text.strip()

#     except Exception as e:
#         # ✅ Fallback if API fails
#         return f"""**Yesterday**
# * {yesterday}

# **Today**
# * {today}

# **Blockers**
# * {blockers if blockers else "None"}

# **Summary**
# Fallback summary due to API error."""

# from google import genai
# import os
# from dotenv import load_dotenv

# load_dotenv()

# client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# def generate_summary(yesterday: str, today: str, blockers: str) -> str:
#     """
#     Calls the new Google Gen AI SDK to reformat standup input with a timeout.
#     """
#     prompt = f"""You are a professional scrum master. Reformat the following daily standup into a concise, clean summary.

# Yesterday: {yesterday}
# Today: {today}
# Blockers: {blockers}

# Format the output exactly like this:
# ✅ Yesterday: <one clear sentence>
# 🎯 Today: <one clear sentence>
# 🚧 Blockers: <one clear sentence, or "None" if no blockers>"""

#     # Added request_options to handle the 10-second timeout
#     response = client.models.generate_content(
#         model="gemini-1.5-flash", 
#         contents=prompt,
#         config={
#             "http_options": {"timeout": 30000} # Timeout in milliseconds for the new SDK
#         }
#     )
    
#     return response.text.strip()

# # Example usage:
# # print(generate_summary("Fixed login bug", "Working on UI", "None"))