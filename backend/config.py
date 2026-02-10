
import os
from dotenv import load_dotenv

load_dotenv()

# Perplexity AI Configuration for Chatbot
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

# Application Settings
APP_NAME = "Adizoon"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "AI-powered conversational chatbot with audio transcription"

# Whisper Model Settings
WHISPER_MODEL = "base"  # Can be: tiny, base, small, medium, large

# Chatbot Model Settings
CHATBOT_MODEL = "sonar-pro"  # Perplexity AI model for chat responses
