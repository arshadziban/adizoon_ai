import requests
import os
import re
from dotenv import load_dotenv

load_dotenv()

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
if PERPLEXITY_API_KEY:
    PERPLEXITY_API_KEY = PERPLEXITY_API_KEY.strip()
URL = "https://api.perplexity.ai/chat/completions"

def remove_citations(text):
    """
    Remove citation markers like [1], [2][3], etc. from the text.
    """
    # Remove patterns like [1], [2], [1][2][3], etc.
    cleaned = re.sub(r'\[\d+\]', '', text)
    # Clean up any extra spaces left behind
    cleaned = re.sub(r'  +', ' ', cleaned)
    return cleaned.strip()

def generate_chatbot_response(user_message, history=None):
    """
    Generate an AI chatbot response to user input using Perplexity AI.
    
    Args:
        user_message: The user's transcribed or typed message
        history: List of previous messages [{"role": "user"/"assistant", "content": "..."}]
        
    Returns:
        The AI chatbot's response
    """
    if not PERPLEXITY_API_KEY:
        print("Warning: PERPLEXITY_API_KEY not found. Returning default response.")
        return "I'm sorry, but I'm not configured to respond right now."
    
    print(f"[ChatBot] Processing user message: {user_message}")
    print(f"[ChatBot] Conversation history: {len(history) if history else 0} messages")
    
    messages = [
        {
            "role": "system",
            "content": "You are Adizoon, a friendly conversational AI assistant. Keep responses short and natural. For simple greetings like 'hello' or 'hi', just greet back casually. Only give detailed answers when the user asks a specific question. Do not over-explain or add unnecessary information. Do not use tables unless the user specifically asks for one. Remember the context of the conversation."
        }
    ]
    
    # Add conversation history (limit to last 20 messages to stay within token limits)
    if history:
        for msg in history[-20:]:
            content = msg.get("content", "").strip()
            role = msg.get("role", "user")
            # Skip empty messages and ensure valid roles
            if not content:
                continue
            if role not in ("user", "assistant"):
                role = "user"
            messages.append({
                "role": role,
                "content": content
            })
    
    # Add current user message
    messages.append({
        "role": "user",
        "content": user_message
    })
    
    payload = {
        "model": "sonar-pro",
        "messages": messages
    }

    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        result = response.json()["choices"][0]["message"]["content"]
        # Remove citation markers like [1], [2], etc.
        result = remove_citations(result)
        print(f"[ChatBot] Response generated: {result[:100] if len(result) > 100 else result}")
        return result
    except Exception as e:
        print(f"Error calling Perplexity API: {str(e)}")
        return "I encountered an error while processing your message."


# Keep backward compatibility with old function name
def rewrite_formal(text):
    """
    Deprecated: Use generate_chatbot_response instead.
    This function is kept for backward compatibility.
    """
    return generate_chatbot_response(text)
