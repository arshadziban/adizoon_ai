# Adizoon: Intelligent Conversational AI Platform with Audio Transcription

[![GitHub](https://img.shields.io/badge/GitHub-adizoon__ai-blue?logo=github)](https://github.com/arshadziban/adizoon_ai)

An enterprise-grade conversational artificial intelligence system integrating real-time audio transcription via OpenAI Whisper and advanced natural language processing through Perplexity AI.

## Repository

**GitHub**: https://github.com/arshadziban/adizoon_ai.git

## Project Overview

Adizoon is a comprehensive full-stack web application that seamlessly integrates real-time audio transcription capabilities with intelligent conversational AI responses. The system facilitates users to record or upload audio files, which are automatically transcribed and processed through an advanced artificial intelligence framework to generate contextually appropriate and semantically coherent replies. The platform demonstrates multilingual support and provides a sophisticated user interface for efficient voice-to-text-to-response workflows.

## Screenshots

![Adizoon Interface](./ui/1.png)
![Audio Upload](./ui/2.png)
![Results](./ui/3.png)

## Tech Stack

- **Backend**: FastAPI (Python 3.11)
- **Frontend**: React + Vite + Tailwind CSS
- **Speech-to-Text**: OpenAI Whisper
- **Chatbot**: Perplexity AI (sonar-pro model)

## System Architecture

```
┌─────────────────────────┐
│    Record Audio         │
│   🎙️  Microphone       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Transcribe Audio       │
│  🎧 Whisper Model      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Generate Response      │
│  💡 Perplexity AI      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Display Response       │
│  💻 Chat Interface     │
└─────────────────────────┘
```

## Conclusion

Adizoon represents a sophisticated integration of state-of-the-art speech recognition technology and advanced natural language processing capabilities. Through the strategic incorporation of OpenAI Whisper for robust speech-to-text conversion and Perplexity AI for semantically coherent response generation, the platform delivers a comprehensive solution for multi-modal interactive dialogue systems and advanced conversational artificial intelligence applications.


