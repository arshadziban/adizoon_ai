# Adizoon AI

[![GitHub](https://img.shields.io/badge/GitHub-adizoon__ai-blue?logo=github)](https://github.com/arshadziban/adizoon_ai)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?logo=fastapi)](https://fastapi.tiangolo.com)

An intelligent voice-powered AI chatbot that combines OpenAI Whisper for speech-to-text transcription with Perplexity AI for smart conversational responses.

## Features

- **Voice Recording** - Record audio directly in the browser
- **Speech-to-Text** - Powered by OpenAI Whisper
- **AI Responses** - Context-aware replies using Perplexity AI
- **Chat History** - Persistent conversation storage
- **Dark Theme** - Modern, eye-friendly interface
- **Responsive Design** - Works on desktop and mobile

## Screenshots

### Login Page
![Login](./ui/1.png)

### Chat Interface
![Chat Interface](./ui/2.png)

### Voice Recording
![Voice Recording](./ui/3.png)

### AI Response
![AI Response](./ui/4.png)

### Profile Page
![Profile](./ui/5.png)

### Settings
![Settings](./ui/6.png)

### About Page
![About](./ui/7.png)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | FastAPI (Python 3.11) |
| Speech-to-Text | OpenAI Whisper |
| AI Chat | Perplexity AI (sonar-pro) |

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Perplexity API Key

### Backend Setup

```bash
cd backend
python -m venv env
env\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create `.env` file:
```
PERPLEXITY_API_KEY=your_api_key_here
```

Run the server:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## How It Works

```
┌─────────────────┐
│  🎤 Record      │
│     Audio       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  🎧 Whisper     │
│  Transcription  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  🤖 Perplexity  │
│     AI Chat     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  💬 Display     │
│    Response     │
└─────────────────┘
```

## Project Structure

```
adizoon_ai/
├── backend/
│   ├── main.py           # FastAPI app
│   ├── whisper_service.py # Speech-to-text
│   ├── rewrite_service.py # AI chat
│   └── config.py         # Configuration
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main component
│   │   ├── ChatWindow.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/transcribe` | Transcribe audio and get AI response |
| POST | `/chat` | Text-based chat |

## License

MIT

## Author

**Arshad Ziban** - [GitHub](https://github.com/arshadziban)


